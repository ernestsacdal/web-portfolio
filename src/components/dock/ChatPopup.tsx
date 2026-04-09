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
  triggerRef?: React.RefObject<HTMLButtonElement | null>
  dockRef?: React.RefObject<HTMLDivElement | null>
}

const GREETINGS = [
  "Hey, I'm Mikhai — Ernest's AI. Ask me anything about his work, stack, or availability.",
  "Mikhai here. Ernest built me so he doesn't have to answer the same questions twice. What's up?",
  "Hey — I'm Mikhai. I know everything about Ernest's work. Almost everything. Ask away.",
  "Mikhai online. Ask me about Ernest's projects, stack, or how to get in touch.",
  "Hey there. I'm Mikhai — Ernest's AI assistant. Less awkward than emailing cold. What do you want to know?",
]

const MOODS = [
  'caffeinated ☕',
  'in flow state ⚡',
  'debugging something 🐛',
  'just deployed 🚀',
  'on a coffee break ☕',
  'shipping features 📦',
  'reading the docs 📖',
]

const POSTSCRIPTS = [
  '// ernest approved this message',
  '// not sponsored',
  '/* this took 3 deploys */',
  '// shipping since 2021',
  "/* don't ask about the bug */",
]

const IDLE_MESSAGES = [
  "still there? I don't have legs so I can't leave 👀",
  '// waiting for input...',
  'ping? — just checking the connection',
  "no pressure, I'm just an AI with nothing else to do",
]

const EASTER_EGGS: Record<string, string> = {
  'sudo': "nice try. you don't have root access here. // nobody does",
  'rm -rf': "whoa. I'm not doing that. Ernest still needs me.",
  'hello world': 'hey, a developer. Ernest will like you. // classic first program',
  'hire ernest': "great taste. ernest@ernestsacdal.com — he's waiting. // not literally, he has a life",
}

const SUGGESTED_CHIPS = [
  "What has Ernest built?",
  "What's his tech stack?",
  "Is he available for work?",
]

const STORAGE_KEY = 'mikhai-chat-history'

const POPUP_WIDTH = 320
const POPUP_HEIGHT = 420

function stripPostscript(content: string): string {
  const lines = content.split('\n')
  const filtered = lines.filter(line => {
    const trimmed = line.trim()
    return !trimmed.startsWith('//') && !trimmed.startsWith('/*')
  })
  return filtered.join('\n').trimEnd()
}

function parseMessage(content: string): { main: string; postscript: string | null } {
  const idx = content.lastIndexOf('\n\n')
  if (idx === -1) return { main: content, postscript: null }
  const after = content.slice(idx + 2).trim()
  if (after.startsWith('//') || after.startsWith('/*')) {
    return { main: content.slice(0, idx), postscript: after }
  }
  return { main: content, postscript: null }
}

