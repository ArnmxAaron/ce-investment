import { supabase } from '@/lib/supabase'

export const updateProduct = async (id: string, variantId: string, data: any) => {
  const { error: prodError } = await supabase
    .from('products')
    .update({ name: data.name, image_path: data.image_path })
    .eq('id', id);

  if (prodError) throw prodError;

  const { error: varError } = await supabase
    .from('product_variants')
    .update({ price: Number(data.price), stock: Number(data.stock) })
    .eq('id', variantId);

  if (varError) throw varError;
};

export const deleteProduct = async (id: string, imagePath?: string) => {
  if (imagePath) {
    await supabase.storage.from('product-images').remove([imagePath]);
  }
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
};