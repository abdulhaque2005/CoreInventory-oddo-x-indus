'use client'

import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, TrendingUp, TrendingDown, Clock, ShieldAlert } from "lucide-react"
import { Anomaly } from "@/lib/store"
import { cn } from "@/lib/utils"

interface AnomalyAlertsProps {
  anomalies: Anomaly[];
}

export function AnomalyAlerts({ anomalies }: AnomalyAlertsProps) {
  if (anomalies.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <h3 className="text-xs font-semibold text-neutral-200 uppercase tracking-widest">Security Anomalies</h3>
      </div>

      <div className="space-y-3">
        {anomalies.map((anom) => (
          <motion.div
            key={anom.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
               "p-4 rounded-xl border relative overflow-hidden group transition-colors",
               anom.severity === 'high' 
               ? "bg-rose-950/20 border-rose-900/30 hover:bg-rose-900/20" 
               : "bg-amber-950/20 border-amber-900/30 hover:bg-amber-900/20"
            )}
          >
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "mt-1 p-2 rounded-lg",
                  anom.severity === 'high' ? "bg-rose-500/10 text-rose-400" : "bg-amber-500/10 text-amber-400"
                )}>
                  {anom.detectedValue > anom.expectedValue ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-neutral-100 mb-1 group-hover:text-neutral-50 transition-colors">
                    {anom.product}
                  </h4>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-500 uppercase">
                    <span className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {anom.type}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(anom.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className={cn(
                  "text-lg font-bold font-mono",
                  anom.severity === 'high' ? "text-rose-400" : "text-amber-400"
                )}>
                  {anom.detectedValue}
                </div>
                <div className="text-[9px] text-neutral-500 uppercase font-semibold tracking-tighter mt-0.5">
                  Expected: {anom.expectedValue}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
