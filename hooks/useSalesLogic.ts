'use client'
import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'

// 1. Updated Interfaces to match your new "Variants" structure
export interface ProductVariant {
  type: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  variants: ProductVariant[]; // The array of sizes/types
}

export interface CartItem {
  id: string;         // Unique ID (product.id + variant.type)
  product_id: string; // Original database ID
  name: string;
  variant_type: string;
  quantity: number;
  price: number;
  category: string;
}

export function useSalesLogic() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [isprocessing, setIsProcessing] = useState(false)
  const [newUpdate, setNewUpdate] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  // 2. Updated Fetch Logic
  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) {
      setToast({ message: "Error fetching data", type: 'error' })
    } else {
      setProducts((data as Product[]) || [])
    }
    setLoading(false)
    setNewUpdate(false)
  }

  useEffect(() => {
    fetchProducts()
    
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        setNewUpdate(true)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  // 3. Updated addToCart to handle Variants
  const addToCart = (
    product: Product, 
    quantity: number, 
    price: number, 
    variantType: string
  ) => {
    setCart(prev => {
      // Create a unique key so we can have 5L and 20L of the same product in the cart separately
      const cartItemId = `${product.id}-${variantType}`
      const existing = prev.find(item => item.id === cartItemId)

      if (existing) {
        return prev.map(item => 
          item.id === cartItemId 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        )
      }
      
      const newItem: CartItem = {
        id: cartItemId,
        product_id: product.id,
        name: product.name,
        variant_type: variantType,
        quantity: quantity,
        price: price,
        category: product.category
      }
      return [...prev, newItem]
    })
  }

  // 4. Updated handleSale to update the specific variant stock
  const handleSale = async () => {
    if (cart.length === 0) return
    setIsProcessing(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      for (const item of cart) {
        // Record the sale
        await supabase.from('sales').insert([{ 
          product_id: item.product_id, 
          quantity: item.quantity, 
          total_price: item.price * item.quantity, 
          variant_sold: item.variant_type,
          sold_by: user?.id 
        }])
        
        // Update Stock Logic: Find the product, find the variant, subtract stock
        const { data: currentProduct } = await supabase
          .from('products')
          .select('variants')
          .eq('id', item.product_id)
          .single()

        if (currentProduct) {
          const updatedVariants = currentProduct.variants.map((v: ProductVariant) => {
            if (v.type === item.variant_type) {
              return { ...v, stock: v.stock - item.quantity }
            }
            return v
          })

          await supabase.from('products')
            .update({ variants: updatedVariants })
            .eq('id', item.product_id)
        }
      }

      setToast({ message: "✅ Transaction Complete!", type: 'success' })
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