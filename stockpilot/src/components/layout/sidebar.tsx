'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Package,
  Box,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  Settings2,
  Bot,
  Warehouse,
  Map,
  FileText,
  Settings,
  Zap
} from "lucide-react"
import { useUser } from "../providers/user-provider"
import { motion, AnimatePresence } from "framer-motion"

const navGroups = [
  {
    label: 'Overview',
    items: [
      { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
      { href: "/inventory", label: "Inventory", icon: Box },
    ]
  },
  {
    label: 'Operations',
    items: [
      { href: "/products", label: "Products", icon: Package },
      { href: "/operations/receipts", label: "Receipts", icon: ArrowDownToLine },
      { href: "/operations/deliveries", label: "Deliveries", icon: ArrowUpFromLine },
      { href: "/warehouse-map", label: "Warehouse Map", icon: Map },
      { href: "/warehouses", label: "Warehouses", icon: Warehouse },
      { href: "/move-history", label: "Move History", icon: History },
    ]
  },
  {
    label: 'Intelligence',
    items: [
      { href: "/ai-assistant", label: "AI Assistant", icon: Bot },
      { href: "/reports", label: "AI Reports", icon: FileText },
      { href: "/automation", label: "Automation", icon: Zap, adminOnly: true },
      { href: "/settings", label: "Settings", icon: Settings, adminOnly: true },
    ]
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const { role } = useUser()

  return (
    <aside className="w-64 flex-shrink-0 border-r border-white/[0.05] hidden md:flex flex-col z-20 relative">
      {/* Glass background */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-2xl" />
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-transparent to-transparent pointer-events-none" />

      {/* Logo */}
      <div className="relative h-20 flex items-center px-5 border-b border-emerald-900/30">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <img 
            src="/logo.png" 
            alt="StockPilot Logo" 
            className="w-10 h-10 object-cover rounded-xl border border-amber-500/20 shadow-sm"
          />
          <div>
            <span className="font-semibold text-xl text-amber-50 tracking-tight font-heading">StockPilot</span>
            <div className="text-[10px] text-amber-500/80 font-bold uppercase tracking-widest -mt-0.5">Enterprise</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="relative flex-1 overflow-y-auto py-5 px-3 space-y-6 scrollbar-hide">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter(item => !item.adminOnly || role === 'admin')
          if (visibleItems.length === 0) return null

          return (
            <div key={group.label}>
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-neutral-600 px-3 mb-2">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {visibleItems.map((item, idx) => {
                  const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04, duration: 0.25 }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group relative",
                          isActive
                            ? "bg-emerald-900/40 text-amber-400 border border-amber-500/30 shadow-sm"
                            : "text-emerald-100/60 hover:text-amber-200 hover:bg-emerald-950/40 border border-transparent"
                        )}
                      >
                        {/* Active left bar */}
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-amber-400 rounded-r-full" />
                        )}
                        <item.icon className={cn(
                          "h-4 w-4 flex-shrink-0 transition-colors",
                          isActive
                            ? "text-amber-400"
                            : "text-emerald-400/50 group-hover:text-amber-400/70"
                        )} />
                        <span className="relative z-10">{item.label}</span>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Bottom status bar */}
      <div className="relative p-4 border-t border-white/[0.05]">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/5">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-neutral-300">System Online</p>
            <p className="text-[10px] text-neutral-500">All services running</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
