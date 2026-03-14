'use client'

import { useParams, useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Printer, XCircle, CheckCircle2, PackageCheck, FileText } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function ReceiptDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const store = useAppStore()
  const [isValidating, setIsValidating] = useState(false)
  
  const receipt = store.receipts.find(r => r.id === id)

  if (!receipt) {
    return <div className="p-8 text-neutral-400">Receipt not found</div>
  }

  const steps = ['Draft', 'Ready', 'Done']
  const currentStepIdx = steps.indexOf(receipt.status)
  
  const totalUnits = receipt.products.reduce((acc, p) => acc + p.quantity, 0)
  
  const handleValidate = () => {
    setIsValidating(true)
    setTimeout(() => {
      store.updateReceiptStatus(receipt.id, 'Done')
      store.processStockChange(receipt.products, 'add')
      store.addMoveHistory({
        id: `m_${Date.now()}`,
        type: 'Receipt',
        reference: receipt.reference,
        from: receipt.from,
        to: receipt.to,
        status: 'Done',
        date: new Date().toISOString().split('T')[0],
        price: 0,
        quantity: totalUnits,
        products: receipt.products
      })
      toast.success('Receipt validated and stock updated!')
      setIsValidating(false)
      setTimeout(() => router.push('/operations/receipts'), 1000)
    }, 1200)
  }

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this receipt?')) {
      store.updateReceiptStatus(receipt.id, 'Cancelled')
      toast.success('Receipt cancelled.')
      setTimeout(() => router.push('/operations/receipts'), 1000)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-neutral-400 hover:text-white print:hidden">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{receipt.reference}</h1>
            <p className="text-sm text-neutral-400">Goods Receipt from {receipt.from}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 print:hidden">
          <Button variant="outline" size="sm" onClick={handlePrint} className="bg-transparent border-white/10 hover:bg-white/5 text-neutral-300">
            <Printer className="h-4 w-4 mr-2" /> Print
          </Button>
          {receipt.status !== 'Done' && receipt.status !== 'Cancelled' && (
            <Button variant="destructive" size="sm" onClick={handleCancel} className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/20">
              <XCircle className="h-4 w-4 mr-2" /> Cancel
            </Button>
          )}
          {(receipt.status === 'Draft' || receipt.status === 'Ready') && (
            <Button 
              size="sm" 
              onClick={handleValidate} 
              disabled={isValidating}
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              {isValidating ? (
                <span className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" /> Validating...</span>
              ) : (
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Validate Receipt</span>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Status Stepper */}
      <div className="enterprise-card rounded-2xl p-6 print:border print:border-neutral-200 print:bg-white">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/5 rounded-full print:bg-neutral-200" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: receipt.status === 'Cancelled' ? '0%' : `${(Math.max(0, currentStepIdx) / (steps.length - 1)) * 100}%` }}
          />
          
          {steps.map((step, idx) => {
            const isCompleted = currentStepIdx >= idx && receipt.status !== 'Cancelled'
            const isCurrent = currentStepIdx === idx && receipt.status !== 'Cancelled'
            
            let Icon = FileText
            if (step === 'Ready') Icon = PackageCheck
            else if (step === 'Done') Icon = CheckCircle2
            
            return (
              <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${isCompleted ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-neutral-900 border-neutral-700 text-neutral-500 print:bg-neutral-100'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-semibold uppercase tracking-wider ${isCurrent ? 'text-emerald-400' : isCompleted ? 'text-neutral-300' : 'text-neutral-600'}`}>
                  {step}
                </span>
              </div>
            )
          })}
        </div>
        
        {receipt.status === 'Cancelled' && (
          <div className="mt-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400">
            <XCircle className="h-5 w-5" />
            <span className="text-sm font-medium">This operation has been cancelled.</span>
          </div>
        )}
      </div>

      {/* Print-only Company Header */}
      <div className="hidden print:block border-b border-neutral-300 pb-4 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-black">StockPilot Warehouse</h2>
            <p className="text-sm text-neutral-600">AI-Powered Inventory Management</p>
            <p className="text-xs text-neutral-500 mt-1">123 Industrial Zone, Sector 7 · Ph: +92-300-0000000</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-black">{receipt.reference}</p>
            <p className="text-sm text-neutral-600">Goods Receipt Note</p>
            <p className="text-xs text-neutral-500 mt-1">Date: {new Date(receipt.scheduledDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="enterprise-card rounded-2xl p-6 print:border print:border-neutral-200 print:bg-white">
            <h3 className="text-lg font-medium text-white mb-6 print:text-black">Product Lines</h3>
            
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-neutral-400 uppercase bg-black/20 print:bg-neutral-100 print:text-neutral-700">
                  <tr>
                    <th className="px-4 py-3 font-medium rounded-tl-lg">#</th>
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium text-right">Ordered Qty</th>
                    <th className="px-4 py-3 font-medium text-right rounded-tr-lg">Received</th>
                  </tr>
                </thead>
                <tbody>
                  {receipt.products.map((p, idx) => (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors print:border-neutral-200">
                      <td className="px-4 py-4 text-neutral-500 print:text-neutral-600">{idx + 1}</td>
                      <td className="px-4 py-4 font-medium text-white print:text-black">{p.product}</td>
                      <td className="px-4 py-4 text-neutral-300 text-right font-mono print:text-black">{p.quantity.toLocaleString()}</td>
                      <td className="px-4 py-4 text-emerald-400 text-right font-medium font-mono print:text-emerald-700">
                        {receipt.status === 'Done' ? p.quantity.toLocaleString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-white/10 print:border-neutral-300">
                  <tr>
                    <td colSpan={2} className="px-4 py-3 font-bold text-neutral-300 uppercase text-xs tracking-wider print:text-black">Total</td>
                    <td className="px-4 py-3 font-bold text-white text-right font-mono print:text-black">{totalUnits.toLocaleString()}</td>
                    <td className="px-4 py-3 font-bold text-emerald-400 text-right font-mono print:text-emerald-700">
                      {receipt.status === 'Done' ? totalUnits.toLocaleString() : '—'}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="enterprise-card rounded-2xl p-6 print:border print:border-neutral-200 print:bg-white">
            <h3 className="text-lg font-medium text-white mb-4 print:text-black">Logistics Details</h3>
            <div className="space-y-4 text-sm">
              <div>
                <span className="block text-neutral-500 mb-1 text-xs uppercase tracking-wider">Supplier</span>
                <span className="block text-white font-medium print:text-black">{receipt.from}</span>
              </div>
              <div className="h-px bg-white/10 w-full print:bg-neutral-200" />
              <div>
                <span className="block text-neutral-500 mb-1 text-xs uppercase tracking-wider">Destination</span>
                <span className="block text-white font-medium print:text-black">{receipt.to}</span>
              </div>
              <div className="h-px bg-white/10 w-full print:bg-neutral-200" />
              <div>
                <span className="block text-neutral-500 mb-1 text-xs uppercase tracking-wider">Scheduled Date</span>
                <span className="block text-neutral-300 print:text-black">{new Date(receipt.scheduledDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="h-px bg-white/10 w-full print:bg-neutral-200" />
              <div>
                <span className="block text-neutral-500 mb-1 text-xs uppercase tracking-wider">Processed By</span>
                <span className="block text-neutral-300 print:text-black">{receipt.responsible}</span>
              </div>
              <div className="h-px bg-white/10 w-full print:bg-neutral-200" />
              <div>
                <span className="block text-neutral-500 mb-1 text-xs uppercase tracking-wider">Status</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  receipt.status === 'Done' ? 'bg-emerald-500/10 text-emerald-400 print:text-emerald-700' :
                  receipt.status === 'Ready' ? 'bg-amber-500/10 text-amber-400 print:text-amber-700' :
                  receipt.status === 'Cancelled' ? 'bg-rose-500/10 text-rose-400' :
                  'bg-white/5 text-neutral-400 print:text-neutral-700'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    receipt.status === 'Done' ? 'bg-emerald-500' :
                    receipt.status === 'Ready' ? 'bg-amber-500' :
                    receipt.status === 'Cancelled' ? 'bg-rose-500' :
                    'bg-neutral-500'
                  }`} />
                  {receipt.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print footer */}
      <div className="hidden print:block border-t border-neutral-300 pt-4 mt-8">
        <div className="flex justify-between text-xs text-neutral-500">
          <span>Generated by StockPilot · {new Date().toLocaleString()}</span>
          <span>Authorized Signature: ____________________</span>
        </div>
      </div>
    </div>
  )
}
