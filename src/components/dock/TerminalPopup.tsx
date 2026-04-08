'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface TerminalPopupProps {
  onClose: () => void
  triggerRef?: React.RefObject<HTMLButtonElement | null>
}

type TLine =
  | { k: 'text'; text: string; color: string }
  | { k: 'link'; label: string; href: string }
  | { k: 'blank' }

interface IpData {
  city: string
  country: string
  countryCode: string
  timezone: string
  lat: number
  lon: number
}

interface EnvData {
  os: string
  browser: string
  version: string
  mobile: boolean
}

const DIM = 'rgba(255,255,255,0.45)'
const BRIGHT = '#a0a0a0'
const GREEN = '#57FF8E'

const SYD_LAT = -33.8688
const SYD_LON = 151.2093

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

function formatTime(tz: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date())
}

function getEnvData(): EnvData {
  const ua = navigator.userAgent
  const mobile = /Mobi|Android|iPhone|iPad/i.test(ua)

  let os = 'Unknown'
  if (/iPhone|iPad/i.test(ua)) os = 'iOS'
  else if (/Android/i.test(ua)) os = 'Android'
  else if (/Mac OS X/i.test(ua)) os = 'macOS'
  else if (/Windows/i.test(ua)) os = 'Windows'
  else if (/Linux/i.test(ua)) os = 'Linux'

  // Supplement with userAgentData platform when available
  if (typeof navigator !== 'undefined' && 'userAgentData' in navigator) {
    const uad = navigator.userAgentData as { platform?: string; mobile?: boolean }
    if (uad.platform === 'macOS') os = 'macOS'
    else if (uad.platform === 'Windows') os = 'Windows'
    else if (uad.platform === 'Linux' && os !== 'Android') os = 'Linux'
  }

  let browser = 'Unknown'
  let version = ''
  if (/Edg\//i.test(ua)) {
    browser = 'Edge'
    version = ua.match(/Edg\/([\d]+)/i)?.[1] ?? ''
  } else if (/Firefox\//i.test(ua)) {
    browser = 'Firefox'
    version = ua.match(/Firefox\/([\d]+)/i)?.[1] ?? ''
  } else if (/Chrome\//i.test(ua)) {
    browser = 'Chrome'
    version = ua.match(/Chrome\/([\d]+)/i)?.[1] ?? ''
  } else if (/Version\//i.test(ua) && /Safari\//i.test(ua)) {
    browser = 'Safari'
    version = ua.match(/Version\/([\d]+)/i)?.[1] ?? ''
  }

  return { os, browser, version, mobile }
}

function getVerdict(os: string, browser: string, mobile: boolean): string {
  if (os === 'macOS' && browser === 'Safari') return 'full apple ecosystem — committed'
  if (os === 'macOS' && browser === 'Chrome') return 'full apple setup but still on chrome — interesting choice'
  if (os === 'macOS' && browser === 'Firefox') return 'mac and firefox — you know what you want'
  if (os === 'Windows' && browser === 'Edge') return "edge in 2026 — you were assigned this laptop weren't you"
  if (os === 'Windows' && browser === 'Chrome') return 'windows chrome — the default human'
  if (os === 'Windows' && browser === 'Firefox') return 'windows firefox — quietly based'
  if (os === 'Linux' && browser === 'Firefox' && !mobile) return 'desktop linux firefox — the most dangerous person in this conversation'
  if (os === 'Linux' && browser === 'Chrome') return 'linux chrome — close enough to dangerous'
  if (os === 'iOS' && browser === 'Safari' && mobile) return 'full apple on the go — come back on desktop'
  if (os === 'Android' && browser === 'Chrome' && mobile) return 'android chrome mobile — the default human'
  return `${os.toLowerCase()} ${browser.toLowerCase()} — uncharted territory`
}

function getDistancePhrase(ip: IpData): string {
  const km = haversine(ip.lat, ip.lon, SYD_LAT, SYD_LON)
  const isSydney = ip.city.toLowerCase().includes('sydney') && ip.countryCode === 'AU'
  if (isSydney) return 'same city — buy me a coffee instead'

  const sydTZ = 'Australia/Sydney'
  const sameTZ = ip.timezone === sydTZ
  if (ip.countryCode === 'AU' && sameTZ) return 'different city, same timezone — easy collab'

  if (km < 1000) return 'not that far — internet makes it nothing'
  if (km < 5000) return 'distance is just latency'
  if (km < 10000) return 'half a world away — still here though'
  return 'as far as it gets — and you still found this'
}

