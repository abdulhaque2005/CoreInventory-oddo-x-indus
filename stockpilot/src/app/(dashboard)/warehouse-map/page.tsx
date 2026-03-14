'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { Map, Info, Box as BoxIcon, LayoutGrid, Layers, Maximize } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

interface RackConfig {
  id: string
  zone: string
  label: string
  row: number
  col: number
  type: 'rack' | 'aisle' | 'door' | 'staging'
}

const ZONES = [
  { name: 'Zone A — Receiving', color: 'emerald' },
  { name: 'Zone B — Bulk Storage', color: 'amber' },
  { name: 'Zone C — Picking', color: 'sky' },
  { name: 'Zone D — Shipping', color: 'rose' },
]

// 6×8 grid layout with aisles to mimic real floor plan
const LAYOUT: RackConfig[] = [
  // Zone A — Receiving (top 2 rows)
  { id: 'A1-01', zone: 'A', label: 'A1-01', row: 0, col: 0, type: 'rack' },
  { id: 'A1-02', zone: 'A', label: 'A1-02', row: 0, col: 1, type: 'rack' },
  { id: 'A1-03', zone: 'A', label: 'A1-03', row: 0, col: 2, type: 'rack' },
  { id: 'DOOR-IN', zone: 'A', label: '🚪 IN', row: 0, col: 3, type: 'door' },
  { id: 'A2-01', zone: 'A', label: 'A2-01', row: 0, col: 4, type: 'rack' },
  { id: 'A2-02', zone: 'A', label: 'A2-02', row: 0, col: 5, type: 'rack' },
  { id: 'STG-IN', zone: 'A', label: 'STAGING', row: 1, col: 0, type: 'staging' },
  { id: 'A3-01', zone: 'A', label: 'A3-01', row: 1, col: 1, type: 'rack' },
  { id: 'A3-02', zone: 'A', label: 'A3-02', row: 1, col: 2, type: 'rack' },
  { id: 'AISLE-1', zone: 'A', label: '', row: 1, col: 3, type: 'aisle' },
  { id: 'A3-03', zone: 'A', label: 'A3-03', row: 1, col: 4, type: 'rack' },
  { id: 'A3-04', zone: 'A', label: 'A3-04', row: 1, col: 5, type: 'rack' },

  // Zone B — Bulk Storage (center rows)
  { id: 'B1-01', zone: 'B', label: 'B1-01', row: 2, col: 0, type: 'rack' },
  { id: 'B1-02', zone: 'B', label: 'B1-02', row: 2, col: 1, type: 'rack' },
  { id: 'B1-03', zone: 'B', label: 'B1-03', row: 2, col: 2, type: 'rack' },
  { id: 'AISLE-2', zone: 'B', label: '', row: 2, col: 3, type: 'aisle' },
  { id: 'B1-04', zone: 'B', label: 'B1-04', row: 2, col: 4, type: 'rack' },
  { id: 'B1-05', zone: 'B', label: 'B1-05', row: 2, col: 5, type: 'rack' },
  { id: 'B2-01', zone: 'B', label: 'B2-01', row: 3, col: 0, type: 'rack' },
  { id: 'B2-02', zone: 'B', label: 'B2-02', row: 3, col: 1, type: 'rack' },
  { id: 'B2-03', zone: 'B', label: 'B2-03', row: 3, col: 2, type: 'rack' },
  { id: 'AISLE-3', zone: 'B', label: '', row: 3, col: 3, type: 'aisle' },
  { id: 'B2-04', zone: 'B', label: 'B2-04', row: 3, col: 4, type: 'rack' },
  { id: 'B2-05', zone: 'B', label: 'B2-05', row: 3, col: 5, type: 'rack' },

  // Zone C — Picking
  { id: 'C1-01', zone: 'C', label: 'C1-01', row: 4, col: 0, type: 'rack' },
  { id: 'C1-02', zone: 'C', label: 'C1-02', row: 4, col: 1, type: 'rack' },
  { id: 'C1-03', zone: 'C', label: 'C1-03', row: 4, col: 2, type: 'rack' },
  { id: 'AISLE-4', zone: 'C', label: '', row: 4, col: 3, type: 'aisle' },
  { id: 'C1-04', zone: 'C', label: 'C1-04', row: 4, col: 4, type: 'rack' },
  { id: 'C1-05', zone: 'C', label: 'C1-05', row: 4, col: 5, type: 'rack' },

  // Zone D — Shipping (bottom row)
  { id: 'STG-OUT', zone: 'D', label: 'STAGING', row: 5, col: 0, type: 'staging' },
  { id: 'D1-01', zone: 'D', label: 'D1-01', row: 5, col: 1, type: 'rack' },
  { id: 'D1-02', zone: 'D', label: 'D1-02', row: 5, col: 2, type: 'rack' },
  { id: 'DOOR-OUT', zone: 'D', label: '🚪 OUT', row: 5, col: 3, type: 'door' },
  { id: 'D1-03', zone: 'D', label: 'D1-03', row: 5, col: 4, type: 'rack' },
  { id: 'D1-04', zone: 'D', label: 'D1-04', row: 5, col: 5, type: 'rack' },
]

