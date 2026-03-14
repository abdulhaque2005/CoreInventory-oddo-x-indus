"use client"

import { LucideIcon } from "lucide-react"
import { motion, useMotionValue, useSpring, useTransform, animate } from "framer-motion"
import { useEffect, useRef, useState } from "react"

interface KpiCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'violet' | 'sky'
  trend?: {
    value: number
    label: string
    isPositive: boolean
  }
}

const colorMap = {
  indigo: {
    icon: 'bg-emerald-500/20 border-emerald-500/30 text-amber-400',
    glow: 'rgba(16, 185, 129, 0.15)',
    line: 'bg-emerald-500',
    shadow: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]',
  },
  emerald: {
    icon: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400',
    glow: 'rgba(16, 185, 129, 0.15)',
    line: 'bg-emerald-500',
    shadow: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]',
  },
  amber: {
    icon: 'bg-amber-500/20 border-amber-500/30 text-amber-400',
    glow: 'rgba(245, 158, 11, 0.15)',
    line: 'bg-amber-500',
    shadow: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]',
  },
  rose: {
    icon: 'bg-rose-500/20 border-rose-500/30 text-rose-400',
    glow: 'rgba(244, 63, 94, 0.15)',
    line: 'bg-rose-500',
    shadow: 'group-hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]',
  },
  violet: {
    icon: 'bg-violet-500/20 border-violet-500/30 text-violet-400',
    glow: 'rgba(139, 92, 246, 0.15)',
    line: 'bg-violet-500',
    shadow: 'group-hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]',
  },
  sky: {
    icon: 'bg-sky-500/20 border-sky-500/30 text-sky-400',
    glow: 'rgba(14, 165, 233, 0.15)',
    line: 'bg-sky-500',
    shadow: 'group-hover:shadow-[0_0_30px_rgba(14,165,233,0.15)]',
  },
}

function Counter({ value }: { value: string | number }) {
  const [displayValue, setDisplayValue] = useState(0)
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, "")) : value

  useEffect(() => {
    if (isNaN(numericValue)) return
    const controls = animate(0, numericValue, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate(value) {
        setDisplayValue(Math.floor(value))
      },
    })
    return () => controls.stop()
  }, [numericValue])

  if (typeof value === 'string' && isNaN(numericValue)) return <span>{value}</span>
  return <span>{displayValue.toLocaleString()}</span>
}

export function KpiCard({ title, value, icon: Icon, description, color = 'indigo', trend }: KpiCardProps) {
  const c = colorMap[color]
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      onMouseMove={handleMouseMove}
      className="h-full group"
    >
      <div className={`relative bg-white/[0.04] border border-white/10 rounded-2xl p-5 overflow-hidden backdrop-blur-md h-full transition-all duration-300 hud-border ${c.shadow}`}>
        {/* Animated Grid Background */}
        <div className="absolute inset-0 grid-background opacity-20 group-hover:opacity-30 transition-opacity" />
        
        {/* Magnetic Glow */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([x, y]) => `radial-gradient(circle 120px at ${x}px ${y}px, ${c.glow}, transparent)`
            )
          }}
        />

        {/* Top accent line */}
        <div className={`absolute top-0 left-6 right-6 h-px ${c.line} opacity-0 group-hover:opacity-50 transition-all duration-500 rounded-full`} />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className={`flex-shrink-0 p-3 rounded-xl border ${c.icon} transition-all duration-300 group-hover:scale-110 group-hover:neon-glow`}>
            <Icon className="h-5 w-5" />
          </div>

          <div className="flex-1 text-right">
            <div className="text-3xl font-bold text-white tracking-tight tabular-nums leading-none">
              <Counter value={value} />
            </div>
            {trend && (
              <span className={`text-xs font-medium mt-1 inline-block ${trend.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {trend.isPositive ? '▲' : '▼'} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
        </div>

        <div className="relative z-10 mt-4">
          <p className="text-sm font-semibold text-neutral-200">{title}</p>
          {description && (
            <p className="text-xs text-neutral-500 mt-0.5">{description}</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
