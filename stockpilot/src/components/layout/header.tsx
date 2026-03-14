'use client'

import { useUser } from "../providers/user-provider"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, User, ChevronRight } from "lucide-react"
import { usePathname } from "next/navigation"

export function Header() {
  const { user, role } = useUser()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Build breadcrumb from pathname
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs = segments.map((seg, i) => ({
    label: seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    href: '/' + segments.slice(0, i + 1).join('/')
  }))

  const displayName = user?.user_metadata?.full_name || user?.email || 'User'
  const displayRole = role === 'staff' ? 'Staff' : 'Admin'

  return (
    <header className="h-16 flex-shrink-0 border-b border-white/5 bg-black/40 backdrop-blur-2xl flex items-center justify-between px-6 z-20">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-neutral-600" />}
            <span className={i === breadcrumbs.length - 1 ? 'text-white font-medium' : 'text-neutral-500 hover:text-neutral-300 cursor-pointer'}>
              {crumb.label}
            </span>
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-right hidden sm:block">
          <p className="font-medium text-neutral-200">{displayName}</p>
          <p className="text-xs text-neutral-400 capitalize">{displayRole}</p>
        </div>

        <Popover>
          <PopoverTrigger className="inline-flex items-center justify-center whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 hover:ring-2 hover:ring-emerald-500/50 relative h-10 w-10 rounded-full bg-white/5 border border-white/10 shadow-lg">
            <Avatar className="h-10 w-10 border border-neutral-700">
              <AvatarFallback className="bg-indigo-900 text-indigo-200">
                {displayName?.charAt(0).toUpperCase() || <User className="h-5 w-5" />}
              </AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2 bg-black/80 backdrop-blur-xl border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] rounded-xl" align="end">
            <div className="px-2 py-1.5 mb-1">
              <p className="text-sm font-semibold text-white">{displayName}</p>
              <p className="text-xs text-neutral-400 capitalize mt-0.5">{displayRole}</p>
            </div>
            <hr className="my-1 border-white/10" />
            <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  )
}
