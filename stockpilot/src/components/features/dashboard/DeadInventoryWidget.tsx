'use client'

import { motion } from "framer-motion"
import { PackageX, History, ArrowRight, Trash2 } from "lucide-react"
import { StockItem } from "@/lib/store"

interface DeadInventoryWidgetProps {
  items: StockItem[];
}

export function DeadInventoryWidget({ items }: DeadInventoryWidgetProps) {
  if (items.length === 0) return null;

  return (
    <div className="enterprise-card rounded-2xl p-6 lg:col-span-1 relative overflow-hidden h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400">
          <PackageX className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xs font-semibold text-neutral-200 uppercase tracking-widest">Dead Inventory</h3>
          <p className="text-[10px] text-neutral-500 font-mono">Inactive for 60+ Days</p>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.05] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-900/50 border border-white/5 flex items-center justify-center text-[10px] font-semibold text-neutral-500">
                SKU
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-200 group-hover:text-white transition-colors">{item.product}</p>
                <p className="text-[10px] text-neutral-500 font-mono flex items-center gap-1 mt-0.5">
                    <History className="w-3 h-3" />
                    Last seen: 68d ago
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
                <span className="text-xs font-semibold font-mono text-neutral-300">{item.onHand} pcs</span>
                <button className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-3 h-3" />
                </button>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-[10px] font-semibold text-neutral-400 uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
        Suggest Clearance Strategy
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  )
}
