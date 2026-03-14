'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, Play, Pause, Settings, Info, Plus, X } from "lucide-react"
import { useAppStore, AutomationRule } from "@/lib/store"
import { cn } from "@/lib/utils"

export function AutomationHud() {
  const { automationRules, addRule, toggleRule, stock } = useAppStore()
  const [isAdding, setIsAdding] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    product: stock[0]?.product || '',
    type: 'low_stock_restock' as 'low_stock_restock' | 'dead_inventory_alert',
    threshold: 100,
    actionValue: 500
  })

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.product) return
    setIsConfirming(true) // Trigger security confirmation
  }

  const executeAddRule = () => {
    const newRule: AutomationRule = {
      id: `ar_${Date.now()}`,
      name: formData.name,
      product: formData.product,
      type: formData.type,
      threshold: formData.threshold,
      actionValue: formData.actionValue,
      isActive: true
    }
    
    addRule(newRule)
    setIsConfirming(false)
    setIsAdding(false)
    setFormData({ ...formData, name: '' }) // Reset name
  }

  return (
    <div className="enterprise-card rounded-2xl p-6 relative overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-amber-500">
                <Zap className="w-4 h-4" />
            </div>
            <div>
                <h3 className="text-xs font-semibold text-neutral-100 uppercase tracking-widest">Automation Engine</h3>
                <p className="text-[10px] text-neutral-500 font-mono">Workflow Trigger System</p>
            </div>
        </div>
        <button 
          onClick={() => { setIsAdding(!isAdding); setIsConfirming(false); }}
          className="flex items-center justify-center p-1.5 rounded bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>

      {/* Security Confirmation Modal */}
      <AnimatePresence>
        {isConfirming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 rounded-2xl"
          >
            <div className="bg-emerald-950 border border-emerald-500/30 p-5 rounded-xl text-center w-full max-w-sm shadow-2xl">
              <div className="mx-auto w-10 h-10 mb-3 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center border border-red-500/30">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-1">Are you sure?</h4>
              <p className="text-xs text-neutral-400 mb-5">
                This rule will automatically purchase <strong>{formData.actionValue} {formData.product}</strong> when stock falls below <strong>{formData.threshold}</strong>. This action affects live inventory budgets.
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsConfirming(false)} 
                  className="flex-1 py-2 rounded-lg bg-black/40 text-neutral-400 text-xs font-semibold hover:bg-black/60 transition-colors border border-white/5"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeAddRule} 
                  className="flex-1 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors shadow-lg shadow-amber-900/50"
                >
                  Confirm & Save
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-3 custom-scrollbar">
        <AnimatePresence mode="wait">
          {isAdding ? (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-3"
              onSubmit={handleAddRule}
            >
              <div>
                 <label className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">Rule Name</label>
                 <input 
                   type="text" required
                   value={formData.name}
                   onChange={e => setFormData({...formData, name: e.target.value})}
                   className="w-full mt-1 bg-black/20 border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-emerald-500/50"
                   placeholder="e.g. Auto-restock bolts"
                 />
              </div>
              <div>
                 <label className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">Product</label>
                 <select 
                   value={formData.product}
                   onChange={e => setFormData({...formData, product: e.target.value})}
                   className="w-full mt-1 bg-black/20 border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-emerald-500/50"
                 >
                   {stock.map(s => (
                     <option key={s.id} value={s.product} className="bg-neutral-900">{s.product}</option>
                   ))}
                 </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <div>
                   <label className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">Trigger if &lt;</label>
                   <input 
                     type="number" required min="0"
                     value={formData.threshold}
                     onChange={e => setFormData({...formData, threshold: parseInt(e.target.value) || 0})}
                     className="w-full mt-1 bg-black/20 border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-emerald-500/50"
                   />
                 </div>
                 <div>
                   <label className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">Order Qty</label>
                   <input 
                     type="number" required min="1"
                     value={formData.actionValue}
                     onChange={e => setFormData({...formData, actionValue: parseInt(e.target.value) || 0})}
                     className="w-full mt-1 bg-black/20 border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-amber-500/50"
                   />
                 </div>
              </div>
              <div className="pt-2">
                 <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-amber-50 text-[10px] font-bold uppercase tracking-widest py-2 rounded-lg transition-colors">
                   Save Rule
                 </button>
              </div>
            </motion.form>
          ) : (
             automationRules.length === 0 ? (
                <div className="text-center py-8 opacity-40">
                    <Info className="w-8 h-8 mx-auto mb-2 text-amber-400" />
                    <p className="text-[10px] font-mono text-neutral-500">No active rules.</p>
                </div>
            ) : (
                automationRules.map((rule) => (
                    <div key={rule.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "p-2 rounded-lg transition-colors",
                                rule.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-neutral-800 text-neutral-600"
                            )}>
                                <Settings className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-neutral-200 uppercase tracking-widest">{rule.name}</h4>
                                <p className="text-[9px] text-neutral-500 font-mono mt-0.5 max-w-[150px] truncate">{rule.product} (Order: {rule.actionValue})</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => toggleRule(rule.id)}
                            className={cn(
                                "p-2 rounded-lg border transition-all",
                                rule.isActive 
                                ? "bg-rose-500/10 border-rose-500/30 text-rose-500 hover:bg-rose-500/20" 
                                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20"
                            )}>
                            {rule.isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        </button>
                    </div>
                ))
            )
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">Active Workers</span>
              <span className="text-[10px] font-mono text-emerald-400">
                {automationRules.filter(r => r.isActive).length}/{Math.max(5, automationRules.length)}
              </span>
          </div>
          <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map(i => {
                  const isActive = i <= automationRules.filter(r => r.isActive).length;
                  return (
                  <div key={i} className={cn(
                      "flex-1 h-1 rounded-full overflow-hidden bg-white/5",
                      isActive ? "bg-emerald-500/20" : ""
                  )}>
                      {isActive && <motion.div 
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: 'loop', ease: "linear" }}
                        className="h-full w-full bg-emerald-500/50" 
                      />}
                  </div>
              )})}
          </div>
      </div>
    </div>
  )
}
