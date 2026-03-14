'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

type UserContextType = {
  user: User | null
  isLoading: boolean
  role: string
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// Protected routes that require authentication
const PROTECTED_PREFIXES = [
  '/dashboard', '/inventory', '/products', '/operations',
  '/warehouses', '/move-history', '/automation', '/ai-assistant', '/settings'
]

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Fetch the real Supabase session on mount and listen for auth changes
  useEffect(() => {
    const supabase = createClient()

    // Get the initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setIsLoading(false)
    })

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Route protection based on real Supabase auth state
  useEffect(() => {
    if (isLoading) return // Don't redirect while still checking auth

    const isProtectedRoute = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix))

    if (!user && isProtectedRoute) {
      router.push('/login')
    }

    if (user && (pathname === '/login' || pathname === '/signup')) {
      router.push('/dashboard')
    }
  }, [user, isLoading, pathname, router])

  // Derive role from Supabase user metadata
  const role = user?.user_metadata?.role === 'staff' ? 'staff' : 'admin'

  return (
    <UserContext.Provider value={{ user, isLoading, role }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