export function TerminalPopup({ onClose, triggerRef }: TerminalPopupProps) {
  const [lines, setLines] = useState<TLine[]>([])
  const [typingText, setTypingText] = useState('')
  const [showTyping, setShowTyping] = useState(false)
  const [done, setDone] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [lines, typingText])

  // Click outside
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      const target = e.target as Node
      if (triggerRef?.current?.contains(target)) return
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

  // Sequence engine
  useEffect(() => {
    // Local flag — each effect invocation owns its own boolean so StrictMode
    // double-invocation cannot share/reset a ref between the two runs.
    let cancelled = false

    const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

    function typeCmd(cmd: string): Promise<void> {
      return new Promise<void>((resolve) => {
        setShowTyping(true)
        setTypingText('')
        let i = 0
        function next() {
          if (cancelled) return
          i++
          setTypingText(cmd.slice(0, i))
          if (i >= cmd.length) {
            setShowTyping(false)
            setLines((prev) => [...prev, { k: 'text', text: cmd, color: GREEN }])
            resolve()
            return
          }
          setTimeout(next, 60 + Math.random() * 40 - 20)
        }
        setTimeout(next, 60 + Math.random() * 40 - 20)
      })
    }

    function addLines(newLines: TLine[]) {
      setLines((prev) => [...prev, ...newLines])
    }

async function fetchIp(): Promise<IpData | null> {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 3000)
      try {
        const res = await fetch('/api/geoip', { signal: controller.signal })
        const data = await res.json() as IpData & { status: string }
        if (data.status !== 'success') return null
        return data
      } catch {
        return null
      } finally {
        clearTimeout(timeout)
      }
    }

    async function main() {
      const [ip, env] = await Promise.all([fetchIp(), Promise.resolve(getEnvData())])
      if (cancelled) return

      // Login line
      addLines([
        {
          k: 'text',
          text: `Last login: ${new Date().toLocaleString('en-AU')} on ttys001`,
          color: DIM,
        },
        { k: 'blank' },
      ])
      await delay(300)
      if (cancelled) return

      // ── Command 1: ping visitor ──
      await typeCmd('ernest@dev ~ % ping visitor')
      if (cancelled) return

      const visitorCity = ip ? ip.city : 'Unknown'
      const visitorCountry = ip ? ip.countryCode : ''
      const visitorTZ = ip?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
      const visitorTime = formatTime(visitorTZ)
      const sydneyTime = formatTime('Australia/Sydney')

      const pingLines: TLine[] = [
        {
          k: 'text',
          text: `> ${visitorCity}${visitorCountry ? `, ${visitorCountry}` : ''}  ·  ${visitorTime}  -- you`,
          color: BRIGHT,
        },
        { k: 'text', text: `> Sydney, AU  ·  ${sydneyTime}  -- me`, color: BRIGHT },
      ]
      if (ip) {
        pingLines.push({ k: 'text', text: `> ${getDistancePhrase(ip)}`, color: BRIGHT })
      }
      pingLines.push({ k: 'blank' })
      addLines(pingLines)
      await delay(900)
      if (cancelled) return

      // ── Command 2: env --visitor ──
      await typeCmd('ernest@dev ~ % env --visitor')
      if (cancelled) return

      const deviceType = env.mobile ? 'Mobile' : 'Desktop'
      const verdict = getVerdict(env.os, env.browser, env.mobile)
      addLines([
        { k: 'text', text: `> OS: ${env.os}`, color: BRIGHT },
        { k: 'text', text: `> Browser: ${env.browser}${env.version ? ` ${env.version}` : ''}`, color: BRIGHT },
        { k: 'text', text: `> Device: ${deviceType}`, color: BRIGHT },
        { k: 'text', text: `> ${verdict}`, color: BRIGHT },
        { k: 'blank' },
      ])
      await delay(900)
      if (cancelled) return

      // ── Command 3: ./connect.sh ──
      await typeCmd('ernest@dev ~ % ./connect.sh')
      if (cancelled) return

      addLines([
        { k: 'text', text: "> if you got this far — let's talk", color: BRIGHT },
        { k: 'link', label: '> ernest@ernestsacdal.com', href: 'mailto:ernest@ernestsacdal.com' },
        { k: 'link', label: '> linkedin.com/in/ernestsacdal', href: 'https://linkedin.com/in/ernestsacdal' },
        { k: 'blank' },
      ])
      // sequence done — show idle prompt with blinking cursor
      setShowTyping(true)
      setTypingText('ernest@dev ~ % ')
      setDone(true)
    }

    main()

    return () => {
      cancelled = true
    }
  }, [])

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
        width: 360,
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
        ref={bodyRef}
        style={{
          padding: '14px 16px 16px',
          fontFamily: "'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace",
          fontSize: 12,
          lineHeight: 1.7,
          height: 240,
          overflowY: 'auto',
        }}
      >
        {lines.map((line, i) => {
          if (line.k === 'blank') return <div key={i} style={{ height: '1.7em' }} />
          if (line.k === 'link')
            return (
              <div key={i}>
                <a
                  href={line.href}
                  target={line.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  style={{ color: BRIGHT, textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                >
                  {line.label}
                </a>
              </div>
            )
          // Split prompt (green) from command text (white) for command lines
          if (line.color === GREEN) {
            const cut = line.text.indexOf('% ')
            if (cut !== -1) {
              return (
                <div key={i}>
                  <span style={{ color: GREEN }}>{line.text.slice(0, cut + 2)}</span>
                  <span style={{ color: '#ffffff' }}>{line.text.slice(cut + 2)}</span>
                </div>
              )
            }
          }
          return (
            <div key={i} style={{ color: line.color }}>
              {line.text}
            </div>
          )
        })}

        {showTyping && (() => {
          const cut = typingText.indexOf('% ')
          if (cut !== -1) {
            return (
              <div>
                <span style={{ color: GREEN }}>{typingText.slice(0, cut + 2)}</span>
                <span style={{ color: '#ffffff' }}>
                  {typingText.slice(cut + 2)}
                  <span className={done ? 'animate-blink' : undefined}>█</span>
                </span>
              </div>
            )
          }
          return (
            <div style={{ color: GREEN }}>
              {typingText}
              <span className={done ? 'animate-blink' : undefined}>█</span>
            </div>
          )
        })()}
      </div>
    </motion.div>
  )
}
