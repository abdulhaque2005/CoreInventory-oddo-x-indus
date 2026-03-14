'use client'

import { useState, useEffect } from 'react'
import { KpiCard } from "@/components/features/dashboard/kpi-card"
import { StockChart } from "@/components/features/dashboard/stock-chart"
import { AiAssistant } from "@/components/features/ai/AiAssistant"
import { AnomalyAlerts } from "@/components/features/dashboard/AnomalyAlerts"
import { DeadInventoryWidget } from "@/components/features/dashboard/DeadInventoryWidget"
import { SmartRestockPanel } from "@/components/features/dashboard/SmartRestockPanel"
import { DemandPredictionChart } from "@/components/features/dashboard/DemandPredictionChart"
import { StockMovementTimeline } from "@/components/features/dashboard/StockMovementTimeline"
import { AutomationHud } from "@/components/features/dashboard/AutomationHud"
import { detectAnomalies, detectDeadInventory, suggestRestocks, predictDemandData } from "@/lib/intelligence"
import { Package, ArrowDownToLine, ArrowUpFromLine, History, Sparkles } from "lucide-react"
import { useAppStore } from '@/lib/store'
import Link from 'next/link'

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  
  const stock = useAppStore(state => state.stock)
  const receipts = useAppStore(state => state.receipts)
  const deliveries = useAppStore(state => state.deliveries)
  const moveHistory = useAppStore(state => state.moveHistory)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const receiptCount = receipts.filter(r => r.status === 'Draft' || r.status === 'Ready').length
  const deliveryCount = deliveries.filter(d => d.status === 'Draft' || d.status === 'Ready').length
  const moveHistoryCount = moveHistory.length

  const anomalies = detectAnomalies(moveHistory)
  const deadItems = detectDeadInventory(stock, moveHistory)
  const restockSuggestions = suggestRestocks(stock, moveHistory)
  const predictionData = predictDemandData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-100 flex items-center gap-3">
            Dashboard
          </h1>
          <p className="text-neutral-500 text-sm mt-1">Overview of your inventory and warehouse operations.</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold mb-1">System Status</p>
          <div className="flex items-center gap-2 justify-end">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] text-neutral-300 font-medium">OPERATIONAL</span>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/inventory" className="block outline-none rounded-xl hover:-translate-y-0.5 transition-transform">
          <KpiCard 
            title="Total Stock Items" 
            value={isLoading ? '...' : stock.reduce((acc, curr) => acc + curr.onHand, 0)} 
            icon={Package} 
            description="Total units on hand"
            color="emerald"
          />
        </Link>
        <Link href="/operations/receipts" className="block outline-none rounded-xl hover:-translate-y-0.5 transition-transform">
          <KpiCard 
            title="Pending Receipts" 
            value={isLoading ? '...' : receiptCount} 
            icon={ArrowDownToLine} 
            description="Incoming stock orders"
            color="emerald"
          />
        </Link>
        <Link href="/operations/deliveries" className="block outline-none rounded-xl hover:-translate-y-0.5 transition-transform">
          <KpiCard 
            title="Pending Deliveries" 
            value={isLoading ? '...' : deliveryCount} 
            icon={ArrowUpFromLine} 
            description="Outgoing customer orders"
            color="amber"
          />
        </Link>
        <Link href="/move-history" className="block outline-none rounded-xl hover:-translate-y-0.5 transition-transform">
          <KpiCard 
            title="Move History" 
            value={isLoading ? '...' : moveHistoryCount} 
            icon={History} 
            description="Audit trail events"
            color="emerald"
          />
        </Link>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-4 items-stretch">
        <div className="lg:col-span-3">
          <StockChart />
        </div>
        <div className="lg:col-span-1">
          <AiAssistant />
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AnomalyAlerts anomalies={anomalies} />
          </div>
          <DeadInventoryWidget items={deadItems.slice(0, 3)} />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DemandPredictionChart data={predictionData} />
          </div>
          <SmartRestockPanel suggestions={restockSuggestions.slice(0, 3)} />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <StockMovementTimeline />
          </div>
          <AutomationHud />
      </div>
    </div>
  )
}
