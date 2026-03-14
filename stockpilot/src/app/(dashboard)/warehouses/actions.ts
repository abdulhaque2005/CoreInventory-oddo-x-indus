'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createWarehouse(formData: FormData) {
  const supabase = await createClient()

  const data = {
    name: formData.get('name') as string,
    code: formData.get('code') as string,
    city: formData.get('city') as string,
    state: formData.get('state') as string,
    max_capacity: parseInt(formData.get('max_capacity') as string) || 0,
  }

  const { error } = await supabase.from('warehouses').insert(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/warehouses')
  return { success: true }
}

export async function createLocation(formData: FormData) {
  const supabase = await createClient()

  const data = {
    warehouse_id: formData.get('warehouse_id') as string,
    name: formData.get('name') as string,
    code: formData.get('code') as string,
    location_type: formData.get('location_type') as string || 'rack',
    max_capacity: parseInt(formData.get('max_capacity') as string) || 0,
  }

  const { error } = await supabase.from('locations').insert(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/warehouses')
  return { success: true }
}
