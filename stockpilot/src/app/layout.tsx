import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { UserProvider } from "@/components/providers/user-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "StockPilot | AI-Powered Inventory",
  description: "Autonomous, AI-enhanced inventory tracking and operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased bg-[#030305] text-neutral-50 h-screen overflow-hidden font-sans selection:bg-emerald-500/30 selection:text-indigo-200`}
      >
        {/* ── Multi-layer background ── */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[#030305]" />
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-emerald-600/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[400px] bg-violet-600/6 rounded-full blur-[100px]" />
          <div className="absolute top-[30%] left-[-5%] w-[300px] h-[300px] bg-indigo-800/5 rounded-full blur-[80px]" />
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: 'linear-gradient(rgba(16,185,129,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.4) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }}
          />
        </div>
        <UserProvider>
          {children}
          <Toaster
            theme="dark"
            className="!font-sans"
            toastOptions={{
              style: {
                background: 'rgba(15,15,20,0.95)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px)',
                color: '#f5f5f5'
              }
            }}
          />
        </UserProvider>
      </body>
    </html>
  );
}
