'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

// Interpolate color from Emerald -> Amber -> Rose based on percentage
function getHeatmapColor(pct: number) {
  if (pct === 0) return { bg: 'rgba(255,255,255,0.02)', border: 'rgba(255,255,255,0.1)' }; // Empty
  
  // Emerald (16,185,129) to Amber (245,158,11) to Rose (244,63,94)
  let r, g, b;
  if (pct < 50) {
    const factor = pct / 50;
    r = Math.round(16 + factor * (245 - 16));
    g = Math.round(185 + factor * (158 - 185));
    b = Math.round(129 + factor * (11 - 129));
  } else {
    const factor = (pct - 50) / 50;
    r = Math.round(245 + factor * (244 - 245));
    g = Math.round(158 + factor * (63 - 158));
    b = Math.round(11 + factor * (94 - 11));
  }
  
  return {
    bg: `rgba(${r}, ${g}, ${b}, 0.25)`,
    border: `rgba(${r}, ${g}, ${b}, 0.6)`,
    text: `rgba(${r}, ${g}, ${b}, 1)`,
    glow: `0 0 15px rgba(${r}, ${g}, ${b}, 0.4)`
  };
}

export function WarehouseMap({ warehouses, locations, stockLines }: { warehouses: any[], locations: any[], stockLines: any[] }) {
  const [selectedWarehouse, setSelectedWarehouse] = useState(warehouses?.[0]?.id || '')

  const currentLocations = locations.filter(l => l.warehouse_id === selectedWarehouse)

  // Calculate utilization for each location
  const locationStats = currentLocations.map(loc => {
    // Find all stock in this location
    const stockInLoc = stockLines.filter(s => s.location_id === loc.id)
    const totalItems = stockInLoc.reduce((sum, s) => sum + s.on_hand_qty, 0)
    
    // Utilization percentage
    const maxCapacity = loc.max_capacity || 1000 // default fallback
    const rawPct = (totalItems / maxCapacity) * 100
    const utilizationPct = Math.min(Math.max(rawPct, 0), 100)

    const heatColor = getHeatmapColor(utilizationPct)

    return {
      ...loc,
      totalItems,
      utilizationPct,
      heatColor,
      stockDetails: stockInLoc
    }
  })

  // Find grid dimensions
  const maxRow = Math.max(...currentLocations.map(l => l.grid_row || 1), 3)
  const maxCol = Math.max(...currentLocations.map(l => l.grid_col || 1), 4)

  // Create grid matrix
  const grid = Array(maxRow).fill(null).map(() => Array(maxCol).fill(null))
  
  locationStats.forEach(loc => {
    if (loc.grid_row && loc.grid_col) {
      grid[loc.grid_row - 1][loc.grid_col - 1] = loc
    }
  })

  const [hoveredCell, setHoveredCell] = useState<any>(null)

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {warehouses.map(w => (
          <button
            key={w.id}
            onClick={() => setSelectedWarehouse(w.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedWarehouse === w.id 
                ? 'bg-emerald-600 text-white' 
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {w.name}
          </button>
        ))}
      </div>

      <Card className="bg-white/5 border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.2)] backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg text-white font-medium tracking-tight">Floor Plan Overview</CardTitle>
          <div className="flex gap-4 text-xs text-neutral-400 mt-2">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-md bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.1)]"></div> Empty</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-md" style={{ backgroundColor: getHeatmapColor(25).bg, borderColor: getHeatmapColor(25).border, borderWidth: 1 }}></div> Low</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-md" style={{ backgroundColor: getHeatmapColor(75).bg, borderColor: getHeatmapColor(75).border, borderWidth: 1 }}></div> High</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-md" style={{ backgroundColor: getHeatmapColor(100).bg, borderColor: getHeatmapColor(100).border, borderWidth: 1 }}></div> Full</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-black/40 rounded-xl border border-white/5 overflow-x-auto relative">
            <div 
              className="inline-grid gap-4" 
              style={{ gridTemplateColumns: `repeat(${maxCol}, minmax(120px, 1fr))` }}
            >
              {grid.map((row, rIdx) => 
                row.map((cell, cIdx) => (
                  <motion.div 
                    key={`${rIdx}-${cIdx}`}
                    whileHover={{ scale: 1.05, zIndex: 10 }}
                    onMouseEnter={() => cell && setHoveredCell(cell)}
                    onMouseLeave={() => setHoveredCell(null)}
                    className={`relative p-3 rounded-xl border min-h-[110px] flex flex-col items-center justify-center text-center transition-all cursor-pointer shadow-lg backdrop-blur-sm ${!cell && 'border-dashed border-white/10 opacity-30 shadow-none hover:scale-100'}`}
                    style={cell ? {
                      backgroundColor: cell.heatColor.bg,
                      borderColor: cell.heatColor.border,
                      boxShadow: cell.hovered ? cell.heatColor.glow : 'none'
                    } : {}}
                  >
                    {cell ? (
                      <>
                        <div className="font-bold text-white text-lg">{cell.code}</div>
                        <div className="text-xs text-neutral-300 mt-1 truncate w-full px-1">{cell.name}</div>
                        <div className="mt-3 font-semibold text-sm" style={{ color: cell.heatColor.text }}>
                          {Math.round(cell.utilizationPct)}%
                        </div>
                      </>
                    ) : (
                      <span className="text-xs text-neutral-600">Aisle</span>
                    )}
                  </motion.div>
                ))
              )}
            </div>
            
            {/* Custom Interactive Tooltip overlay */}
            <AnimatePresence>
              {hoveredCell && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="fixed bottom-4 right-4 z-50 bg-black/90 border border-white/20 p-4 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl w-64 pointer-events-none"
                >
                  <h4 className="font-bold text-white flex justify-between items-center text-lg tracking-tight">
                    {hoveredCell.code} 
                    <span className="text-sm font-medium px-2 py-0.5 rounded bg-white/10" style={{ color: hoveredCell.heatColor.text }}>
                      {Math.round(hoveredCell.utilizationPct)}% used
                    </span>
                  </h4>
                  <p className="text-sm text-neutral-400 mt-1 mb-3">{hoveredCell.name}</p>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-xs border-b border-white/10 pb-1">
                      <span className="text-neutral-500">Items Stored:</span>
                      <span className="text-white font-medium">{hoveredCell.totalItems} / {hoveredCell.max_capacity}</span>
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-1">Top Products</div>
                  <div className="space-y-1">
                    {hoveredCell.stockDetails.length > 0 ? (
                      hoveredCell.stockDetails.slice(0, 3).map((s: any) => (
                         <div key={s.id} className="flex justify-between text-xs items-center bg-white/5 p-1 px-2 rounded">
                           <span className="text-neutral-300 truncate max-w-[120px]">{s.product_name}</span>
                           <span className="text-emerald-400 font-medium">x{s.on_hand_qty}</span>
                         </div>
                      ))
                    ) : (
                      <div className="text-xs text-neutral-600 italic">Empty Location</div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
      
      {/* Fallback for list of items not mapped to grid */}
      <div className="space-y-3">
        <h3 className="font-semibold text-white tracking-tight">Unmapped Overflow Locations</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {locationStats.filter(l => !l.grid_row || !l.grid_col).map(loc => (
            <div 
              key={loc.id} 
              className="p-4 rounded-xl border border-white/10 text-center shadow-lg backdrop-blur-sm transition-all hover:-translate-y-1"
              style={{ backgroundColor: loc.heatColor.bg, borderColor: loc.heatColor.border }}
            >
              <div className="font-bold text-white">{loc.code}</div>
              <div className="text-sm font-semibold mt-1" style={{ color: loc.heatColor.text }}>
                {Math.round(loc.utilizationPct)}% Full
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
