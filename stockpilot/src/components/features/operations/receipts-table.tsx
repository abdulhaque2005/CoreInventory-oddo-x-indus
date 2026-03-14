'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CheckCircle2, Clock, Circle, XCircle } from "lucide-react"

interface ReceiptsTableProps {
  receipts: any[]
  onRowClick?: (id: string) => void
}

export function ReceiptsTable({ receipts, onRowClick }: ReceiptsTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ready': return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" /> Ready
        </span>
      )
      case 'Done': return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-amber-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" /> Done
        </span>
      )
      case 'Cancelled': return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <XCircle className="w-3 h-3" /> Cancelled
        </span>
      )
      default: return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-500/10 text-neutral-400 border border-neutral-500/20">
          <Circle className="w-3 h-3" /> Draft
        </span>
      )
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.2)] overflow-hidden">
      <Table>
        <TableHeader className="bg-white/5 border-b border-white/10">
          <TableRow className="border-none hover:bg-transparent">
            <TableHead className="text-neutral-400 font-medium text-xs uppercase tracking-wide">Reference</TableHead>
            <TableHead className="text-neutral-400 font-medium text-xs uppercase tracking-wide">From</TableHead>
            <TableHead className="text-neutral-400 font-medium text-xs uppercase tracking-wide">To</TableHead>
            <TableHead className="text-neutral-400 font-medium text-xs uppercase tracking-wide">Scheduled Date</TableHead>
            <TableHead className="text-neutral-400 font-medium text-xs uppercase tracking-wide">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {receipts.map((receipt) => (
            <TableRow 
              key={receipt.id} 
              className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
              onClick={() => onRowClick?.(receipt.id)}
            >
              <TableCell className="font-medium text-white">{receipt.reference}</TableCell>
              <TableCell className="text-neutral-300">{receipt.from}</TableCell>
              <TableCell className="text-neutral-300">{receipt.to}</TableCell>
              <TableCell className="text-neutral-400 text-sm">
                {receipt.scheduledDate ? new Date(receipt.scheduledDate).toLocaleDateString() : '—'}
              </TableCell>
              <TableCell>{getStatusBadge(receipt.status)}</TableCell>
            </TableRow>
          ))}
          {receipts.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="text-4xl">📭</div>
                  <p className="text-neutral-500 text-sm">No receipts found.</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
