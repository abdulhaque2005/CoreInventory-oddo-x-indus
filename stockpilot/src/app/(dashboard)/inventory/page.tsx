'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Check, Edit2, X, Box, AlertTriangle, TrendingDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function InventoryPage() {
  const stock = useAppStore(state => state.stock)
  const updateStockOnHand = useAppStore(state => state.updateStockOnHand)
  const lastStockUpdate = useAppStore(state => state.lastStockUpdate)
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<string>('')

  const handleEdit = (id: string, currentVal: number) => {
    setEditingId(id)
    setEditValue(currentVal.toString())
  }

  const handleSave = (id: string) => {
    const parsed = parseInt(editValue, 10)
    if (!isNaN(parsed) && parsed >= 0) {
      updateStockStore(id, parsed)
      setEditingId(null)
    }
  }

  const updateStockStore = (id: string, newQty: number) => {
    updateStockOnHand(id, newQty)
  }

  const lowStockCount = stock.filter(s => (s.onHand - s.reserved) <= 10).length

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <Box className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Inventory Stock</h1>
            <p className="text-neutral-500 text-sm mt-0.5">Real-time inventory levels across all locations.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs">
            <span className="text-neutral-500">Total SKUs:</span>
            <span className="font-bold text-neutral-300">{stock.length}</span>
          </div>
          {lowStockCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs">
              <AlertTriangle className="h-3 w-3 text-rose-400" />
              <span className="font-bold text-rose-400">{lowStockCount} low stock</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs">
            <TrendingDown className="h-3 w-3 text-neutral-500" />
            <span className="text-neutral-500">Updated:</span>
            <span className="font-medium text-neutral-400">{lastStockUpdate.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.2)] overflow-hidden mt-6">
        <Table>
          <TableHeader className="bg-white/5 border-b border-white/10">
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="text-neutral-400 font-medium tracking-wide text-xs uppercase">Product / SKU</TableHead>
              <TableHead className="text-neutral-400 font-medium tracking-wide text-xs uppercase">Warehouse</TableHead>
              <TableHead className="text-neutral-400 font-medium tracking-wide text-xs uppercase">Location</TableHead>
              <TableHead className="text-neutral-400 font-medium tracking-wide text-xs uppercase text-right">On Hand</TableHead>
              <TableHead className="text-neutral-400 font-medium tracking-wide text-xs uppercase text-right">Reserved</TableHead>
              <TableHead className="text-neutral-400 font-medium tracking-wide text-xs uppercase text-right">Available</TableHead>
              <TableHead className="text-neutral-400 font-medium tracking-wide text-xs uppercase text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stock.map((line) => {
              const availableQty = line.onHand - line.reserved
              const isLowStock = availableQty <= 10 // Mock reorder level
              const isEditing = editingId === line.id
              
              return (
                <TableRow key={line.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <TableCell>
                    <div className="font-medium text-white group-hover:text-amber-300 transition-colors">{line.product}</div>
                    <div className="text-sm text-neutral-500 mt-0.5">SKU-{line.id.toUpperCase()}</div>
                  </TableCell>
                  <TableCell className="text-neutral-300 font-medium">Main Warehouse</TableCell>
                  <TableCell>
                    <span className="px-2.5 py-1 rounded-full bg-white/5 text-xs text-neutral-300 border border-white/10 shadow-sm backdrop-blur-sm">
                      STK
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium text-neutral-300">
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-2">
                        <Input 
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-20 h-8 bg-neutral-900 border-emerald-500/50 text-white text-right"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSave(line.id)
                            if (e.key === 'Escape') setEditingId(null)
                          }}
                        />
                      </div>
                    ) : (
                      line.onHand
                    )}
                  </TableCell>
                  <TableCell className="text-right text-amber-500 font-medium">{line.reserved}</TableCell>
                  <TableCell className={`text-right font-bold ${isLowStock ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'text-emerald-400'}`}>
                    {availableQty}
                  </TableCell>
                  <TableCell className="text-right">
                    {isEditing ? (
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-400 hover:text-emerald-300" onClick={() => handleSave(line.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-neutral-400 hover:text-neutral-300" onClick={() => setEditingId(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-neutral-400 hover:text-amber-300" onClick={() => handleEdit(line.id, line.onHand)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
            {!stock?.length && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-neutral-500">
                  No inventory stock records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
