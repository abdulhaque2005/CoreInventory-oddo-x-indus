'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function adjustStock(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const productId = formData.get('product_id') as string
  const warehouseId = formData.get('warehouse_id') as string
  const locationId = formData.get('location_id') as string | null
  const quantityString = formData.get('quantity') as string
  const reason = formData.get('reason') as string

  const quantity = parseInt(quantityString)
  if (isNaN(quantity)) return { error: 'Invalid quantity' }

  // Get current stock
  let query = supabase
    .from('inventory_stock')
    .select('*')
    .eq('product_id', productId)
    .eq('warehouse_id', warehouseId)
  
  if (locationId) {
    query = query.eq('location_id', locationId)
  } else {
    query = query.is('location_id', null)
  }

  const { data: stockRecords } = await query.single()

  let stockId = stockRecords?.id
  let newQuantity = quantity

  if (stockRecords) {
    // Determine the difference for the stock move record
    const diff = newQuantity - stockRecords.on_hand_qty

    // Update existing stock
    const { error: updateError } = await supabase
      .from('inventory_stock')
      .update({ on_hand_qty: newQuantity, last_movement_at: new Date().toISOString() })
      .eq('id', stockId)

    if (updateError) return { error: updateError.message }

    // Create stock move
    await supabase.from('stock_moves').insert({
      reference: `ADJ-${Date.now()}`,
      move_type: 'adjustment',
      product_id: productId,
      to_location_id: locationId || null,
      quantity: diff,
      performed_by: user.id,
      reason: reason
    })

  } else {
    // Create new stock record
    const { data: newStock, error: insertError } = await supabase
      .from('inventory_stock')
      .insert({
        product_id: productId,
        warehouse_id: warehouseId,
        location_id: locationId || null,
        on_hand_qty: newQuantity,
        last_movement_at: new Date().toISOString()
      })
      .select()
      .single()

    if (insertError) return { error: insertError.message }

    // Create stock move
    await supabase.from('stock_moves').insert({
      reference: `ADJ-${Date.now()}`,
      move_type: 'adjustment',
      product_id: productId,
      to_location_id: locationId || null,
      quantity: newQuantity,
      performed_by: user.id,
      reason: reason
    })
  }

  revalidatePath('/inventory')
  return { success: true }
}
