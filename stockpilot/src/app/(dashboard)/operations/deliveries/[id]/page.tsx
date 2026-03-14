'use client'

import { useParams, useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Printer, XCircle, CheckCircle2, PackageCheck, Truck } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function DeliveryDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const store = useAppStore()
  const [isValidating, setIsValidating] = useState(false)
  
  const delivery = store.deliveries.find(d => d.id === id)

  if (!delivery) {
    return <div className="p-8 text-neutral-400">Delivery not found</div>
  }

  const steps = ['Draft', 'Ready', 'Done']
  const currentStepIdx = steps.indexOf(delivery.status)
  
  const handleValidate = () => {
    // Basic validation to check stock
    const insufficientStock: string[] = []
    delivery.products.forEach(p => {
      const stockItem = store.stock.find(s => s.product === p.product)
      if (!stockItem || stockItem.onHand < p.quantity) {
        insufficientStock.push(p.product)
      }
    })

    if (insufficientStock.length > 0) {
      toast.error(`Insufficient stock for: ${insufficientStock.join(', ')}`)
      return
    }

    setIsValidating(true)
    setTimeout(() => {
      // 1. Update status
      store.updateDeliveryStatus(delivery.id, 'Done')
      
      // 2. Subtract from stock
      store.processStockChange(delivery.products, 'subtract')
      
      // 3. Add to move history
      store.addMoveHistory({
        id: `m_${Date.now()}`,
        type: 'Delivery',
        reference: delivery.reference,
        from: delivery.from,
        to: delivery.to,
        status: 'Done',
        date: new Date().toISOString().split('T')[0],
        price: 0, 
        quantity: delivery.products.reduce((acc, p) => acc + p.quantity, 0),
        products: delivery.products
      })
      
      toast.success('Delivery shipped and stock updated!')
      setIsValidating(false)
      setTimeout(() => router.push('/operations/deliveries'), 1000)
    }, 1200)
  }

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this delivery order?')) {
      store.updateDeliveryStatus(delivery.id, 'Cancelled')
      toast.success('Delivery cancelled.')
      setTimeout(() => router.push('/operations/deliveries'), 1000)
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
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-neutral-400 hover:text-white">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{delivery.reference}</h1>
            <p className="text-sm text-neutral-400">Delivery to {delivery.to}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} className="bg-transparent border-white/10 hover:bg-white/5 text-neutral-300">
            <Printer className="h-4 w-4 mr-2" /> Print
          </Button>
          {delivery.status !== 'Done' && delivery.status !== 'Cancelled' && (
            <Button variant="destructive" size="sm" onClick={handleCancel} className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/20">
              <XCircle className="h-4 w-4 mr-2" /> Cancel
            </Button>
          )}
          {(delivery.status === 'Draft' || delivery.status === 'Ready') && (
            <Button 
              size="sm" 
              onClick={handleValidate} 
              disabled={isValidating}
              className="bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              {isValidating ? (
                <span className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" /> Validating...</span>
              ) : (
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Validate & Ship</span>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Status Stepper */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/5 rounded-full" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-500 rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: delivery.status === 'Cancelled' ? '0%' : `${(Math.max(0, currentStepIdx) / (steps.length - 1)) * 100}%` }}
          />
          
          {steps.map((step, idx) => {
            const isCompleted = currentStepIdx >= idx && delivery.status !== 'Cancelled'
            const isCurrent = currentStepIdx === idx && delivery.status !== 'Cancelled'
            
            let Icon = PackageCheck
            if (step === 'Ready') Icon = Truck
            else if (step === 'Done') Icon = CheckCircle2
            
            return (
              <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${isCompleted ? 'bg-indigo-500 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-neutral-900 border-neutral-700 text-neutral-500'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-semibold uppercase tracking-wider ${isCurrent ? 'text-indigo-400' : isCompleted ? 'text-neutral-300' : 'text-neutral-600'}`}>
                  {step}
                </span>
              </div>
            )
          })}
        </div>
        
        {delivery.status === 'Cancelled' && (
          <div className="mt-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400">
            <XCircle className="h-5 w-5" />
            <span className="text-sm font-medium">This delivery has been cancelled.</span>
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-medium text-white mb-6">Operations</h3>
            
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-neutral-400 uppercase bg-black/20">
                  <tr>
                    <th className="px-4 py-3 font-medium rounded-tl-lg">Product</th>
                    <th className="px-4 py-3 font-medium text-right">Required</th>
                    <th className="px-4 py-3 font-medium text-right rounded-tr-lg">Shipped</th>
                  </tr>
                </thead>
                <tbody>
                  {delivery.products.map(p => {
                    const stockItem = store.stock.find(s => s.product === p.product)
                    const isAvailable = stockItem ? stockItem.onHand >= p.quantity : false
                    
                    return (
                      <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-4 font-medium text-white flex flex-col">
                          {p.product}
                          {delivery.status !== 'Done' && delivery.status !== 'Cancelled' && (
                             <span className={`text-xs mt-1 ${isAvailable ? 'text-emerald-500' : 'text-rose-500'}`}>
                               Available: {stockItem?.onHand || 0}
                             </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-neutral-300 text-right">{p.quantity}</td>
                        <td className="px-4 py-4 text-emerald-400 text-right font-medium">
                          {delivery.status === 'Done' ? p.quantity : 0}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-medium text-white mb-4">Logistics</h3>
            <div className="space-y-4 text-sm">
              <div>
                <span className="block text-neutral-500 mb-1">Source Location</span>
                <span className="block text-white font-medium">{delivery.from}</span>
              </div>
              <div className="h-px bg-white/10 w-full" />
              <div>
                <span className="block text-neutral-500 mb-1">Customer</span>
                <span className="block text-white font-medium">{delivery.to}</span>
              </div>
              <div className="h-px bg-white/10 w-full" />
              <div>
                <span className="block text-neutral-500 mb-1">Scheduled Date</span>
                <span className="block text-neutral-300">{new Date(delivery.scheduledDate).toLocaleDateString()}</span>
              </div>
              <div className="h-px bg-white/10 w-full" />
              <div>
                <span className="block text-neutral-500 mb-1">Responsible</span>
                <span className="block text-neutral-300">{delivery.responsible}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
