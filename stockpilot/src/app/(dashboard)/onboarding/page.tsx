'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, BarChart3, Zap, Map, Package, ArrowRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

const steps = [
  {
    icon: Package,
    title: 'Inventory Management',
    subtitle: 'Complete Stock Visibility',
    description: 'Track every product across all warehouses in real-time. StockPilot monitors on-hand quantities, reserved stock, and per-unit costs with precision. Instantly detect stockouts, overstock situations, and dead inventory.',
    features: ['24 product categories pre-seeded', 'Real-time on-hand & reserved tracking', 'Per-unit cost analysis', 'Multi-warehouse support'],
    color: 'emerald',
  },
  {
    icon: Bot,
    title: 'AI Copilot & Assistant',
    subtitle: 'Natural Language Commands',
    description: 'Interact with your warehouse using plain English. Ask questions like "Show me low stock items" or give commands like "Restock 500 bolts from Vendor A". The AI understands intent, extracts parameters, and asks for confirmation before executing.',
    features: ['RAG-powered contextual chat', 'Intent extraction engine', 'Security confirmation flow', 'Groq LLaMA 3-70B backend'],
    color: 'amber',
  },
  {
    icon: BarChart3,
    title: 'Predictive Analytics & Reports',
    subtitle: 'AI-Generated Intelligence',
    description: 'Generate comprehensive executive reports with a single click. The AI analyzes stock movements, detects anomalies, calculates turnover rates, and provides risk assessments. Export reports as PDF or Excel.',
    features: ['Executive summary generation', 'Turnover & carrying cost metrics', 'Top performer identification', 'Risk assessment & forecasting'],
    color: 'emerald',
  },
  {
    icon: Zap,
    title: 'WAT Automation Engine',
    subtitle: 'Worker-Action-Trigger Framework',
    description: 'Automate repetitive warehouse tasks with configurable rules. Set triggers like "If Bolts drop below 1000, auto-create a purchase order for 2000". Every automation asks for explicit security confirmation before executing.',
    features: ['Low-stock auto-restock rules', 'Dead inventory alert triggers', 'Security confirmation modals', 'Real-time worker status HUD'],
    color: 'amber',
  },
  {
    icon: Map,
    title: 'Warehouse Visualization',
    subtitle: 'Interactive Heatmap Grid',
    description: 'Visualize your entire warehouse layout as an interactive heatmap. Color-coded racks show utilization levels from empty to full. Click any rack to see contents, AI optimization suggestions, and movement history.',
    features: ['Utilization-based color coding', 'Click-to-inspect rack details', 'AI-suggested zone optimization', 'Multi-zone support'],
    color: 'emerald',
  },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const step = steps[currentStep]
  const Icon = step.icon
  const isLast = currentStep === steps.length - 1

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <img src="/logo.png" alt="StockPilot" className="w-16 h-16 rounded-2xl mx-auto mb-4 border border-amber-500/20 shadow-lg" />
        <h1 className="text-3xl font-bold text-white tracking-tight font-heading">Welcome to StockPilot</h1>
        <p className="text-emerald-200/60 text-sm mt-1">Your AI-Powered Warehouse Management System</p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentStep(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentStep ? 'w-8 bg-amber-500' : i < currentStep ? 'w-4 bg-emerald-500/60' : 'w-4 bg-white/10'
            }`}
          />
        ))}
      </div>

      {/* Step Content */}
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="enterprise-card rounded-2xl p-8 relative overflow-hidden"
          >
            {/* Decorative glow */}
            <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] pointer-events-none ${
              step.color === 'amber' ? 'bg-amber-500/20' : 'bg-emerald-500/20'
            }`} />

            <div className="relative z-10">
              {/* Icon & Title */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-xl border ${
                  step.color === 'amber'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{step.title}</h2>
                  <p className={`text-xs font-semibold uppercase tracking-widest ${
                    step.color === 'amber' ? 'text-amber-500/80' : 'text-emerald-500/80'
                  }`}>{step.subtitle}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-neutral-300 leading-relaxed mb-6">{step.description}</p>

              {/* Feature List */}
              <div className="grid grid-cols-2 gap-2">
                {step.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-neutral-400">
                    <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${
                      step.color === 'amber' ? 'text-amber-500' : 'text-emerald-500'
                    }`} />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4 mt-8">
        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-neutral-400 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            Back
          </button>
        )}
        {isLast ? (
          <Link
            href="/dashboard"
            className="px-8 py-2.5 rounded-xl text-sm font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/40 transition-all flex items-center gap-2"
          >
            Enter Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="px-8 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 transition-all flex items-center gap-2"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Skip Link */}
      <Link href="/dashboard" className="mt-4 text-xs text-neutral-600 hover:text-neutral-400 transition-colors">
        Skip onboarding →
      </Link>
    </div>
  )
}
