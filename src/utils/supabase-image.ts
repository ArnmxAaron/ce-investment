import { supabase } from '../lib/supabaseClient' // adjust to your path

export const getImageUrl = (path: string | null) => {
  if (!path) return null;

  // Replace 'product-images' with your actual Supabase bucket name
  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(path);

  return data.publicUrl;
};