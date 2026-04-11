import { supabase } from '@/lib/supabase'

export const updateProduct = async (id: string, variantId: string, data: any) => {
  // 1. Update the main product info (Name & Image)
  const { error: prodError } = await supabase
    .from('products')
    .update({ 
      name: data.name, 
      image_path: data.image_path,
      is_deleted: false // Ensure it's marked as active if updated
    })
    .eq('id', id);

  if (prodError) throw prodError;

  // 2. Update the variant (Price & Stock) 
  // FIX: Table name changed from 'product_variants' to 'variants'
  const { error: varError } = await supabase
    .from('variants') 
    .update({ 
      price: Number(data.price), 
      stock: Number(data.stock) 
    })
    .eq('id', variantId);

  if (varError) throw varError;
};

export const deleteProduct = async (id: string, imagePath?: string | null) => {
  // 1. Storage Cleanup
  if (imagePath) {
    await supabase.storage.from('product-images').remove([imagePath]);
  }

  // 2. Hard Delete from Database
  // Because of 'ON DELETE CASCADE', this automatically deletes 
  // all rows in the 'variants' table linked to this product ID.
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
};