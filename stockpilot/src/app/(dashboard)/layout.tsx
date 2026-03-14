import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { PageTransition } from "@/components/layout/page-transition"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-transparent text-neutral-50 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  )
}
