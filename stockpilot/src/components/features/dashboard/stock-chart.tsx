'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, TooltipProps } from "recharts"
import { motion } from "framer-motion"

const data = [
  { name: 'Mon', stock: 4000 },
  { name: 'Tue', stock: 3000 },
  { name: 'Wed', stock: 2000 },
  { name: 'Thu', stock: 2780 },
  { name: 'Fri', stock: 1890 },
  { name: 'Sat', stock: 2390 },
  { name: 'Sun', stock: 3490 },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="enterpise-card bg-[#0a0a0a] border border-white/10 p-3 rounded-xl shadow-xl">
        <p className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold mb-1">{label} · Telemetry</p>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-neutral-100 tabular-nums">{payload[0].value}</span>
          <span className="text-[10px] text-neutral-500 uppercase font-semibold">Units</span>
        </div>
        <div className="mt-2 pt-2 border-t border-white/5 flex gap-3 flex-col sm:flex-row">
          <div className="flex flex-col">
            <span className="text-[9px] text-neutral-500 uppercase font-semibold">Status</span>
            <span className="text-[10px] text-emerald-400 font-medium">Optimal</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-neutral-500 uppercase font-semibold">Delta</span>
            <span className="text-[10px] text-amber-400 font-medium">+12.4%</span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export function StockChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.6 }}
      className="col-span-1 lg:col-span-3 h-full"
    >
      <Card className="enterprise-card border-[0.5px] border-white/10 rounded-2xl h-full flex flex-col relative overflow-hidden bg-white/[0.01]">
        {/* Decorative Grid */}
        <div className="absolute inset-0 grid-background opacity-20 pointer-events-none" />
        
        <CardHeader className="relative z-10 p-6 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-neutral-300 font-semibold tracking-widest text-xs uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
              Global Stock Analysis
            </CardTitle>
            <div className="flex gap-1.5 opacity-50">
              {[1,2,3].map(i => <div key={i} className="w-6 h-0.5 bg-neutral-600 rounded-full" />)}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pl-0 pr-6 relative z-10 flex-1">
          <div className="h-[280px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#525252" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#737373', fontFamily: 'monospace' }}
                  dy={10}
                />
                <YAxis 
                  stroke="#525252" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#737373', fontFamily: 'monospace' }}
                  tickFormatter={(value) => `${value}`} 
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f59e0b', strokeWidth: 1, strokeDasharray: '4 4' }} />
                
                {/* Sleek Line Area */}
                <Area type="monotone" dataKey="stock" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorStock)" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
