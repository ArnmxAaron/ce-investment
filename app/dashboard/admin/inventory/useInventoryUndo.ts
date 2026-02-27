'use client'
import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

export function useInventoryUndo(products: any[], setProducts: React.Dispatch<React.SetStateAction<any[]>>) {
  const [showUndo, setShowUndo] = useState(false)
  const [undoItem, setUndoItem] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const undoTimer = useRef<NodeJS.Timeout | null>(null)
  const UNDO_DURATION = 15000 

  const startDeleteTimer = (id: string) => {
    const itemToHide = products.find(p => p.id === id)
    if (!itemToHide) return;

    setUndoItem(itemToHide)
    setErrorMessage(null)
    
    // 1. Instantly hide from view
    setProducts(prev => prev.filter(p => p.id !== id))
    setShowUndo(true)

    if (undoTimer.current) clearTimeout(undoTimer.current)
    
    undoTimer.current = setTimeout(async () => {
      console.log("🛠️ Attempting Soft Delete for:", itemToHide.name);

      // 2. We use UPDATE instead of DELETE. It's much more stable.
      const { error, status } = await supabase
        .from('products')
        .update({ is_deleted: true })
        .eq('id', id);

      if (error) {
        console.error("❌ Soft Delete Failed:", error);
        
        // RECOVERY
        setProducts(prev => [itemToHide, ...prev].sort((a, b) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        ));

        setErrorMessage(`Sync Error: ${itemToHide.name} couldn't be removed.`);
        setTimeout(() => { setShowUndo(false); setErrorMessage(null); }, 4000);
      } else {
        console.log("✅ Item hidden in Database. Status:", status);
        setShowUndo(false);
        setUndoItem(null);
      }
    }, UNDO_DURATION)
  }

  const handleUndo = () => {
    if (undoTimer.current) clearTimeout(undoTimer.current)
    if (undoItem) {
      setProducts(prev => [undoItem, ...prev].sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      ))
    }
    setShowUndo(false)
    setUndoItem(null)
    setErrorMessage(null)
  }

  return { showUndo, undoItem, errorMessage, startDeleteTimer, handleUndo, UNDO_DURATION }
}