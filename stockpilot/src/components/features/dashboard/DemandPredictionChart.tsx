'use client'

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { TrendingUp, BarChart } from "lucide-react"

interface DemandPredictionChartProps {
  data: any[];
}

export function DemandPredictionChart({ data }: DemandPredictionChartProps) {
  return (
    <div className="enterprise-card rounded-2xl p-6 relative overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-amber-400">
                <TrendingUp className="w-4 h-4" />
            </div>
            <div>
                <h3 className="text-xs font-semibold text-neutral-200 uppercase tracking-widest">Demand Forecast</h3>
                <p className="text-[10px] text-neutral-500 font-mono">Next 7 Cycles Prediction</p>
            </div>
        </div>
        <div className="flex gap-4">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded bg-emerald-500" />
                <span className="text-[10px] text-neutral-400 uppercase font-mono">Actual</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded bg-emerald-500/40" />
                <span className="text-[10px] text-neutral-400 uppercase font-mono">AI Predicted</span>
            </div>
        </div>
      </div>

      <div className="flex-1 min-h-[250px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis 
              dataKey="day" 
              stroke="#ffffff40" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: '#a3a3a3', fontFamily: 'monospace' }}
            />
            <YAxis 
              stroke="#ffffff40" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: '#a3a3a3', fontFamily: 'monospace' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0a0a0a', 
                border: '1px solid #ffffff10',
                borderRadius: '8px',
                fontSize: '10px',
                fontFamily: 'monospace'
              }}
              itemStyle={{ color: '#e5e5e5' }}
            />
            <Area 
              type="monotone" 
              dataKey="actual" 
              stroke="#6366f1" 
              fillOpacity={1} 
              fill="url(#colorActual)" 
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="predicted" 
              stroke="#818cf8" 
              fillOpacity={1} 
              strokeDasharray="5 5"
              fill="url(#colorPredicted)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
        <div className="flex items-center gap-2">
            <BarChart className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest">Confidence Factor: 89.2%</span>
        </div>
        <button className="text-[10px] font-semibold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-widest">
            Detailed Analysis
        </button>
      </div>
    </div>
  )
}
