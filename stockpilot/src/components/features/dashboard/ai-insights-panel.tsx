'use client'

import { motion, AnimatePresence } from "framer-motion"
import { Cpu, Zap, Brain } from "lucide-react"
import { useState, useEffect } from "react"

const FEED_MESSAGES = [
  "Inventory optimization algorithm initialized...",
  "Analyzing stock movement patterns...",
  "WH/IN/00001: Efficiency rating at 98.4%",
  "Stock leak detected in WH/OUT/00021-X",
  "Rerouting delivery WH/OUT/00002 for priority",
  "Predictive restocking: Bolt (M8x20) spike imminent",
  "System health: Nominal. Latency: 12ms",
  "AI Core: Deep learning session synchronized",
  "Warehouse A4: Temperature normal (22.5C)",
  "Global supply chain sync: SUCCESS",
  "New Move History event recorded: #HM-9921",
  "Security Protocol Alpha: Active",
]

export function AiInsightsPanel() {
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    setMessages(FEED_MESSAGES.slice(0, 5))

    const interval = setInterval(() => {
      setMessages(prev => {
        const nextMsg = FEED_MESSAGES[Math.floor(Math.random() * FEED_MESSAGES.length)]
        return [nextMsg, ...prev.slice(0, 7)]
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-black/40 border border-white/10 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)] backdrop-blur-3xl lg:col-span-1 flex flex-col relative overflow-hidden hud-border h-full">
      <div className="absolute top-0 right-0 p-4 opacity-20">
        <Cpu className="w-12 h-12 text-amber-500 animate-pulse" />
      </div>

      <div className="flex items-center gap-2 mb-6 relative z-10">
        <div className="p-2 rounded-lg bg-emerald-500/20 text-amber-400 neon-glow">
          <Brain className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-white tracking-widest uppercase text-xs">AI Intelligence</h3>
          <p className="text-[10px] text-amber-400/60 font-mono">Live System Feed</p>
        </div>
      </div>

      <div className="flex-1 space-y-4 mask-fade-edges relative z-10 min-h-[250px]">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={`${msg}-${idx}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="flex items-start gap-3"
            >
              <div className="mt-1.5 w-1 h-1 rounded-full bg-emerald-400" />
              <div className="flex-1">
                <p className="text-[11px] font-mono text-neutral-300 leading-relaxed tracking-tight group">
                  <span className="text-amber-500/70 mr-2">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}]</span>
                  {msg}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-1 h-3 bg-emerald-500/40 rounded-full" />
            ))}
          </div>
          <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-tighter">Core Active</span>
        </div>
        <Zap className="w-3 h-3 text-emerald-400 animate-bounce" />
      </div>
      
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none" />
    </div>
  )
}
