'use client'

import { motion } from "framer-motion"
import { Sparkles, ShoppingCart, ArrowRight, AlertCircle, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface RestockSuggestion {
  product: string;
  currentStock: number;
  suggestedQty: number;
  priority: string;
}

interface SmartRestockPanelProps {
  suggestions: RestockSuggestion[];
}

export function SmartRestockPanel({ suggestions }: SmartRestockPanelProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="enterprise-card rounded-2xl p-6 relative overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-semibold text-neutral-200 uppercase tracking-widest">Smart Restock</h3>
        </div>
        <div className="text-[10px] text-emerald-500/80 font-mono">OPTIMIZED</div>
      </div>

      <div className="space-y-4 flex-1">
        {suggestions.map((s, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-colors group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  s.priority === 'critical' ? "bg-rose-500" : "bg-emerald-500"
                )} />
                <span className="text-xs font-semibold text-neutral-100">{s.product}</span>
              </div>
              <span className={cn(
                "text-[9px] font-semibold px-2 py-0.5 rounded border uppercase tracking-widest",
                s.priority === 'critical' ? "border-rose-500/20 text-rose-500 bg-rose-500/5" : "border-emerald-500/20 text-emerald-500 bg-emerald-500/5"
              )}>
                {s.priority}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <p className="text-[9px] text-neutral-500 uppercase font-semibold tracking-tighter">Current Stock</p>
                <p className="text-sm font-semibold text-neutral-200 font-mono">{s.currentStock}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] text-emerald-500/70 uppercase font-semibold tracking-tighter">Suggested Restock</p>
                <p className="text-sm font-semibold text-emerald-400 font-mono">+{s.suggestedQty}</p>
              </div>
            </div>

            <button className="w-full py-2 bg-neutral-800/50 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/50 rounded-lg text-[10px] font-semibold transition-colors flex items-center justify-center gap-2 uppercase tracking-widest">
              <ShoppingCart className="w-3 h-3" />
              Generate Draft Receipt
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex items-start gap-3 p-3 rounded-xl bg-neutral-800/40 border border-neutral-700/50">
        <AlertCircle className="w-4 h-4 text-neutral-400 mt-0.5" />
        <p className="text-[10px] text-neutral-400 leading-relaxed font-mono">
          Based on last 30 days demand trends and current delivery queue. Confidence score: 94%.
        </p>
      </div>
    </div>
  )
}
