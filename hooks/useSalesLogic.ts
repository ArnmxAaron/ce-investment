'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface Variant {
  id: string;
  product_id: string;
  name: string;   
  price: number;
  stock: number;
  type?: string;  
  [key: string]: any; 
}

export interface Product {
  id: string;
  name: string;
  category: string;
  image_path?: string;
  is_deleted: boolean;
  variants: Variant[];
}

export interface CartItem {
  id: string;          
  product_id: string;  
  name: string;        
  variant_name: string; 
  quantity: number;
  price: number;
  category: string;
}

export function useSalesLogic() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`id, name, category, image_path, is_deleted, variants`)
        .or('is_deleted.is.null,is_deleted.eq.false')
        .order('name', { ascending: true });

      if (error) throw error;

      const mappedProducts = (data as any[] || []).map(p => {
        const mappedVariants = (p.variants || []).map((v: any, index: number) => ({
          id: v.id || `${p.id}-${index}`, 
          product_id: p.id,
          name: v.name || v.type || 'Standard', 
          price: Number(v.price) || 0,
          stock: Number(v.stock) || 0
        }));
        return { ...p, variants: mappedVariants };
      });

      setProducts(mappedProducts.filter(p => p.variants.length > 0));
    } catch (err: any) {
      console.error("Fetch Error:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const totalAmount = useMemo(() => 
    cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), 
  [cart]);

  const addToCart = (product: Product, variant: Variant, quantity: number) => {
    if (variant.stock < quantity) {
      setToast({ message: "Insufficient stock!", type: 'error' });
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === variant.id);
      
      if (existing) {
        if (existing.quantity + quantity > variant.stock) {
          setToast({ message: "Limited stock available", type: 'error' });
          return prev;
        }
        return prev.map(item => 
          item.id === variant.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }

      // CRITICAL: We include name and variant_name here for the database/receipt
      return [...prev, {
        id: variant.id,
        product_id: product.id,
        name: product.name,
        variant_name: variant.name,
        quantity,
        price: variant.price,
        category: product.category
      }];
    });
  };

  const handleSale = async (buyerName: string, buyerAddress: string) => {
    if (cart.length === 0) return false;
    setIsProcessing(true);

    try {
      const { error } = await supabase.rpc('process_sale_transaction', {
        p_buyer_name: buyerName || "Walking Customer",
        p_buyer_address: buyerAddress || "N/A",
        p_total_amount: totalAmount, 
        p_items: cart 
      });

      if (error) throw error;

      setCart([]);
      setToast({ message: "Sale completed!", type: 'success' });
      await fetchProducts();
      return true; 
    } catch (err: any) {
      console.error("Sale Error:", err.message);
      setToast({ message: "Error: " + err.message, type: 'error' });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return products.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    );
  }, [searchQuery, products]);

  return { 
    products, cart, setCart, searchQuery, setSearchQuery, 
    loading, isProcessing, toast, setToast, 
    fetchProducts, addToCart, handleSale, filteredProducts,
    totalAmount 
  };
}