const ROWS = 6
const COLS = 6

export default function WarehouseMapPage() {
  const [selectedRack, setSelectedRack] = useState<string | null>(null)
  const stock = useAppStore(state => state.stock)

  // Deterministic utilization based on rack label
  const getUtilization = (rack: RackConfig) => {
    if (rack.type !== 'rack') return 0
    const seed = rack.label.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    return ((seed * 13.7) % 85) + 10 // 10-95%
  }

  const getZoneColor = (zone: string) => {
    const map: Record<string, { bg: string, border: string, text: string }> = {
      'A': { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.5)', text: 'text-emerald-400' },
      'B': { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.5)', text: 'text-amber-400' },
      'C': { bg: 'rgba(14,165,233,0.15)', border: 'rgba(14,165,233,0.5)', text: 'text-sky-400' },
      'D': { bg: 'rgba(244,63,94,0.15)', border: 'rgba(244,63,94,0.5)', text: 'text-rose-400' },
    }
    return map[zone] || map['A']
  }

  const getUtilColor = (pct: number) => {
    if (pct < 40) return 'text-emerald-400'
    if (pct < 75) return 'text-amber-400'
    return 'text-rose-400'
  }

  // Map stock items to selected rack
  const getStockForRack = (rackId: string) => {
    const seed = rackId.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    const startIdx = seed % Math.max(1, stock.length - 3)
    return stock.slice(startIdx, startIdx + 3)
  }

  // Build grid
  const grid: (RackConfig | null)[][] = Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
  LAYOUT.forEach(r => { grid[r.row][r.col] = r })

  const selectedConfig = LAYOUT.find(r => r.id === selectedRack)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Warehouse Floor Plan
            <LayoutGrid className="w-5 h-5 text-amber-400" />
          </h1>
          <p className="text-neutral-400 text-sm">Main Warehouse — Interactive zone map with rack utilization.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {ZONES.map((z, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <div className={`w-2 h-2 rounded-full bg-${z.color}-500`} />
              <span className="text-[10px] text-neutral-300 font-mono">{z.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Grid */}
        <div className="lg:col-span-2 enterprise-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 grid-background opacity-10" />
          
          <div className="relative grid gap-2" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
            {grid.map((row, rIdx) =>
              row.map((cell, cIdx) => {
                if (!cell) {
                  return <div key={`${rIdx}-${cIdx}`} className="h-20 rounded-lg border border-dashed border-white/5 opacity-20" />
                }

                const util = getUtilization(cell)
                const zColor = getZoneColor(cell.zone)

                if (cell.type === 'aisle') {
                  return (
                    <div key={cell.id} className="h-20 flex items-center justify-center">
                      <div className="w-full h-1 bg-white/5 rounded-full" />
                    </div>
                  )
                }

                if (cell.type === 'door') {
                  return (
                    <div key={cell.id} className="h-20 rounded-xl border-2 border-dashed border-amber-500/40 bg-amber-500/5 flex items-center justify-center text-amber-400 text-xs font-bold">
                      {cell.label}
                    </div>
                  )
                }

                if (cell.type === 'staging') {
                  return (
                    <div key={cell.id} className="h-20 rounded-xl border border-dashed border-white/20 bg-white/[0.02] flex flex-col items-center justify-center text-neutral-500 text-[10px] font-mono">
                      <Layers className="w-4 h-4 mb-1 text-neutral-600" />
                      {cell.label}
                    </div>
                  )
                }

                return (
                  <motion.button
                    key={cell.id}
                    onClick={() => setSelectedRack(cell.id)}
                    whileHover={{ scale: 1.05, zIndex: 10 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "h-20 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer relative overflow-hidden",
                      selectedRack === cell.id ? "ring-2 ring-white/60" : ""
                    )}
                    style={{
                      backgroundColor: zColor.bg,
                      borderColor: zColor.border,
                    }}
                  >
                    <span className="text-[10px] font-bold text-white/80 font-mono">{cell.label}</span>
                    <div className="w-4/5 h-1 bg-black/30 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${util}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full rounded-full ${util < 40 ? 'bg-emerald-500' : util < 75 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      />
                    </div>
                    <span className={`text-[9px] font-mono font-semibold ${getUtilColor(util)}`}>{util.toFixed(0)}%</span>
                  </motion.button>
                )
              })
            )}
          </div>
        </div>

        {/* Rack Detail Panel */}
        <div className="enterprise-card rounded-2xl p-6 h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-amber-400">
              <BoxIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                {selectedConfig ? `Rack ${selectedConfig.label}` : "Select a Rack"}
              </h3>
              <p className="text-[10px] text-neutral-500 font-mono">
                {selectedConfig ? `Zone ${selectedConfig.zone} · LOC-${selectedConfig.label}-WH1` : "Click any rack on the floor plan"}
              </p>
            </div>
          </div>

          {!selectedConfig || selectedConfig.type !== 'rack' ? (
            <div className="h-[300px] flex flex-col items-center justify-center text-center opacity-40">
              <Info className="w-10 h-10 mb-4 text-amber-400" />
              <p className="text-xs font-mono text-neutral-400">Click a rack on the floor plan to view stock details and AI optimization suggestions.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Utilization bar */}
              <div>
                <div className="flex justify-between text-xs text-neutral-400 mb-1">
                  <span>Utilization</span>
                  <span className={`font-bold ${getUtilColor(getUtilization(selectedConfig))}`}>
                    {getUtilization(selectedConfig).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${getUtilization(selectedConfig) < 40 ? 'bg-emerald-500' : getUtilization(selectedConfig) < 75 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${getUtilization(selectedConfig)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest border-b border-white/5 pb-2">Stored Items</h4>
                {getStockForRack(selectedConfig.id).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/5 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                      <div>
                        <p className="text-xs font-medium text-white group-hover:text-amber-300 transition-colors">{item.product}</p>
                        <p className="text-[10px] text-neutral-500 font-mono">SKU-{item.id.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-white font-mono">{item.onHand.toLocaleString()}</p>
                      <p className="text-[9px] text-neutral-600 uppercase">units</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <h4 className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-2">AI Recommendation</h4>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  {getUtilization(selectedConfig) > 70
                    ? `This rack is at high capacity. Recommend redistributing 30% of bulk items to Zone B racks to optimize picking flow and reduce congestion.`
                    : `This rack has good capacity headroom. Consider consolidating nearby low-fill racks to reduce travel time during order picking.`
                  }
                </p>
              </div>

              <button className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all shadow-lg uppercase tracking-widest">
                Optimize Location
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
