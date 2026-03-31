'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/lib/theme'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatPopupProps {
  onClose: () => void
}

const GREETING: Message = {
  role: 'assistant',
  content: "Hey! I'm Ernest's AI assistant. Ask me anything about his work, skills, or how to get in touch.",
}

export function ChatPopup({ onClose: _onClose }: ChatPopupProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [messages, setMessages] = useState<Message[]>([GREETING])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  async function sendMessage() {
    const text = input.trim()
    if (!text || isLoading) return

    const userMessage: Message = { role: 'user', content: text }
    const next = [...messages, userMessage]
    setMessages(next)
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const glassStyle = {
    background: isDark ? 'rgba(20, 20, 20, 0.92)' : 'rgba(255, 255, 255, 0.92)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 8 }}
      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        position: 'fixed',
        bottom: 74,
        right: 'max(20px, calc(50% - 480px))',
        zIndex: 49,
        width: 320,
        height: 420,
        borderRadius: 22,
        backdropFilter: 'blur(24px) saturate(180%)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        ...glassStyle,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 16px 12px',
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 14,
            color: isDark ? '#F5F5F7' : '#1D1D1F',
            letterSpacing: '-0.02em',
          }}
        >
          Ask Ernest&apos;s AI
        </div>
        <div style={{ fontSize: 11, color: isDark ? '#888' : '#6E6E73', marginTop: 2 }}>
          Powered by Claude
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 12px 4px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          scrollbarWidth: 'none',
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '82%',
                padding: '8px 11px',
                borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                fontSize: 13,
                lineHeight: 1.45,
                background:
                  msg.role === 'user'
                    ? '#0071E3'
                    : isDark
                      ? 'rgba(255,255,255,0.08)'
                      : 'rgba(0,0,0,0.06)',
                color:
                  msg.role === 'user'
                    ? '#fff'
                    : isDark
                      ? 'rgba(255,255,255,0.88)'
                      : '#1D1D1F',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '14px 14px 14px 4px',
                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                display: 'flex',
                gap: 5,
                alignItems: 'center',
              }}
            >
              {[0, 0.2, 0.4].map((delay, i) => (
                <span
                  key={i}
                  className="animate-pulse-dot"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
                    display: 'inline-block',
                    animationDelay: `${delay}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: '10px 12px',
          borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
          flexShrink: 0,
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
          placeholder="Ask anything…"
          style={{
            flex: 1,
            background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
            border: 'none',
            outline: 'none',
            borderRadius: 10,
            padding: '7px 10px',
            fontSize: 13,
            color: isDark ? '#F5F5F7' : '#1D1D1F',
            fontFamily: 'inherit',
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || isLoading}
          style={{
            background: '#0071E3',
            border: 'none',
            borderRadius: 8,
            width: 30,
            height: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            opacity: !input.trim() || isLoading ? 0.4 : 1,
            transition: 'opacity 0.2s',
            flexShrink: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L13 7L7 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M1 7H13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </motion.div>
  )
}
