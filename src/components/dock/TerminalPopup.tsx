'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface TerminalPopupProps {
  onClose: () => void
}

const FULL_TEXT = `Last login: ${new Date().toLocaleString('en-AU')} on ttys001

ernest@macbook ~ % whoami
> Ernest Sacdal
> Full-Stack Developer & AI Engineer
> Sydney, Australia 🌏

ernest@macbook ~ % skills --top
> FastAPI · Next.js · Python · Docker · LLMs

ernest@macbook ~ % status
> Available for project collabs ✓

ernest@macbook ~ % contact
> ernest@ernestsacdal.com
> github.com/ernestsacdal
> linkedin.com/in/ernestsacdal

ernest@macbook ~ % `

export function TerminalPopup({ onClose }: TerminalPopupProps) {
  const [charIndex, setCharIndex] = useState(0)
  const popupRef = useRef<HTMLDivElement>(null)

  // Typewriter
  useEffect(() => {
    if (charIndex >= FULL_TEXT.length) return
    const timer = setTimeout(() => setCharIndex((i) => i + 1), 40)
    return () => clearTimeout(timer)
  }, [charIndex])

  // Click outside
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
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

  const displayedText = FULL_TEXT.slice(0, charIndex)
  const isComplete = charIndex >= FULL_TEXT.length
  const lines = displayedText.split('\n')

  return (
    <motion.div
      ref={popupRef}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        position: 'fixed',
        bottom: 74,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 49,
        width: 'min(360px, calc(100vw - 32px))',
        background: 'rgba(28, 28, 28, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: 16,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', gap: 7 }}>
          {['#FF5F57', '#FFBD2E', '#28C840'].map((color) => (
            <div
              key={color}
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: color,
              }}
            />
          ))}
        </div>
        <span
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: "'SF Mono', 'Fira Code', monospace",
            fontSize: 12,
            color: 'rgba(255,255,255,0.4)',
          }}
        >
          bash — 80×24
        </span>
      </div>

      {/* Terminal body */}
      <div
        style={{
          padding: '14px 16px 16px',
          fontFamily: "'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace",
          fontSize: 12,
          lineHeight: 1.7,
          minHeight: 200,
        }}
      >
        {lines.map((line, i) => {
          let color = 'rgba(255,255,255,0.45)'
          if (/^ernest@/.test(line)) color = '#57FF8E'
          else if (/^>/.test(line)) color = 'rgba(255,255,255,0.75)'

          const isLastLine = i === lines.length - 1
          return (
            <div key={i} style={{ color }}>
              {line}
              {isLastLine && isComplete && (
                <span className="animate-blink" style={{ color: '#57FF8E' }}>
                  █
                </span>
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
