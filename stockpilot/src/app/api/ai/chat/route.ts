import { NextResponse } from 'next/server';
import { callGroq } from '@/lib/ai/groq';

export async function POST(req: Request) {
  try {
    const { messages, inventoryContext } = await req.json();
    
    // Use client-provided inventory context (from Zustand store) 
    // This avoids dependency on Supabase tables that may not exist
    const contextStr = inventoryContext 
      ? JSON.stringify(inventoryContext)
      : 'No inventory data provided. Ask the user for specifics.';

    const systemPrompt = {
      role: 'system',
      content: `You are StockPilot AI, a senior warehouse inventory analyst.
      
You have access to the following LIVE inventory data from the warehouse:
${contextStr}

INSTRUCTIONS:
- Answer inventory questions clearly using the provided data.
- Use a professional tone. Be concise but precise.  
- If asked about stock levels, reference specific product names and quantities.
- When discussing trends, use the movement history data.
- Format numbers with commas (e.g., 5,000) for readability.
- If data is missing from context, say so and suggest which section to check.
- Never fabricate data that isn't in the context provided.`
    };

    const fullMessages = [systemPrompt, ...messages];
    const aiResponse = await callGroq(fullMessages);

    return NextResponse.json({ content: aiResponse });
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    // Return a helpful fallback instead of a raw error
    return NextResponse.json({ 
      content: `I'm having trouble connecting to the AI engine right now. Here's what I can tell you from your dashboard:\n\n• Check the **Inventory** page for current stock levels\n• Check **Receipts** for incoming orders\n• Check **Move History** for recent transfers\n\nPlease try again in a moment.`
    });
  }
}
