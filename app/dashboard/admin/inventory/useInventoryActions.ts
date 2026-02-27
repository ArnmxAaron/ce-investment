'use client'
import { supabase } from '@/lib/supabase'
import * as XLSX from 'xlsx'

export function useInventoryActions(fetchInventory: () => void) {
  
  const executeCleanup = async (setLoading: (b: boolean) => void) => {
    setLoading(true)
    try {
      const { data: allProducts } = await supabase.from('products').select('id, name')
      if (!allProducts) return
      const seen = new Set()
      const duplicates: string[] = []
      allProducts.forEach(p => {
        const nameKey = p.name.trim().toUpperCase()
        if (seen.has(nameKey)) duplicates.push(p.id)
        else seen.add(nameKey)
      })
      if (duplicates.length > 0) {
        await supabase.from('products').delete().in('id', duplicates)
        fetchInventory()
      }
    } finally { setLoading(false) }
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
            acc[itemName] = { name: itemName, category: sheetName, variants: [], updated_at: new Date().toISOString() }
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
      const { error } = await supabase.from('products').upsert(allItems, { onConflict: 'name' })
      if (error) throw error
      fetchInventory()
      alert("Import Successful: Overridden existing items.")
    } catch (e: any) { alert(e.message) } finally { setLoading(false) }
  }

  const executeManualAdd = async (name: string, variants: any[], setLoading: (b: boolean) => void) => {
    setLoading(true)
    try {
      const { error } = await supabase.from('products').upsert([{ 
        name: name.toUpperCase(), variants, category: 'Manual Entry', updated_at: new Date().toISOString()
      }], { onConflict: 'name' })
      if (error) throw error
      fetchInventory()
    } catch (e: any) { alert(e.message) } finally { setLoading(false) }
  }

  return { executeCleanup, executeBulkImport, executeManualAdd }
}