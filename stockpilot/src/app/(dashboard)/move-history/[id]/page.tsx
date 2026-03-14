'use client'

import { useParams, useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ArrowDownRight, ArrowUpRight } from 'lucide-react'

export default function MoveHistoryDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const moveHistory = useAppStore(state => state.moveHistory)

  const move = moveHistory.find(m => m.id === id)

  if (!move) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="text-6xl">📦</div>
        <h2 className="text-xl font-bold text-white">Move not found</h2>
        <Button variant="outline" onClick={() => router.back()} className="border-white/10 text-neutral-300">Go Back</Button>
      </div>
    )
  }

  const isReceipt = move.reference.startsWith('WH/IN')
  const Icon = isReceipt ? ArrowDownRight : ArrowUpRight
  const color = isReceipt ? 'text-emerald-400' : 'text-rose-400'
  const badge = isReceipt
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-neutral-400 hover:text-white">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{move.reference}</h1>
          <p className="text-sm text-neutral-400">{new Date(move.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${badge}`}>
        <Icon className="h-5 w-5" />
        <span className="text-sm font-semibold">{isReceipt ? 'Stock Receipt' : 'Stock Delivery'} — {move.status}</span>
        <span className="ml-auto text-xs opacity-60">{move.from} → {move.to}</span>
      </div>

      {/* Detail Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'From', value: move.from },
          { label: 'To', value: move.to },
          { label: 'Total Qty', value: move.quantity.toString() },
          { label: 'Status', value: move.status }
        ].map(({ label, value }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-base font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Products */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-5">Products Moved</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-neutral-400 uppercase bg-black/20">
              <tr>
                <th className="px-4 py-3 text-left font-medium rounded-tl-lg">Product</th>
                <th className="px-4 py-3 text-right font-medium rounded-tr-lg">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {move.products.map((p, i) => (
                <tr key={p.id || i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-4 font-medium text-emerald-400">{p.product}</td>
                  <td className={`px-4 py-4 text-right font-bold ${color}`}>
                    {isReceipt ? '+' : '-'}{p.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Read-only notice */}
      <div className="flex items-center gap-2 text-xs text-neutral-600 bg-white/5 border border-white/5 rounded-xl px-4 py-3">
        <span>📋</span>
        <span>This is a read-only audit record. Move history entries cannot be modified.</span>
      </div>
    </div>
  )
}
