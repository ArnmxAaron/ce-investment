'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import * as XLSX from 'xlsx'

// Split Components
import { InventoryList } from './components/InventoryList'
import { InventoryHeader } from './components/InventoryHeader'
import { InventorySidebar } from './components/InventorySidebar'

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showOnlyZero, setShowOnlyZero] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchInventory() }, [])

  async function fetchInventory() {
    const { data } = await supabase.from('products').select('*').order('name', { ascending: true })
    setProducts(data || [])
  }

  // Multi-Tab Excel Import Logic
  const handleBulkImport = async (workbook: XLSX.WorkBook) => {
    setLoading(true)
    try {
      let allItems: any[] = []
      
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName]
        const rawData: any[] = XLSX.utils.sheet_to_json(worksheet)
        
        const grouped = rawData.reduce((acc: any, row: any) => {
          const itemName = row["ITEM"]?.toString().trim()
          if (!itemName) return acc
          if (!acc[itemName]) {
            acc[itemName] = { name: itemName, category: sheetName, variants: [] }
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

      const { error } = await supabase.from('products').insert(allItems)
      if (error) throw error
      alert("All Excel tabs imported successfully!")
      fetchInventory()
    } catch (e: any) { alert(e.message) } finally { setLoading(false) }
  }

  const handleManualAdd = async (name: string, variants: any[]) => {
    setLoading(true)
    await supabase.from('products').insert([{ name, variants, category: 'Manual Entry' }])
    fetchInventory()
    setLoading(false)
  }

  const filtered = products.filter((p: any) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
    const hasZeroStock = p.variants.some((v: any) => v.stock === 0)
    return showOnlyZero ? (matchesSearch && hasZeroStock) : matchesSearch
  })

  return (
    /* h-screen + overflow-hidden on the wrapper prevents the body from scrolling */
    <div className="h-screen flex flex-col bg-[#F8FAFC] overflow-hidden">
      
      {/* HEADER: Fixed at the top */}
      <InventoryHeader 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        showOnlyZero={showOnlyZero}
        setShowOnlyZero={setShowOnlyZero}
        products={products}
      />

      {/* CONTENT AREA: Takes up remaining height */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR: Independent Scroll */}
        <aside className="w-80 lg:w-96 h-full overflow-y-auto border-r border-slate-100 bg-white/50 custom-scrollbar">
          <InventorySidebar 
            onImport={handleBulkImport} 
            onManualAdd={handleManualAdd} 
            loading={loading} 
          />
        </aside>
        
        {/* MAIN LIST: Independent Scroll */}
        <main className="flex-1 h-full overflow-y-auto p-6 md:p-10 custom-scrollbar scroll-smooth">
          <InventoryList 
            products={filtered} 
            onRefresh={fetchInventory} 
            onDelete={fetchInventory} 
          />
        </main>

      </div>
    </div>
  )
}