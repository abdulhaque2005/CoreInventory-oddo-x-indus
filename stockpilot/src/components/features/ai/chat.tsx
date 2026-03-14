'use client'

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am your AI Copilot. I can help predict demand, alert you of low stock, or summarize daily operations. What can I help you with?'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      })

      const data = await res.json()
      if (data.content) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: data.content }])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[600px] border border-white/10 bg-black/40 shadow-[0_4px_24px_rgba(0,0,0,0.2)] backdrop-blur-2xl rounded-2xl overflow-hidden relative">
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-white/5 border border-white/10'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-amber-400" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-emerald-500 text-white rounded-tr-[4px] shadow-[0_4px_15px_rgba(16,185,129,0.25)]' 
                : 'bg-white/5 text-neutral-200 border border-white/10 rounded-tl-[4px] backdrop-blur-md'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-amber-400 animate-pulse" />
            </div>
            <div className="bg-neutral-800 border border-neutral-700 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
              <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/10 bg-black/60 backdrop-blur-md">
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
          <button onClick={() => setInput("Show me low stock items")} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-neutral-300 hover:bg-white/10 hover:text-white transition-colors">
            Show me low stock items
          </button>
          <button onClick={() => setInput("Forecast demand for the next month")} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-neutral-300 hover:bg-white/10 hover:text-white transition-colors">
            Forecast demand
          </button>
          <button onClick={() => setInput("Are there any incoming receipts?")} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-neutral-300 hover:bg-white/10 hover:text-white transition-colors">
            Incoming receipts?
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your inventory..."
              className="w-full bg-white/5 border border-white/10 text-neutral-100 placeholder:text-neutral-500 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500/50 transition-all hover:bg-white/10 shadow-inner"
              disabled={isLoading}
            />
            <Sparkles className="absolute right-3 top-3.5 w-5 h-5 text-amber-500/50" />
          </div>
          <Button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl px-4 py-3 h-auto shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
