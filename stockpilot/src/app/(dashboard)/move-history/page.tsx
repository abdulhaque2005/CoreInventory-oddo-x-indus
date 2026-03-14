'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowDownRight, ArrowUpRight, History, LayoutGrid, List, Search } from "lucide-react"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

function HighlightText({ text, query, highlightClass }: { text: string; query: string; highlightClass?: string }) {
  if (!query) return <span>{text}</span>
  const regex = new RegExp(`(${query})`, 'gi')
  const parts = text.split(regex)
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className={highlightClass || 'bg-emerald-500/30 text-amber-300 rounded px-0.5'}>{part}</span>
        ) : (
          part
        )
      )}
    </span>
  )
}

export default function MoveHistoryPage() {
  const moveHistory = useAppStore(state => state.moveHistory)
  const [searchQuery, setSearchQuery] = useState('')
  const [view, setView] = useState<'list' | 'kanban'>('list')
  const router = useRouter()

  const filtered = moveHistory.filter(m =>
    m.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.products.some(p => p.product.toLowerCase().includes(searchQuery.toLowerCase())) ||
    m.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.to.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-violet-500/10 border border-violet-500/20">
            <History className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Move History</h1>
            <p className="text-neutral-500 text-sm mt-0.5">Audit log of all inventory transactions and adjustments.</p>
          </div>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <div className="relative w-56">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search reference or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-1 focus-visible:ring-emerald-500 h-9 rounded-xl"
            />
          </div>
          <div className="flex items-center border border-white/10 rounded-xl p-1 gap-0.5 bg-black/30 backdrop-blur-sm">
            <Button variant="ghost" size="sm" onClick={() => setView('list')}
              className={`h-7 w-7 p-0 rounded-lg transition-all ${view === 'list' ? 'bg-emerald-500/20 text-amber-400' : 'text-neutral-600 hover:text-white hover:bg-white/5'}`}>
              <List className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setView('kanban')}
              className={`h-7 w-7 p-0 rounded-lg transition-all ${view === 'kanban' ? 'bg-emerald-500/20 text-amber-400' : 'text-neutral-600 hover:text-white hover:bg-white/5'}`}>
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs">
          <span className="text-neutral-500">Total events:</span>
          <span className="font-bold text-neutral-300">{moveHistory.length}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/10 text-xs">
          <span className="text-neutral-500">Receipts:</span>
          <span className="font-bold text-emerald-400">{moveHistory.filter(m => m.reference.startsWith('WH/IN')).length}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/10 text-xs">
          <span className="text-neutral-500">Deliveries:</span>
          <span className="font-bold text-rose-400">{moveHistory.filter(m => m.reference.startsWith('WH/OUT')).length}</span>
        </div>
        {searchQuery && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
            <span className="text-neutral-400">Showing:</span>
            <span className="font-bold text-amber-400">{filtered.length} results</span>
            <button onClick={() => setSearchQuery('')} className="text-neutral-500 hover:text-white ml-1">✕</button>
          </div>
        )}
      </div>

      {view === 'list' ? (
        <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.2)] overflow-hidden">
          <Table>
            <TableHeader className="bg-white/5 border-b border-white/10">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="text-neutral-400 font-medium text-xs uppercase tracking-wide">Date</TableHead>
                <TableHead className="text-neutral-400 font-medium text-xs uppercase tracking-wide">Reference</TableHead>
                <TableHead className="text-neutral-400 font-medium text-xs uppercase tracking-wide">From → To</TableHead>
                <TableHead className="text-neutral-400 font-medium text-xs uppercase tracking-wide">Products</TableHead>
                <TableHead className="text-right text-neutral-400 font-medium text-xs uppercase tracking-wide">Qty</TableHead>
                <TableHead className="text-neutral-400 font-medium text-xs uppercase tracking-wide">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((move) => {
                const isReceipt = move.reference.startsWith('WH/IN')
                const Icon = isReceipt ? ArrowDownRight : ArrowUpRight
                const color = isReceipt ? 'text-emerald-400' : 'text-rose-400'
                const badge = isReceipt
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'

                return (
                  <TableRow 
                    key={move.id} 
                    className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => router.push(`/move-history/${move.id}`)}
                  >
                    <TableCell className="text-neutral-400 text-sm" suppressHydrationWarning>{new Date(move.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className="font-bold text-white">
                        <HighlightText text={move.reference} query={searchQuery} highlightClass="bg-emerald-500/30 text-amber-300 font-bold rounded px-0.5" />
                      </span>
                    </TableCell>
                    <TableCell className="text-neutral-400 text-sm">{move.from} → {move.to}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {move.products.map(p => (
                          <span key={p.id} className="text-sm text-emerald-400 font-medium">
                            <HighlightText text={p.product} query={searchQuery} highlightClass="text-emerald-300 bg-emerald-500/20 rounded px-0.5" />
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className={`text-right font-medium ${color}`}>{isReceipt ? '+' : '-'}{move.quantity}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${badge}`}>
                        <Icon className="w-3 h-3" /> {isReceipt ? 'Receipt' : 'Delivery'}
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })}
              {!filtered.length && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-neutral-500">
                    {searchQuery ? `No moves match "${searchQuery}"` : 'No stock moves recorded yet.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((move, i) => {
            const isReceipt = move.reference.startsWith('WH/IN')
            const Icon = isReceipt ? ArrowDownRight : ArrowUpRight

            return (
              <motion.div
                key={move.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => router.push(`/move-history/${move.id}`)}
                className="bg-white/[0.04] border border-white/10 p-5 rounded-2xl shadow-lg backdrop-blur-sm cursor-pointer hover:bg-white/[0.07] hover:border-white/20 transition-all group"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="font-bold text-white text-sm">
                    <HighlightText text={move.reference} query={searchQuery} highlightClass="bg-emerald-500/30 text-amber-300 font-bold rounded px-0.5" />
                  </span>
                  <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${
                    isReceipt ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    <Icon className="w-3 h-3" /> {isReceipt ? 'In' : 'Out'}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 text-sm">
                  {move.products.map(p => (
                    <span key={p.id} className="text-emerald-400 font-medium">
                      <HighlightText text={p.product} query={searchQuery} highlightClass="text-emerald-300 bg-emerald-500/20 rounded px-0.5" />
                      <span className="text-neutral-500 ml-1">×{p.quantity}</span>
                    </span>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-white/5 text-xs text-neutral-500" suppressHydrationWarning>
                  {new Date(move.date).toLocaleDateString()} · {move.from} → {move.to}
                </div>
              </motion.div>
            )
          })}
          {!filtered.length && (
            <div className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
              <p className="text-neutral-500">No moves match your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
