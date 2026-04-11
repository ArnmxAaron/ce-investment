'use client'
import { supabase } from '@/lib/supabase'
import * as XLSX from 'xlsx'

export function useInventoryActions(fetchInventory: () => void) {
  
  const executeCleanup = async (setLoading: (b: boolean) => void) => {
    setLoading(true)
    try {
      // 1. Fetch all existing products to identify duplicates
      const { data: allProducts, error: fetchError } = await supabase
        .from('products')
        .select('id, name')
      
      if (fetchError) throw fetchError
      if (!allProducts) return

      const seen = new Set()
      const duplicates: string[] = []

      // Identify duplicate IDs based on name
      allProducts.forEach(p => {
        const nameKey = p.name.trim().toUpperCase()
        if (seen.has(nameKey)) {
          duplicates.push(p.id)
        } else {
          seen.add(nameKey)
        }
      })

      if (duplicates.length > 0) {
        // 2. Perform HARD DELETE in database
        const { error: deleteError } = await supabase
          .from('products')
          .delete()
          .in('id', duplicates)

        if (deleteError) throw deleteError

        // 3. Force the global state to refresh
        // This ensures any component using the products list (like Staff Terminal) 
        // gets the clean list immediately.
        await fetchInventory()
        console.log(`Cleaned up ${duplicates.length} duplicate entries.`)
      }
    } catch (e: any) {
      console.error("Cleanup Error:", e.message)
      alert("Cleanup failed: " + e.message)
    } finally { 
      setLoading(false) 
    }
  }

  const executeBulkImport = async (workbook: XLSX.WorkBook, setLoading: (b: boolean) => void) => {
    setLoading(true)
    try {
      let allItems: any[] = []
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName]
        const rawData: any[] = XLSX.utils.sheet_to_json(worksheet)
        
        const grouped = rawData.reduce((acc: any, row: any) => {
          const itemName = row["ITEM"]?.toString().trim().toUpperCase()
          if (!itemName) return acc
          
          if (!acc[itemName]) {
            acc[itemName] = { 
              name: itemName, 
              category: sheetName, 
              variants: [], 
              updated_at: new Date().toISOString() 
            }
          }
          acc[itemName].variants.push({
            type: row["DESCRIPTION"]?.toString() || "Standard",
            price: Number(row["UNIT PRICE"]) || 0,
            stock: 0 
          })
          return acc
        }, {})
        allItems = [...allItems, ...Object.values(grouped)]
      })

      // Use upsert with name as the conflict target to prevent new duplicates
      const { error } = await supabase
        .from('products')
        .upsert(allItems, { onConflict: 'name' })

      if (error) throw error
      
      await fetchInventory()
      alert("Import Successful: Database synchronized.")
    } catch (e: any) { 
      alert(e.message) 
    } finally { 
      setLoading(false) 
    }
  }

  const executeManualAdd = async (name: string, variants: any[], setLoading: (b: boolean) => void) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('products')
        .upsert([{ 
          name: name.toUpperCase().trim(), 
          variants, 
          category: 'Manual Entry', 
          updated_at: new Date().toISOString()
        }], { onConflict: 'name' })

      if (error) throw error
      
      await fetchInventory()
    } catch (e: any) { 
      alert(e.message) 
    } finally { 
      setLoading(false) 
    }
  }

  return { executeCleanup, executeBulkImport, executeManualAdd }
}