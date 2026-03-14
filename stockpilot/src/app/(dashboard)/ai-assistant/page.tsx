import { ChatInterface } from "@/components/features/ai/chat"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, AlertTriangle } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { generateForecast } from "@/lib/utils/forecast"

export default async function AssistantPage() {
  const supabase = await createClient()

  // 1. Fetch raw stock moves for ML forecasts
  const { data: stockMoves } = await supabase
    .from('stock_moves')
    .select('*, products(name)')
    // only look at last 90 days for trend analysis
    .gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: true })

  // 2. Fetch inventory for stockout risk warnings
  const { data: inventory } = await supabase
    .from('inventory_with_availability')
    .select('*')
    .order('available_qty', { ascending: true })

  // Process ML Forecasts per product
  interface ForecastResult {
    productName: string;
    trendPct: number;
    isGrowing: boolean;
  }
  
  const productForecasts: ForecastResult[] = []

  if (stockMoves) {
    // Group moves by product_id
    const groupedMoves: Record<string, any[]> = {}
    stockMoves.forEach(m => {
      if (!groupedMoves[m.product_id]) groupedMoves[m.product_id] = []
      // We assume negative quantity indicates outgoing movement/sales based on earlier seeding logic
      // But let's just pass absolute values of outgoing moves to the forecast utility
      if (m.quantity < 0 || m.move_type === 'out') {
        groupedMoves[m.product_id].push({
          ...m,
          quantity: Math.abs(m.quantity),
          move_type: 'out' 
        });
      }
    })

    // Generate forecast for each group
    Object.entries(groupedMoves).forEach(([productId, moves]) => {
      if (moves.length >= 2) {
        const result = generateForecast(moves, 30)
        if (result && result.trendPct !== 0) {
          productForecasts.push({
            productName: moves[0].products?.name || 'Unknown Product',
            trendPct: result.trendPct,
            isGrowing: result.isGrowing
          })
        }
      }
    })
  }

  // Sort forecasts by highest absolute trend change, take top 3
  const topForecasts = productForecasts
    .sort((a, b) => Math.abs(b.trendPct) - Math.abs(a.trendPct))
    .slice(0, 3)

  // Sort stockout risks (available <= reorder level)
  const stockoutRisks = inventory?.filter(i => i.available_qty <= i.reorder_level).slice(0, 4) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">AI Copilot & Forecasting</h1>
        <p className="text-neutral-400 text-sm mt-1">Interact with your warehouse data and view ML predictions.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <ChatInterface />
        </div>
        
        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.2)] backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center text-lg text-white">
                <TrendingUp className="w-5 h-5 text-amber-400 mr-2" />
                Demand Forecast
              </CardTitle>
              <CardDescription className="text-neutral-400">Predicted trend for next 30 days based on historical velocity.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topForecasts.length > 0 ? (
                  topForecasts.map((forecast, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-white text-sm">{forecast.productName}</span>
                        <span className={`text-xs font-bold ${forecast.isGrowing ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {forecast.isGrowing ? '+' : ''}{forecast.trendPct}%
                        </span>
                      </div>
                      <div className="w-full bg-black/40 rounded-full h-1.5 mb-1 shadow-inner">
                        <div 
                          className={`h-1.5 rounded-full ${forecast.isGrowing ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'}`}
                          style={{ width: `${Math.min(100, Math.max(10, Math.abs(forecast.trendPct) * 2))}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-neutral-500 mt-2">
                        {forecast.isGrowing ? 'Expect higher demand over the next 30 days.' : 'Demand stabilizing or declining compared to trailing average.'}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-neutral-500 py-4 text-center border border-dashed border-white/10 rounded-lg">
                    Not enough historical data to generate ML forecasts yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.2)] backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center text-lg text-white">
                <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
                Stockout Risks
              </CardTitle>
              <CardDescription className="text-neutral-400">AI identified potential stockouts in the next 14 days.</CardDescription>
            </CardHeader>
            <CardContent>
              {stockoutRisks.length > 0 ? (
                <ul className="space-y-3">
                  {stockoutRisks.map((risk, idx) => (
                    <li key={idx} className="flex justify-between items-center p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm hover:bg-amber-500/20 transition-colors relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500/50"></div>
                      <span className="text-amber-500 font-medium tracking-tight pl-2">{risk.product_name}</span>
                      <span className="text-xs text-amber-500/80 font-medium bg-amber-500/10 px-2 py-1 rounded">
                        {risk.available_qty} left (Lvl: {risk.reorder_level})
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                 <div className="text-sm text-emerald-500/80 py-4 text-center border border-dashed border-emerald-500/20 rounded-lg bg-emerald-500/5">
                    All inventory stocks are currently healthy.
                 </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
