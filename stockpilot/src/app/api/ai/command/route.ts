import { NextResponse } from 'next/server';
import { callGroq } from '@/lib/ai/groq';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    const extractionPrompt = `Extract inventory intent from this user command: "${prompt}"
    
    Return JSON only:
    {
      "intent": "RECEIPT" | "DELIVERY" | "ADJUSTMENT" | "UNKNOWN",
      "product": "name of product",
      "quantity": number,
      "supplier_or_customer": "name",
      "reason": "optional reason for adjustment",
      "confirmation_message": "A friendly confirmation message asking 'Should I create a receipt for 40 steel rods from Tata?'"
    }
    
    Rules:
    - If intent is unclear, set intent to UNKNOWN.
    - If quantity is missing, default to 0.
    - Be concise.`;

    const response = await callGroq([
      { role: 'system', content: 'You are a precise JSON extractor.' },
      { role: 'user', content: extractionPrompt }
    ]);

    // Parse JSON safely
    const jsonStr = response.replace(/```json/g, '').replace(/```/g, '').trim();
    const commandData = JSON.parse(jsonStr);

    return NextResponse.json(commandData);
  } catch (error: any) {
    console.error('Command Extraction Error:', error);
    // Graceful fallback — let the chat handler take over
    return NextResponse.json({ intent: 'UNKNOWN', product: '', quantity: 0 });
  }
}
