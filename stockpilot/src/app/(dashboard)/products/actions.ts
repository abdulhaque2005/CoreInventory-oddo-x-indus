'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  const data = {
    name: formData.get('name') as string,
    sku: formData.get('sku') as string,
    category: formData.get('category') as string,
    unit_of_measure: formData.get('unit_of_measure') as string || 'pcs',
    unit_price: parseFloat(formData.get('unit_price') as string) || 0,
    reorder_level: parseInt(formData.get('reorder_level') as string) || 0,
    description: formData.get('description') as string || null,
  }

  const { error } = await supabase.from('products').insert(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/products')
  return { success: true }
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient()

  const data = {
    name: formData.get('name') as string,
    sku: formData.get('sku') as string,
    category: formData.get('category') as string,
    unit_of_measure: formData.get('unit_of_measure') as string || 'pcs',
    unit_price: parseFloat(formData.get('unit_price') as string) || 0,
    reorder_level: parseInt(formData.get('reorder_level') as string) || 0,
    description: formData.get('description') as string || null,
  }

  const { error } = await supabase.from('products').update(data).eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/products')
  return { success: true }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()

  // Note: Due to foreign keys, this might fail if stock exists. 
  // Proper handling would be to set is_active instead, or check dependencies.
  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/products')
  return { success: true }
}
