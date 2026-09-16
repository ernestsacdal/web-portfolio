'use client'

import { useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { House, LayoutGrid, Briefcase, FileText, Terminal, MessageCircle, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { TerminalPopup } from './TerminalPopup'
import { ChatPopup } from './ChatPopup'

const NAV_LINKS = [
  { label: 'Home', id: 'home', icon: House },
  { label: 'Bento', id: 'bento', icon: LayoutGrid },
  { label: 'Projects', id: 'projects', icon: Briefcase },
  { label: 'Blog', id: 'blog', icon: FileText },
]

function useNavHandler() {
  const pathname = usePathname()
  const router = useRouter()
  return (id: string) => {
    if (pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      router.push(`/#${id}`)
    }
  }
}

export function Dock() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const navigate = useNavHandler()

  const [terminalOpen, setTerminalOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const terminalBtnRef = useRef<HTMLButtonElement>(null)
  const chatBtnRef = useRef<HTMLButtonElement>(null)
  const dockRef = useRef<HTMLDivElement>(null)

  const dividerStyle: React.CSSProperties = {
    width: 1,
    height: 20,
    background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
    flexShrink: 0,
  }

  const btnBase: React.CSSProperties = {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    borderRadius: 8,
    padding: '6px 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.65)',
  }

  return (
    <>
      <AnimatePresence>
        {terminalOpen && (
          <TerminalPopup onClose={() => setTerminalOpen(false)} triggerRef={terminalBtnRef} dockRef={dockRef} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {chatOpen && <ChatPopup onClose={() => setChatOpen(false)} triggerRef={chatBtnRef} dockRef={dockRef} />}
      </AnimatePresence>

      <div
        ref={dockRef}
        className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
        style={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '10px 24px',
          borderRadius: 50,
        }}
      >
        {/* Nav links — hidden on mobile */}
        {NAV_LINKS.map(({ label, id, icon: Icon }) => (
          <button
            key={id}
            onClick={() => navigate(id)}
            title={label}
            className="hidden sm:flex"
            style={{ ...btnBase, padding: '6px 8px' }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'
              el.style.color = isDark ? '#F5F5F7' : '#1D1D1F'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.background = 'transparent'
              el.style.color = isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.65)'
            }}
          >
            <Icon size={18} />
          </button>
        ))}

        <div style={{ ...dividerStyle }} className="hidden sm:block" />

        {/* Theme toggle — the switch animation expands from this button */}
        <motion.button
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect()
            toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
          }}
          whileTap={{ scale: 0.88 }}
          style={{ ...btnBase, transition: 'background 0.2s ease, color 0.2s ease' }}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
          }}
        >
          {/* Sun sets one way, moon rises from the other; fixed box so the dock never reflows */}
          <span style={{ position: 'relative', width: 18, height: 18, display: 'block' }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 26 }}
                style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.button>

        {/* Terminal */}
        <button
          ref={terminalBtnRef}
          onClick={() => { setTerminalOpen((v) => !v); setChatOpen(false) }}
          style={{
            ...btnBase,
            background: terminalOpen
              ? isDark
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(0,0,0,0.07)'
              : 'transparent',
          }}
          title="Open terminal"
          onMouseEnter={(e) => {
            if (!terminalOpen)
              e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'
          }}
          onMouseLeave={(e) => {
            if (!terminalOpen) e.currentTarget.style.background = 'transparent'
          }}
        >
          <Terminal size={18} />
        </button>

        {/* Chat */}
        <button
          ref={chatBtnRef}
          onClick={() => { setChatOpen((v) => !v); setTerminalOpen(false) }}
          style={{
            ...btnBase,
            background: chatOpen
              ? isDark
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(0,0,0,0.07)'
              : 'transparent',
          }}
          title="Chat with Ernest's AI"
          onMouseEnter={(e) => {
            if (!chatOpen)
              e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'
          }}
          onMouseLeave={(e) => {
            if (!chatOpen) e.currentTarget.style.background = 'transparent'
          }}
        >
          <MessageCircle size={18} />
        </button>
      </div>
    </>
  )
}
