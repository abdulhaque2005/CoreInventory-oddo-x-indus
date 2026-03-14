export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050507] flex flex-col justify-center items-center relative overflow-auto py-8">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/15 rounded-full blur-[120px] animate-pulse [animation-delay:1s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo and title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-900/40 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)] mb-4 overflow-hidden p-1">
            <img 
              src="/logo.png" 
              alt="StockPilot Logo" 
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">StockPilot</h1>
          <p className="text-neutral-400 text-sm mt-1.5">AI-Powered Inventory Management</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
          {children}
        </div>

        <p className="text-center text-xs text-neutral-600 mt-6">
          StockPilot WMS &copy; {new Date().getFullYear()} &mdash; All rights reserved
        </p>
      </div>
    </div>
  )
}
