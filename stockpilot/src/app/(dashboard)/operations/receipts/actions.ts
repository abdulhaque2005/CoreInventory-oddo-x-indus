'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createReceipt(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const data = {
    supplier: formData.get('supplier') as string,
    warehouse_id: formData.get('warehouse_id') as string,
    scheduled_date: formData.get('scheduled_date') as string,
    notes: formData.get('notes') as string,
    responsible_user_id: user.id
  }

  // Insert Receipt
  const { data: receipt, error } = await supabase
    .from('receipts')
    .insert(data)
    .select()
    .single()

  if (error) return { error: error.message }

  // Insert Receipt Item (Simplified to 1 item per receipt form for MVP)
  const product_id = formData.get('product_id') as string
  const expected_qty = parseInt(formData.get('expected_qty') as string)
  
  if (product_id && expected_qty > 0) {
    await supabase.from('receipt_items').insert({
      receipt_id: receipt.id,
      product_id: product_id,
      expected_qty: expected_qty
    })
  }

  revalidatePath('/operations/receipts')
  return { success: true }
}

export async function markReceiptDone(receiptId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Get receipt items
  const { data: items } = await supabase.from('receipt_items').select('*').eq('receipt_id', receiptId)
  const { data: receipt } = await supabase.from('receipts').select('*').eq('id', receiptId).single()

  if (!receipt || !items) return { error: 'Receipt not found' }

  // Mark receipt as done
  const { error: updateError } = await supabase
    .from('receipts')
    .update({ status: 'done', done_date: new Date().toISOString() })
    .eq('id', receiptId)

  if (updateError) return { error: updateError.message }

  // For each item, update inventory stock and create stock move
  for (const item of items) {
    // We assume received qty = expected qty for simplified MVP
    const qty = item.expected_qty

    // check if stock exists
    const { data: existingStock } = await supabase
      .from('inventory_stock')
      .select('*')
      .eq('product_id', item.product_id)
      .eq('warehouse_id', receipt.warehouse_id)
      .is('location_id', null) // We use general warehouse pool without specific location for MVP receipts
      .single()

    if (existingStock) {
      await supabase.from('inventory_stock').update({
        on_hand_qty: existingStock.on_hand_qty + qty,
        last_movement_at: new Date().toISOString()
      }).eq('id', existingStock.id)
    } else {
      await supabase.from('inventory_stock').insert({
        product_id: item.product_id,
        warehouse_id: receipt.warehouse_id,
        on_hand_qty: qty,
        last_movement_at: new Date().toISOString()
      })
    }

    // create stock move
    await supabase.from('stock_moves').insert({
      reference: receipt.reference,
      move_type: 'receipt',
      product_id: item.product_id,
      quantity: qty,
      receipt_id: receipt.id,
      performed_by: user.id,
      status: 'done'
    })
  }

  revalidatePath('/operations/receipts')
  revalidatePath('/inventory')
  return { success: true }
}