export function ChatPopup({ onClose, triggerRef, dockRef }: ChatPopupProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      if (stored) return JSON.parse(stored) as Message[]
    } catch {}
    return [{ role: 'assistant', content: GREETINGS[Math.floor(Math.random() * GREETINGS.length)] }]
  })
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [pos, setPos] = useState<{ bottom: number; left: number } | null>(null)
  const [mood] = useState(() => MOODS[Math.floor(Math.random() * MOODS.length)])
  const [showChips, setShowChips] = useState(() => {
    try {
      return !sessionStorage.getItem(STORAGE_KEY)
    } catch {
      return true
    }
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const assistantCountRef = useRef(0)
  const idleFiredRef = useRef(false)

  function computePos() {
    if (!triggerRef?.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const gap = 8
    const bottom = window.innerHeight - rect.top + gap
    const idealLeft = rect.left + rect.width / 2 - POPUP_WIDTH / 2
    const left = Math.min(Math.max(idealLeft, 12), window.innerWidth - POPUP_WIDTH - 12)
    setPos({ bottom, left })
  }

  useEffect(() => {
    computePos()
    window.addEventListener('resize', computePos)
    return () => window.removeEventListener('resize', computePos)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch {}
  }, [messages])

  // Click outside
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      const target = e.target as Node
      if (dockRef?.current?.contains(target)) return
      if (popupRef.current && !popupRef.current.contains(target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [onClose])

  // Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Idle message
  useEffect(() => {
    if (isLoading) return
    const timer = setTimeout(() => {
      if (!idleFiredRef.current) {
        const idleMsg = IDLE_MESSAGES[Math.floor(Math.random() * IDLE_MESSAGES.length)]
        setMessages(prev => [...prev, { role: 'assistant', content: idleMsg }])
        idleFiredRef.current = true
      }
    }, 30000)
    return () => clearTimeout(timer)
  }, [messages, isLoading])

  async function sendMessage(overrideText?: string) {
    const text = (overrideText ?? input).trim()
    if (!text || isLoading) return

    const userMessage: Message = { role: 'user', content: text }
    setShowChips(false)
    idleFiredRef.current = false

    // Easter eggs
    const easterReply = EASTER_EGGS[text.toLowerCase()]
    if (easterReply !== undefined) {
      setMessages(prev => [...prev, userMessage, { role: 'assistant', content: easterReply }])
      setInput('')
      return
    }

    const next = [...messages, userMessage]
    setMessages([...next, { role: 'assistant', content: '' }])
    setInput('')
    setIsLoading(true)

    // Strip postscripts from messages sent to API
    const trimmed = next.slice(-20).map(m =>
      m.role === 'assistant' ? { ...m, content: stripPostscript(m.content) } : m
    )

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: trimmed }),
      })

      if (!res.ok || !res.body) throw new Error('API error')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        fullText += chunk
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: fullText }
          return updated
        })
      }

      // Postscript every 3rd assistant response
      assistantCountRef.current += 1
      if (assistantCountRef.current % 3 === 0) {
        const postscript = POSTSCRIPTS[(Math.floor(assistantCountRef.current / 3) - 1) % POSTSCRIPTS.length]
        const finalContent = fullText + '\n\n' + postscript
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: finalContent }
          return updated
        })
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: "Mikhai is having a moment. Try again shortly. // it's not you, it's the server",
        }
        return updated
      })
    } finally {
      setIsLoading(false)
    }
  }

  const glassStyle = {
    background: isDark ? 'rgba(20, 20, 20, 0.85)' : 'rgba(255, 255, 255, 0.85)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
  }

  const posStyle = pos
    ? { bottom: pos.bottom, left: pos.left }
    : { bottom: 74, right: 'max(20px, calc(50% - 480px))' }

  const lastMsg = messages[messages.length - 1]
  const showDots = isLoading && lastMsg?.role === 'assistant' && lastMsg.content === ''

  return (
    <>
      <style>{`
        @keyframes mikhaiPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(52, 199, 89, 0.5); }
          50% { opacity: 0.75; box-shadow: 0 0 0 4px rgba(52, 199, 89, 0); }
        }
        .mikhai-dot {
          animation: mikhaiPulse 2s ease-in-out infinite;
        }
      `}</style>
      <motion.div
        ref={popupRef}
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          position: 'fixed',
          ...posStyle,
          zIndex: 49,
          width: POPUP_WIDTH,
          height: POPUP_HEIGHT,
          borderRadius: 22,
          backdropFilter: 'blur(20px) saturate(180%)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
          ...glassStyle,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '10px 16px',
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span
              style={{
                fontWeight: 600,
                fontSize: 14,
                color: isDark ? '#F5F5F7' : '#1D1D1F',
                letterSpacing: '-0.02em',
              }}
            >
              Mikhai
            </span>
            <span style={{ fontSize: 10, color: isDark ? '#666' : '#999', fontStyle: 'italic' }}>
              {mood}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span
              className="mikhai-dot"
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#34C759',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 11, color: isDark ? '#888' : '#6E6E73' }}>
              online
            </span>
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
          {messages.map((msg, i) => {
            const { main, postscript } = msg.role === 'assistant'
              ? parseMessage(msg.content)
              : { main: msg.content, postscript: null }

            return (
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
                  {main}
                  {postscript && (
                    <span
                      style={{
                        display: 'block',
                        marginTop: 6,
                        fontSize: 11,
                        color: isDark ? '#555' : '#aaa',
                        fontStyle: 'italic',
                        fontFamily: 'monospace',
                      }}
                    >
                      {postscript}
                    </span>
                  )}
                </div>
              </div>
            )
          })}

          {showDots && (
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

        {/* Suggested chips */}
        {showChips && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              padding: '0 12px 8px',
              flexShrink: 0,
            }}
          >
            {SUGGESTED_CHIPS.map(chip => (
              <button
                key={chip}
                onClick={() => sendMessage(chip)}
                style={{
                  fontSize: 11,
                  padding: '4px 10px',
                  borderRadius: 12,
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}`,
                  background: 'transparent',
                  color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        )}

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
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            style={{
              background: '#0071E3',
              border: 'none',
              borderRadius: '50%',
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
    </>
  )
}
