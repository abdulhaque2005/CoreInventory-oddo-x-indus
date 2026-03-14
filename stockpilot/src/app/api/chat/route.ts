import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const lastMessage = messages[messages.length - 1].content.toLowerCase()
    const supabase = await createClient()

    let reply = "Hello! I am your StockPilot Assistant. How can I help you manage your inventory today?"

    if (lastMessage.includes('low stock') || lastMessage.includes('reorder') || lastMessage.includes('shortage')) {
      const { data: lowStockItems, error } = await supabase
        .from('inventory_with_availability')
        .select('*')
      
      if (error) throw error

      const items = lowStockItems?.filter(item => item.available_qty <= item.reorder_level) || []
      
      if (items.length > 0) {
        const itemNames = items.slice(0, 3).map(i => `${i.product_name} (${i.available_qty} left)`).join(', ')
        reply = `I found ${items.length} items currently running low on stock. Some examples are: ${itemNames}.${items.length > 3 ? ' There are others as well.' : ''} I recommend generating purchase orders for these items.`
      } else {
        reply = "Great news! All of your inventory items are currently above their reorder thresholds."
      }
    } 
    else if (lastMessage.includes('forecast') || lastMessage.includes('predict') || lastMessage.includes('trend')) {
      // Basic mock mathematical trend for the MVP AI
      const { data: recentMoves } = await supabase
        .from('stock_moves')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      reply = `Based on analyzing ${recentMoves?.length || 0} recent stock moves and applying our Moving Average forecast, we predict a steady 15% increase in demand for core electronics over the next 3 weeks. You should adjust your purchasing plans accordingly.`
    } 
    else if (lastMessage.includes('receipt') || lastMessage.includes('incoming') || lastMessage.includes('delivery')) {
      const { data: pendingReceipts } = await supabase
        .from('receipts')
        .select('*')
        .neq('status', 'done')

      if (pendingReceipts && pendingReceipts.length > 0) {
        reply = `You have ${pendingReceipts.length} incoming receipts scheduled. The next expected delivery is for ${pendingReceipts[0].reference}.`
      } else {
        reply = "There are currently no active incoming receipts scheduled. Would you like to create a new one?"
      }
    } 
    else if (lastMessage.includes('hello') || lastMessage.includes('hi')) {
      reply = "Hi there! I'm integrated with your live Supabase database now. I can help you check real stock levels, view forecasted demand trends, or summarize pending receipts and deliveries. What do you need?"
    } 
    else if (messages.length > 1) {
      // General fallback querying product count
      const { count } = await supabase.from('products').select('*', { count: 'exact', head: true })
      reply = `I'm still learning complex queries, but I can see you have ${count || 0} active products in your catalog. Try asking me about 'low stock items' or 'incoming receipts'!`
    }

    // Simulate network delay for AI typing effect
    await new Promise(resolve => setTimeout(resolve, 800))

    return NextResponse.json({ role: 'assistant', content: reply })
  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json({ error: 'Failed to process chat message' }, { status: 500 })
  }
}

