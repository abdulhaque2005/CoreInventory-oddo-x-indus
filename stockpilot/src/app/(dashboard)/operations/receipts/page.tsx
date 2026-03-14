'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LayoutGrid, List, Search, ArrowDownToLine, Plus } from "lucide-react"
import { ReceiptsTable } from "@/components/features/operations/receipts-table"
import { motion, AnimatePresence } from 'framer-motion'

const STATUS_COLORS: Record<string, string> = {
  Ready: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Done: 'bg-emerald-500/10 text-amber-400 border-emerald-500/20',
  Cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  Draft: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
}

export default function ReceiptsPage() {
  const receipts = useAppStore(state => state.receipts)
  const [searchQuery, setSearchQuery] = useState('')
  const [view, setView] = useState<'list' | 'kanban'>('list')
  const router = useRouter()

  const filteredReceipts = receipts.filter(r =>
    r.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.from.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const counts = {
    all: receipts.length,
    ready: receipts.filter(r => r.status === 'Ready').length,
    done: receipts.filter(r => r.status === 'Done').length,
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <ArrowDownToLine className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Receipts</h1>
            <p className="text-neutral-500 text-sm mt-0.5">Manage incoming inventory from suppliers.</p>
          </div>
        </div>

        <div className="flex gap-2 items-center flex-wrap justify-end">
          {/* Search */}
          <div className="relative w-56">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-1 focus-visible:ring-emerald-500 h-9 rounded-xl"
            />
          </div>

          {/* View toggle */}
          <div className="flex items-center border border-white/10 rounded-xl p-1 gap-0.5 bg-black/30 backdrop-blur-sm">
            <Button variant="ghost" size="sm" onClick={() => setView('list')}
              className={`h-7 w-7 p-0 rounded-lg transition-all ${view === 'list' ? 'bg-emerald-500/20 text-amber-400' : 'text-neutral-600 hover:text-white hover:bg-white/5'}`}
            >
              <List className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setView('kanban')}
              className={`h-7 w-7 p-0 rounded-lg transition-all ${view === 'kanban' ? 'bg-emerald-500/20 text-amber-400' : 'text-neutral-600 hover:text-white hover:bg-white/5'}`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { label: 'All', value: counts.all, color: 'text-neutral-300' },
          { label: 'Ready', value: counts.ready, color: 'text-emerald-400' },
          { label: 'Completed', value: counts.done, color: 'text-amber-400' },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs">
            <span className="text-neutral-500">{stat.label}:</span>
            <span className={`font-bold ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
        {searchQuery && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
            <span className="text-neutral-400">Showing:</span>
            <span className="font-bold text-amber-400">{filteredReceipts.length} results</span>
            <button onClick={() => setSearchQuery('')} className="text-neutral-500 hover:text-white ml-1">✕</button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div key="list" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <ReceiptsTable receipts={filteredReceipts} onRowClick={(id) => router.push(`/operations/receipts/${id}`)} />
          </motion.div>
        ) : (
          <motion.div key="kanban" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filteredReceipts.map((receipt, i) => (
              <motion.div
                key={receipt.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => router.push(`/operations/receipts/${receipt.id}`)}
                className="bg-white/[0.04] border border-white/10 p-5 rounded-2xl cursor-pointer hover:bg-white/[0.07] hover:border-white/20 transition-all shadow-lg backdrop-blur-sm group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors tracking-tight">{receipt.reference}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">{receipt.responsible}</p>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${STATUS_COLORS[receipt.status] || STATUS_COLORS.Draft}`}>
                    {receipt.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm border-t border-white/5 pt-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">From</span>
                    <span className="text-neutral-300 font-medium">{receipt.from}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">To</span>
                    <span className="text-neutral-300 font-medium">{receipt.to}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Date</span>
                    <span className="text-neutral-400" suppressHydrationWarning>{new Date(receipt.scheduledDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
            {filteredReceipts.length === 0 && (
              <div className="col-span-full py-16 text-center border border-dashed border-white/10 rounded-2xl flex flex-col items-center gap-3">
                <div className="text-4xl">📭</div>
                <p className="text-neutral-500 text-sm">No receipts match your search.</p>
                <button onClick={() => setSearchQuery('')} className="text-amber-400 text-xs hover:underline">Clear filter</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
