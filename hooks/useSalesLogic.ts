'use client'
import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'

export interface ProductVariant {
  type: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  image_path?: string;
  variants: ProductVariant[];
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

  // Clear toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) {
      setToast({ message: "Error fetching inventory", type: 'error' })
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

  const addToCart = (product: Product, quantity: number, price: number, variantType: string) => {
    setCart(prev => {
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

  /**
   * handleSale - Option A Implementation
   * Saves the entire transaction as a single row in the 'sales' table.
   */
 const handleSale = async (buyerName: string = "", buyerAddress: string = ""): Promise<boolean> => {
    if (cart.length === 0) return false;
    setIsProcessing(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const finalName = buyerName.trim() === "" ? "Walking Customer" : buyerName;
      const finalAddress = buyerAddress.trim() === "" ? "N/A" : buyerAddress;
      const totalTransactionAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

      // We call the server function. It handles BOTH the sale insert and stock deduction.
      const { error } = await supabase.rpc('handle_staff_sale', {
        p_buyer_name: finalName,
        p_buyer_address: finalAddress,
        p_total_amount: totalTransactionAmount,
        p_items: cart, // The RPC expects the array of items
        p_user_id: user.id
      });

      if (error) throw error;

      setToast({ message: "✅ Transaction Complete!", type: 'success' });
      setCart([]); 
      await fetchProducts(); // Refresh local UI with new stock levels
      return true;

    } catch (err: any) {
      console.error("Sale Error:", err.message);
      setToast({ message: "❌ Error: " + err.message, type: 'error' });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, products])

  return { 
    products, 
    cart, 
    setCart, 
    searchQuery, 
    setSearchQuery, 
    loading, 
    isprocessing, 
    newUpdate, 
    setNewUpdate, 
    toast, 
    setToast, 
    fetchProducts, 
    addToCart, 
    handleSale, 
    filteredProducts 
  }
}