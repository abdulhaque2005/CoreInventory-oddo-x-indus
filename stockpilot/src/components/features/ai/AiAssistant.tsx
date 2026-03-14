'use client'

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, Send, User, Bot, AlertTriangle, CheckCircle2, Terminal } from "lucide-react"
import { useAppStore } from "@/lib/store"

export function AiAssistant() {
  const { aiMessages, addAiMessage } = useAppStore()
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showCommandConfirm, setShowCommandConfirm] = useState(false)
  const [pendingCommand, setPendingCommand] = useState<any>(null)
  
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [aiMessages])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMsg = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input,
      timestamp: new Date()
    }

    addAiMessage(userMsg)
    setInput("")
    setIsTyping(true)

    try {
      // 1. Check for command intent first
      const cmdResponse = await fetch('/api/ai/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input })
      })
      const cmdData = await cmdResponse.json()

      if (cmdData.intent && cmdData.intent !== 'UNKNOWN') {
        setPendingCommand(cmdData)
        setShowCommandConfirm(true)
        
        addAiMessage({
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: cmdData.confirmation_message || `Detected ${cmdData.intent} intent for ${cmdData.product}. Should I proceed?`,
          timestamp: new Date()
        })
      } else {
        // 2. Regular RAG Chat — send live inventory context
        const stock = useAppStore.getState().stock
        const receipts = useAppStore.getState().receipts
        const deliveries = useAppStore.getState().deliveries
        const moveHistory = useAppStore.getState().moveHistory

        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: aiMessages.concat(userMsg).map(m => ({ role: m.role, content: m.content })),
            inventoryContext: {
              stock: stock.map(s => ({ product: s.product, onHand: s.onHand, reserved: s.reserved, cost: s.perUnitCost })),
              pendingReceipts: receipts.filter(r => r.status !== 'Done').map(r => ({ ref: r.reference, from: r.from, products: r.products.map(p => `${p.product} x${p.quantity}`).join(', ') })),
              pendingDeliveries: deliveries.filter(d => d.status !== 'Done').map(d => ({ ref: d.reference, to: d.to, products: d.products.map(p => `${p.product} x${p.quantity}`).join(', ') })),
              recentMoves: moveHistory.slice(0, 5).map(m => ({ type: m.type, ref: m.reference, from: m.from, to: m.to, qty: m.quantity, date: m.date }))
            }
          })
        })

        const data = await response.json()
        if (data.error) throw new Error(data.error)

        addAiMessage({
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.content,
          timestamp: new Date()
        })
      }
    } catch (error) {
      console.error('Chat Error:', error)
      addAiMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Error: My neural link is temporarily disrupted. Please retry.",
        timestamp: new Date()
      })
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="enterprise-card rounded-2xl flex flex-col h-[600px] overflow-hidden relative">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-amber-400">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-200 text-xs tracking-widest uppercase">StockPilot Intelligence</h3>
            <p className="text-[10px] text-neutral-500 font-mono flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <div className="text-[9px] text-neutral-600 font-mono tracking-widest">LATENCY: 14MS</div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-premium"
      >
        {aiMessages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-40 text-center p-8">
            <Bot className="w-10 h-10 mb-4 text-neutral-500" />
            <p className="text-xs font-mono text-neutral-500">
              I am your AI Terminal. Ask me about stock levels, low inventory, or movement history.
            </p>
          </div>
        )}

        {aiMessages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`p-1.5 rounded-lg flex-shrink-0 ${msg.role === 'user' ? 'bg-emerald-500/10 text-amber-400' : 'bg-neutral-800 text-neutral-400'}`}>
              {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>
            <div className={`max-w-[85%] p-3.5 rounded-xl text-[12px] leading-relaxed font-mono ${
              msg.role === 'user' 
              ? 'bg-emerald-500/10 text-indigo-100 border border-emerald-500/20' 
              : 'bg-white/[0.02] text-neutral-300 border border-white/5'
            }`}>
              {msg.content}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-[10px] text-neutral-500 font-mono pl-12"
          >
            <span className="animate-pulse">●</span>
            <span className="animate-pulse [animation-delay:0.2s]">●</span>
            <span className="animate-pulse [animation-delay:0.4s]">●</span>
            Processing...
          </motion.div>
        )}
      </div>

      {/* Command Confirmation HUD Overlay */}
      <AnimatePresence>
        {showCommandConfirm && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute bottom-20 left-4 right-4 bg-[#0a0a0a] border border-emerald-500/30 rounded-xl p-4 shadow-2xl z-20"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-1.5 rounded bg-emerald-500/10 text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-semibold text-neutral-100 uppercase tracking-widest">Review Command</h4>
            </div>
            <p className="text-[11px] text-neutral-400 mb-4 font-mono leading-relaxed">
              The AI has proposed an inventory operation. Please confirm execution.
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowCommandConfirm(false)}
                className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-lg text-[10px] font-semibold transition-colors uppercase tracking-widest"
              >
                Abort
              </button>
              <button 
                onClick={() => {
                   setShowCommandConfirm(false)
                   // TODO: logic for creating actual receipt/delivery
                }}
                className="flex-1 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-semibold transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-3 h-3" />
                Proceed
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="p-4 bg-white/[0.01] border-t border-white/5 flex items-center gap-3">
        <div className="flex-1 relative">
          <Terminal className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type command..."
            className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-[12px] text-neutral-200 focus:outline-none focus:border-emerald-500/50 transition-colors font-mono placeholder:text-neutral-600"
          />
        </div>
        <button 
          onClick={handleSend}
          className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors disabled:opacity-50"
          disabled={!input.trim() || isTyping}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
