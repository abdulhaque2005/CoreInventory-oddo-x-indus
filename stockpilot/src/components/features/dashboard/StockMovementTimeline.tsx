'use client'

import { motion } from "framer-motion"
import { ArrowUpRight, ArrowDownLeft, Clock, Package, User, MapPin } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function StockMovementTimeline() {
  const moveHistory = useAppStore(state => state.moveHistory)

  return (
    <div className="enterprise-card rounded-2xl p-6 relative overflow-hidden h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-amber-400">
                <Clock className="w-4 h-4" />
            </div>
            <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">Movement Timeline</h3>
                <p className="text-[10px] text-neutral-500 font-mono">Real-time Stock Telemetry</p>
            </div>
        </div>
        <div className="text-[10px] text-neutral-600 font-mono font-bold tracking-tighter uppercase">Sync: Active</div>
      </div>

      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500/50 before:via-white/5 before:to-transparent">
        {moveHistory.slice(0, 5).map((move, idx) => {
          const isReceipt = move.type === 'Receipt'
          return (
            <motion.div
              key={move.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative flex items-start gap-6 pl-2"
            >
              {/* Timeline dot */}
              <div className={cn(
                "absolute left-0 mt-1.5 w-3 h-3 rounded-full border border-black z-10 flex items-center justify-center translate-x-[7px]",
                isReceipt ? "bg-emerald-500" : "bg-amber-500"
              )}>
              </div>

              <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl p-4 hover:bg-white/[0.05] transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                        "text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter",
                        isReceipt ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                    )}>
                        {move.type}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">#{move.id}</span>
                  </div>
                  <span className="text-[9px] text-neutral-600 font-mono">{new Date(move.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div className="space-y-3">
                    {move.products.map((p, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Package className="w-3 h-3 text-neutral-500" />
                                <span className="text-xs text-white font-medium group-hover:text-amber-300 transition-colors">{p.product}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "text-xs font-bold font-mono",
                                    isReceipt ? "text-emerald-400" : "text-rose-400"
                                )}>
                                    {isReceipt ? '+' : '-'}{p.quantity}
                                </span>
                                {isReceipt ? <ArrowDownLeft className="w-3 h-3 text-emerald-500/50" /> : <ArrowUpRight className="w-3 h-3 text-rose-500/50" />}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[9px] text-neutral-600 uppercase font-bold tracking-widest">
                    <div className="flex items-center gap-2">
                        <User className="w-3 h-3" />
                        Administrator
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-amber-500/50" />
                        WH-MAIN/A1
                    </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <button className="w-full mt-8 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] transition-all">
        View Full Audit Log
      </button>
    </div>
  )
}
