'use client'

import Link from 'next/link'
import { signup } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    const result = await signup(formData)
    
    if (result?.error) {
      toast.error(result.error)
      setIsLoading(false)
    }
  }

  async function handleGoogleSignup() {
    setGoogleLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        toast.error(error.message)
        setGoogleLoading(false)
      }
    } catch {
      toast.error('Google sign-up failed. Please try again.')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Heading */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Create your account</h2>
        <p className="text-neutral-500 text-sm mt-1">Join StockPilot to automate your warehouse with AI.</p>
      </div>

      {/* Google Auth Button */}
      <button
        type="button"
        onClick={handleGoogleSignup}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all text-sm font-medium text-white disabled:opacity-50"
      >
        {googleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
        )}
        {googleLoading ? 'Connecting...' : 'Sign up with Google'}
      </button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/5" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-[#0a0a0a] text-neutral-600">or continue with email</span>
        </div>
      </div>

      {/* Form */}
      <form className="space-y-3" action={handleSubmit}>
        <div>
          <Label htmlFor="full_name" className="text-neutral-400 text-xs uppercase tracking-wider mb-1.5 block font-medium">Full Name</Label>
          <Input id="full_name" name="full_name" type="text" required placeholder="e.g. Ahmed Khan" className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500/50 h-10 rounded-xl" />
        </div>

        <div>
          <Label htmlFor="email" className="text-neutral-400 text-xs uppercase tracking-wider mb-1.5 block font-medium">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500/50 h-10 rounded-xl" />
        </div>

        <div>
          <Label htmlFor="password" className="text-neutral-400 text-xs uppercase tracking-wider mb-1.5 block font-medium">Password</Label>
          <Input id="password" name="password" type="password" autoComplete="new-password" required placeholder="Min. 6 characters" className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500/50 h-10 rounded-xl" />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-11 rounded-xl font-semibold text-sm shadow-[0_0_24px_rgba(16,185,129,0.35)] hover:shadow-[0_0_35px_rgba(16,185,129,0.55)] transition-all duration-300 mt-1"
        >
          {isLoading ? (
            <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</span>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>

      {/* Terms + login link */}
      <p className="text-[10px] text-neutral-600 text-center leading-relaxed">
        By creating an account, you agree to StockPilot&apos;s Terms of Service and Privacy Policy.
      </p>
      
      <div className="text-sm text-center">
        <Link href="/login" className="font-medium text-emerald-500 hover:text-emerald-400">
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  )
}
