'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createDelivery(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const data = {
    customer: formData.get('customer') as string,
    warehouse_id: formData.get('warehouse_id') as string,
    scheduled_date: formData.get('scheduled_date') as string,
    notes: formData.get('notes') as string,
    responsible_user_id: user.id
  }

  // Insert Delivery
  const { data: delivery, error } = await supabase
    .from('deliveries')
    .insert(data)
    .select()
    .single()

  if (error) return { error: error.message }

  // Insert Delivery Item (Simplified to 1 item per form for MVP)
  const product_id = formData.get('product_id') as string
  const ordered_qty = parseInt(formData.get('ordered_qty') as string)
  
  if (product_id && ordered_qty > 0) {
    await supabase.from('delivery_items').insert({
      delivery_id: delivery.id,
      product_id: product_id,
      ordered_qty: ordered_qty
    })
  }

  revalidatePath('/operations/deliveries')
  return { success: true }
}

export async function markDeliveryDone(deliveryId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Get items
  const { data: items } = await supabase.from('delivery_items').select('*').eq('delivery_id', deliveryId)
  const { data: delivery } = await supabase.from('deliveries').select('*').eq('id', deliveryId).single()

  if (!delivery || !items) return { error: 'Delivery not found' }

  // Check stock availability
  for (const item of items) {
    const qty = item.ordered_qty
    const { data: existingStock } = await supabase
      .from('inventory_stock')
      .select('*')
      .eq('product_id', item.product_id)
      .eq('warehouse_id', delivery.warehouse_id)
      .is('location_id', null)
      .single()

    if (!existingStock || existingStock.on_hand_qty < qty) {
      return { error: 'Insufficient stock in general warehouse pool for one or more products.' }
    }
  }

  // Mark delivery as done
  const { error: updateError } = await supabase
    .from('deliveries')
    .update({ status: 'done', done_date: new Date().toISOString() })
    .eq('id', deliveryId)

  if (updateError) return { error: updateError.message }

  // Update inventory stock and create stock move for each item
  for (const item of items) {
    const qty = item.ordered_qty

    const { data: existingStock } = await supabase
      .from('inventory_stock')
      .select('*')
      .eq('product_id', item.product_id)
      .eq('warehouse_id', delivery.warehouse_id)
      .is('location_id', null)
      .single()

    if (existingStock) {
      // Decrease stock
      await supabase.from('inventory_stock').update({
        on_hand_qty: existingStock.on_hand_qty - qty,
        last_movement_at: new Date().toISOString()
      }).eq('id', existingStock.id)

      // Record move
      await supabase.from('stock_moves').insert({
        reference: delivery.reference,
        move_type: 'delivery',
        product_id: item.product_id,
        quantity: qty,
        delivery_id: delivery.id,
        performed_by: user.id,
        status: 'done'
      })
    }
  }

  revalidatePath('/operations/deliveries')
  revalidatePath('/inventory')
  return { success: true }
}
