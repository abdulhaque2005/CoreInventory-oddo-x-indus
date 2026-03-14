'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Download, Share2, Sparkles, Filter, Calendar, TrendingUp, AlertCircle } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"

interface AiReportContent {
  executiveSummary: string;
  metrics: {
    turnoverRate: string;
    carryingCost: string;
    deadStockPercent: string;
  };
  topPerformers: { product: string; status: string }[];
  riskAssessment: string;
}

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [report, setReport] = useState<AiReportContent | null>(null)
  const { stock, anomalies, moveHistory } = useAppStore()

  const generateReport = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stock,
          anomalies,
          moveHistory
        })
      })

      if (!response.ok) throw new Error('Failed to generate report')
      const data = await response.json()
      setReport(data)
      toast.success('AI Report generated successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to run AI analysis')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-100 flex items-center gap-3">
            AI Inventory Reports
            <FileText className="w-5 h-5 text-amber-400" />
          </h1>
          <p className="text-neutral-500 text-sm mt-1">Automated intelligence summaries and export center.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-semibold hover:bg-white/10 transition-colors flex items-center gap-2 uppercase tracking-widest">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </button>
          <button 
            onClick={generateReport}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50 uppercase tracking-widest"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isGenerating ? "Analyzing..." : "Run New Analysis"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="enterprise-card rounded-2xl p-8 relative overflow-hidden min-h-[500px] flex flex-col">
            {isGenerating ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-sm z-10 transition-all">
                  <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-sm font-mono text-amber-400 animate-pulse">Neural Engine Processing Data...</p>
               </div>
            ) : null}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 border-b border-white/5 pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <FileText className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white uppercase tracking-widest">Global AI Stock Audit</h2>
                        <p className="text-xs text-neutral-500 font-mono mt-0.5 flex items-center gap-2">
                           ID: RPT-{new Date().getFullYear()}-{new Date().getMonth()+1} | Gen: {new Date().toLocaleDateString()}
                           {report && <span className="bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-widest">Fresh</span>}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition-colors" title="Export PDF">
                        <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition-colors" title="Share Report">
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {!report && !isGenerating ? (
               <div className="flex-1 flex flex-col items-center justify-center opacity-50 space-y-4 py-12">
                  <Sparkles className="w-12 h-12 text-neutral-600" />
                  <p className="text-sm text-neutral-400 font-mono">No recent analysis found for current cycle.</p>
                  <button onClick={generateReport} className="text-sm text-amber-400 font-semibold hover:text-amber-300">Run Analysis Now</button>
               </div>
            ) : null}

            {report && (
                <div className="space-y-8 animate-in fade-in duration-700">
                    <section>
                        <h3 className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest mb-4">AI Executive Summary</h3>
                        <p className="text-[13px] text-neutral-300 leading-relaxed font-mono bg-white/[0.02] p-5 rounded-xl border border-white/5">
                            {report.executiveSummary}
                        </p>
                    </section>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5">
                            <h4 className="text-[9px] font-semibold text-neutral-400 uppercase tracking-widest mb-4">Key Metrics</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[11px]">
                                    <span className="text-neutral-500 font-mono">Turnover Rate</span>
                                    <span className="text-emerald-400 font-semibold">{report.metrics.turnoverRate}</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px]">
                                    <span className="text-neutral-500 font-mono">Carrying Cost</span>
                                    <span className="text-neutral-100 font-semibold">{report.metrics.carryingCost}</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px]">
                                    <span className="text-neutral-500 font-mono">Dead Stock %</span>
                                    <span className="text-rose-400 font-semibold">{report.metrics.deadStockPercent}</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5">
                            <h4 className="text-[9px] font-semibold text-neutral-400 uppercase tracking-widest mb-4">Top Performers</h4>
                             <div className="space-y-4">
                                {report.topPerformers.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center text-[11px]">
                                        <span className="text-neutral-300 font-mono truncate max-w-[120px]">{item.product}</span>
                                        <span className="text-amber-400 font-semibold uppercase">{item.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <section className="p-5 rounded-xl bg-neutral-800/40 border border-neutral-700/50 flex gap-4 mt-2">
                        <AlertCircle className="w-5 h-5 text-amber-500/80 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-xs font-semibold text-amber-500/90 uppercase tracking-widest mb-1.5">Risk Assessment</h4>
                            <p className="text-[11px] text-neutral-400 font-mono leading-relaxed">
                                {report.riskAssessment}
                            </p>
                        </div>
                    </section>
                </div>
            )}
          </div>
        </div>

        {/* Sidebar Mini Components */}
        <div className="space-y-6">
          <div className="enterprise-card rounded-2xl p-6">
            <h3 className="text-[11px] font-semibold text-neutral-100 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                Previous Reports
            </h3>
            <div className="space-y-2 mt-4">
                {[1, 2, 3].map(i => (
                    <button key={i} className="w-full p-3 rounded-xl hover:bg-white/[0.05] transition-colors text-left flex items-center justify-between group border border-transparent hover:border-white/5">
                        <div>
                            <p className="text-[11px] font-semibold text-neutral-300 group-hover:text-amber-400 transition-colors uppercase tracking-wider">Audit Cycle Mar-W{i}</p>
                            <p className="text-[10px] text-neutral-600 font-mono mt-1">{14-i} Mar {new Date().getFullYear()}</p>
                        </div>
                        <Download className="w-4 h-4 text-neutral-600 group-hover:text-neutral-300" />
                    </button>
                ))}
            </div>
          </div>

          <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
            <TrendingUp className="w-16 h-16 text-amber-500/10 absolute -top-4 -right-2 transform rotate-12 transition-transform group-hover:scale-110" />
            <h3 className="text-[11px] font-semibold text-neutral-100 uppercase tracking-widest mb-2 relative z-10">Automate Reports</h3>
            <p className="text-[10px] text-neutral-400 font-mono leading-relaxed mb-6 relative z-10">
                Schedule AI reports to be delivered to your inbox every Sunday at 08:00 UTC.
            </p>
            <button className="w-full py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-amber-400 border border-emerald-500/20 text-[10px] font-semibold uppercase tracking-widest transition-colors relative z-10">
                Setup Automation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
