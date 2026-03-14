import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getInventoryContext() {
  // Fetch products and stock levels
  const [{ data: products }, { data: stock }, { data: moves }] = await Promise.all([
    supabase.from('products').select('*').limit(10),
    supabase.from('inventory_stock').select('*, products(name, sku)').limit(10),
    supabase.from('stock_moves').select('*, products(name)').order('created_at', { ascending: false }).limit(5)
  ]);

  return {
    products: products || [],
    stock: stock || [],
    recentMoves: moves || []
  };
}

export async function callGroq(messages: any[]) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile', // Groq model
      messages,
      temperature: 0.1,
      stream: false
    })
  });

  const data = await response.json();
  if (!response.ok || data.error) {
    throw new Error(`Groq API Error LOG: ${JSON.stringify(data.error || data)}`);
  }
  
  if (!data.choices || !data.choices[0]) {
    throw new Error(`Groq API Success but no choices. RAW DATA: ${JSON.stringify(data)}`);
  }

  return data.choices[0].message?.content || 'Unable to generate response.';
}
