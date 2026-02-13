import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'

export interface Product {
  id: string;
  name: string;
  price: number;
  stock_qty: number;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export function useSalesLogic() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [isprocessing, setIsProcessing] = useState(false)
  const [newUpdate, setNewUpdate] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  // Auto-hide toast logic
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').gt('stock_qty', 0).order('name', { ascending: true })
    setProducts((data as Product[]) || [])
    setLoading(false)
    setNewUpdate(false)
  }

  useEffect(() => {
    fetchProducts()
    
    // Real-time listener for the notification bell
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'products' }, () => {
        setNewUpdate(true)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  /**
   * Updated addToCart to handle multiple arguments from page.tsx
   * @param product The base product object
   * @param quantity The amount selected in the modal
   * @param customPrice The specific price (if changed/variant price)
   * @param variantType Optional string describing the variant
   */
  const addToCart = (
    product: Product, 
    quantity: number = 1, 
    customPrice?: number, 
    variantType?: string
  ) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      const finalPrice = customPrice !== undefined ? customPrice : product.price

      if (existing) {
        // Check if adding this quantity exceeds available stock
        if (existing.quantity + quantity > product.stock_qty) {
          setToast({ message: "⚠️ Maximum stock reached", type: 'info' })
          return prev
        }
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity, price: finalPrice } 
            : item
        )
      }
      
      // If it's a new item, use the provided quantity and price
      return [...prev, { ...product, quantity, price: finalPrice }]
    })
  }

  const handleSale = async () => {
    if (cart.length === 0) return
    setIsProcessing(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      for (const item of cart) {
        // 1. Record the sale
        await supabase.from('sales').insert([{ 
          product_id: item.id, 
          quantity: item.quantity, 
          total_price: item.price * item.quantity, 
          sold_by: user?.id 
        }])
        
        // 2. Update the stock in the products table
        await supabase.from('products').update({ 
          stock_qty: item.stock_qty - item.quantity 
        }).eq('id', item.id)
      }

      setToast({ message: "✅ Sale Confirmed!", type: 'success' })
      setCart([])
      fetchProducts()
    } catch (err: any) {
      setToast({ message: "❌ Error: " + err.message, type: 'error' })
    } finally {
      setIsProcessing(false)
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, products])

  return { 
    products, cart, setCart, searchQuery, setSearchQuery, 
    loading, isprocessing, newUpdate, setNewUpdate, 
    toast, setToast, fetchProducts, addToCart, 
    handleSale, filteredProducts 
  }
}