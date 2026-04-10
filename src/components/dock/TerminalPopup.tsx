'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface TerminalPopupProps {
  onClose: () => void
  triggerRef?: React.RefObject<HTMLButtonElement | null>
  dockRef?: React.RefObject<HTMLDivElement | null>
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

const PROMPT = 'mik@dev ~ % '

const TERMINAL_WIDTH = 360

export function TerminalPopup({ onClose, triggerRef, dockRef }: TerminalPopupProps) {
  const [lines, setLines] = useState<TLine[]>([])
  const [typingText, setTypingText] = useState('')
  const [showTyping, setShowTyping] = useState(false)
  const [done, setDone] = useState(false)
  const [inputText, setInputText] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [pos, setPos] = useState<{ bottom: number; left: number } | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const hiddenInputRef = useRef<HTMLInputElement>(null)
  const projectsCacheRef = useRef<string[] | null>(null)
  const hintDismissedRef = useRef(false)
  const processingRef = useRef(false)
  const inputRef = useRef('')
  const skipRef = useRef(false)
  const historyRef = useRef<string[]>(['ping visitor', 'env --visitor', './connect.sh'])
  const historyIndexRef = useRef(-1)
  const savedInputRef = useRef('')

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [lines, typingText, inputText])

  // Anchor to trigger button
  useEffect(() => {
    function computePos() {
      if (!triggerRef?.current) return
      const rect = triggerRef.current.getBoundingClientRect()
      const bottom = window.innerHeight - rect.top + 8
      const idealLeft = rect.left + rect.width / 2 - TERMINAL_WIDTH / 2
      const left = Math.min(Math.max(idealLeft, 12), window.innerWidth - TERMINAL_WIDTH - 12)
      setPos({ bottom, left })
    }
    computePos()
    window.addEventListener('resize', computePos)
    return () => window.removeEventListener('resize', computePos)
  }, [])

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

  // Hint line — fade in after 2s once auto-play finishes
  useEffect(() => {
    if (!done) return
    const timer = setTimeout(() => {
      if (!hintDismissedRef.current) setShowHint(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [done])

  // Command processor
  async function processCommand(raw: string) {
    if (processingRef.current) return
    const trimmed = raw.trim()
    const cmd = trimmed.toLowerCase()

    // Commit prompt line
    if (cmd !== 'clear') {
      setLines((prev) => [
        ...prev,
        { k: 'text', text: PROMPT + trimmed, color: GREEN },
      ])
    }

    if (cmd === '') return

    processingRef.current = true

    const output: TLine[] = []

    if (cmd === 'help') {
      output.push(
        { k: 'text', text: '> available commands:', color: BRIGHT },
        { k: 'blank' },
        { k: 'text', text: '>   whoami        \u2014 who is this guy', color: DIM },
        { k: 'text', text: '>   ls projects   \u2014 what he\u2019s built', color: DIM },
        { k: 'text', text: '>   skills        \u2014 what he works with', color: DIM },
        { k: 'text', text: '>   status        \u2014 availability', color: DIM },
        { k: 'text', text: '>   ping visitor  \u2014 locate visitor', color: DIM },
        { k: 'text', text: '>   env --visitor \u2014 detect your setup', color: DIM },
        { k: 'text', text: '>   ./connect.sh  \u2014 get in touch', color: DIM },
        { k: 'text', text: '>   clear         \u2014 clear terminal', color: DIM },
        { k: 'text', text: '>   exit          \u2014 close terminal', color: DIM },
        { k: 'blank' },
      )
    } else if (cmd === 'whoami') {
      output.push(
        { k: 'text', text: '> Ernest Sacdal', color: BRIGHT },
        { k: 'text', text: '> Full-Stack Developer & AI Engineer', color: BRIGHT },
        { k: 'text', text: '> Sydney, AU \u00b7 4 years shipping code', color: BRIGHT },
        { k: 'text', text: '> github.com/ernestsacdal', color: BRIGHT },
        { k: 'blank' },
      )
    } else if (cmd === 'ls projects') {
      try {
        if (!projectsCacheRef.current) {
          const res = await fetch('/api/projects')
          const data = (await res.json()) as { titles: string[] }
          projectsCacheRef.current = data.titles
        }
        for (const title of projectsCacheRef.current) {
          output.push({ k: 'text', text: `>   ${title}`, color: BRIGHT })
        }
        output.push(
          { k: 'text', text: '>   currently building more...', color: DIM },
          { k: 'blank' },
        )
      } catch {
        output.push(
          { k: 'text', text: '> failed to fetch projects', color: '#ff5f56' },
          { k: 'blank' },
        )
      }
    } else if (cmd === 'skills') {
      output.push(
        { k: 'text', text: '> app        : Next.js \u00b7 React \u00b7 TypeScript \u00b7 Node', color: BRIGHT },
        { k: 'text', text: '               Express \u00b7 FastAPI \u00b7 Django \u00b7 Laravel', color: BRIGHT },
        { k: 'text', text: '               Tailwind \u00b7 Shadcn \u00b7 Zod \u00b7 PHP \u00b7 Python', color: BRIGHT },
        { k: 'text', text: '> ai         : Anthropic \u00b7 OpenAI \u00b7 Gemini \u00b7 Groq', color: BRIGHT },
        { k: 'text', text: '               LangChain \u00b7 HuggingFace \u00b7 Ollama \u00b7 n8n', color: BRIGHT },
        { k: 'text', text: '               Socket.io \u00b7 Cloudflare', color: BRIGHT },
        { k: 'text', text: '> data       : PostgreSQL \u00b7 MongoDB \u00b7 Redis \u00b7 Prisma', color: BRIGHT },
        { k: 'text', text: '               Drizzle \u00b7 Supabase \u00b7 SQLAlchemy \u00b7 Docker \u00b7 AWS', color: BRIGHT },
        { k: 'blank' },
      )
    } else if (cmd === 'status') {
      output.push(
        { k: 'text', text: '> open to work  : yes', color: BRIGHT },
        { k: 'text', text: '> type          : full-time \u00b7 freelance \u00b7 collabs', color: BRIGHT },
        { k: 'text', text: '> response time : within 24h', color: BRIGHT },
        { k: 'blank' },
      )
    } else if (cmd === 'ping' || cmd === 'ping visitor') {
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 3000)
        const res = await fetch('/api/geoip', { signal: controller.signal })
        const ip = await res.json() as IpData & { status: string }
        clearTimeout(timeout)

        if (ip.status === 'success') {
          const visitorTZ = ip.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
          const visitorTime = formatTime(visitorTZ)
          const sydneyTime = formatTime('Australia/Sydney')
          output.push(
            { k: 'text', text: `> ${ip.city}${ip.countryCode ? `, ${ip.countryCode}` : ''}  \u00b7  ${visitorTime}  -- you`, color: BRIGHT },
            { k: 'text', text: `> Sydney, AU  \u00b7  ${sydneyTime}  -- me`, color: BRIGHT },
            { k: 'text', text: `> ${getDistancePhrase(ip)}`, color: BRIGHT },
            { k: 'blank' },
          )
        } else {
          const fallbackTZ = Intl.DateTimeFormat().resolvedOptions().timeZone
          const visitorTime = formatTime(fallbackTZ)
          const sydneyTime = formatTime('Australia/Sydney')
          output.push(
            { k: 'text', text: `> Unknown  \u00b7  ${visitorTime}  -- you`, color: BRIGHT },
            { k: 'text', text: `> Sydney, AU  \u00b7  ${sydneyTime}  -- me`, color: BRIGHT },
            { k: 'blank' },
          )
        }
      } catch {
        output.push(
          { k: 'text', text: '> failed to locate visitor', color: '#ff5f56' },
          { k: 'blank' },
        )
      }
    } else if (cmd === 'env --visitor') {
      const env = getEnvData()
      const deviceType = env.mobile ? 'Mobile' : 'Desktop'
      const verdict = getVerdict(env.os, env.browser, env.mobile)
      output.push(
        { k: 'text', text: `> OS: ${env.os}`, color: BRIGHT },
        { k: 'text', text: `> Browser: ${env.browser}${env.version ? ` ${env.version}` : ''}`, color: BRIGHT },
        { k: 'text', text: `> Device: ${deviceType}`, color: BRIGHT },
        { k: 'text', text: `> ${verdict}`, color: BRIGHT },
        { k: 'blank' },
      )
    } else if (cmd === './connect.sh' || cmd === 'connect.sh') {
      output.push(
        { k: 'text', text: "> if you got this far \u2014 let\u2019s talk", color: BRIGHT },
        { k: 'link', label: '> sacdalernest01@gmail.com', href: 'mailto:sacdalernest01@gmail.com' },
        { k: 'link', label: '> linkedin.com/in/ernestmikhail', href: 'https://www.linkedin.com/in/ernestmikhail/' },
        { k: 'blank' },
      )
    } else if (['joy', 'mj', 'mary', 'joyce', 'tin'].includes(cmd)) {
      const PINK = '#FF6B9D'
      const heart = [
        '  ***   ***  ',
        '****** ******',
        '*************',
        '*************',
        ' *********** ',
        '  *********  ',
        '   *******   ',
        '    *****    ',
        '     ***     ',
        '      *      ',
      ]
      const name = trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
      output.push({ k: 'blank' })
      for (const row of heart) {
        output.push({ k: 'text', text: `   ${row}`.replace(/ /g, '\u00a0'), color: PINK })
      }
    } else if (cmd === 'clear') {
      setLines([])
      processingRef.current = false
      return
    } else if (cmd === 'exit') {
      setExiting(true)
      setLines((prev) => [
        ...prev,
        { k: 'text', text: 'closing session...', color: DIM },
      ])
      setTimeout(() => {
        setLines((prev) => [
          ...prev,
          { k: 'text', text: 'logout', color: DIM },
        ])
        setTimeout(() => {
          onClose()
        }, 400)
      }, 600)
      processingRef.current = false
      return
    } else {
      output.push(
        { k: 'text', text: `command not found: ${trimmed}`, color: '#ff5f56' },
        { k: 'text', text: "type 'help' to see available commands", color: DIM },
        { k: 'blank' },
      )
    }

    setLines((prev) => [...prev, ...output])
    processingRef.current = false
  }

  // Skip typewriting on Enter (before done)
  useEffect(() => {
    if (done || exiting) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        e.preventDefault()
        skipRef.current = true
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [done, exiting])

  // Focus hidden input when interactive mode starts (triggers mobile keyboard)
  useEffect(() => {
    if (done && !exiting) {
      hiddenInputRef.current?.focus()
    }
  }, [done, exiting])

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (processingRef.current) return
    if (e.key === 'Escape') { onClose(); return }
    if (e.ctrlKey || e.metaKey || e.altKey) return

    if (!hintDismissedRef.current) {
      hintDismissedRef.current = true
      setShowHint(false)
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const history = historyRef.current
      if (history.length === 0) return
      if (historyIndexRef.current === -1) savedInputRef.current = inputRef.current
      const nextIndex = Math.min(historyIndexRef.current + 1, history.length - 1)
      historyIndexRef.current = nextIndex
      const entry = history[history.length - 1 - nextIndex]
      inputRef.current = entry
      setInputText(entry)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndexRef.current === -1) return
      const nextIndex = historyIndexRef.current - 1
      historyIndexRef.current = nextIndex
      if (nextIndex === -1) {
        inputRef.current = savedInputRef.current
        setInputText(savedInputRef.current)
      } else {
        const entry = historyRef.current[historyRef.current.length - 1 - nextIndex]
        inputRef.current = entry
        setInputText(entry)
      }
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const current = inputRef.current
      if (current.trim()) historyRef.current.push(current.trim())
      historyIndexRef.current = -1
      savedInputRef.current = ''
      setInputText('')
      inputRef.current = ''
      processCommand(current)
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Handles mobile virtual keyboard input (onChange fires, keydown may not)
    if (processingRef.current) return
    const val = e.target.value.slice(0, 80)
    inputRef.current = val
    setInputText(val)
    historyIndexRef.current = -1
    if (!hintDismissedRef.current) {
      hintDismissedRef.current = true
      setShowHint(false)
    }
  }

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
          if (skipRef.current) {
            skipRef.current = false
            setTypingText(cmd)
            setShowTyping(false)
            setLines((prev) => [...prev, { k: 'text', text: PROMPT + cmd, color: GREEN }])
            resolve()
            return
          }
          i++
          setTypingText(cmd.slice(0, i))
          if (i >= cmd.length) {
            setShowTyping(false)
            setLines((prev) => [...prev, { k: 'text', text: PROMPT + cmd, color: GREEN }])
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
      await typeCmd('ping visitor')
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
      await typeCmd('env --visitor')
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
      await typeCmd('./connect.sh')
      if (cancelled) return

      addLines([
        { k: 'text', text: "> if you got this far — let's talk", color: BRIGHT },
        { k: 'link', label: '> sacdalernest01@gmail.com', href: 'mailto:sacdalernest01@gmail.com' },
        { k: 'link', label: '> linkedin.com/in/ernestmikhail', href: 'https://www.linkedin.com/in/ernestmikhail/' },
        { k: 'blank' },
      ])
      // sequence done — switch to interactive mode
      setShowTyping(false)
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
        ...(pos ? { bottom: pos.bottom, left: pos.left } : { bottom: 74, left: '50%', transform: 'translateX(-50%)' }),
        zIndex: 9999,
        width: TERMINAL_WIDTH,
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

      {/* Hidden input — gives mobile virtual keyboard a target */}
      {done && !exiting && (
        <input
          ref={hiddenInputRef}
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Terminal input"
          style={{
            position: 'absolute',
            opacity: 0,
            pointerEvents: 'none',
            width: 1,
            height: 1,
            top: 0,
            left: 0,
          }}
        />
      )}

      {/* Terminal body */}
      <div
        ref={bodyRef}
        onClick={() => hiddenInputRef.current?.focus()}
        style={{
          padding: '14px 16px 16px',
          fontFamily: "'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace",
          fontSize: 12,
          lineHeight: 1.7,
          height: 300,
          overflowY: 'auto',
          cursor: done && !exiting ? 'text' : 'default',
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

        {/* Auto-play typing (before done) */}
        {showTyping && !done && (
          <div>
            <span style={{ color: GREEN }}>{PROMPT}</span>
            <span style={{ color: '#ffffff' }}>
              {typingText}
              <span>█</span>
            </span>
          </div>
        )}

        {/* Interactive prompt (after done) */}
        {done && !exiting && (
          <div>
            <span style={{ color: GREEN }}>{PROMPT}</span>
            <span style={{ color: '#ffffff' }}>
              {inputText}
              <span className="animate-blink">█</span>
            </span>
          </div>
        )}

        {/* Hint line */}
        {showHint && (
          <div
            style={{
              color: DIM,
              opacity: 1,
              transition: 'opacity 0.5s ease-in',
              marginTop: 4,
            }}
          >
            # type &apos;help&apos; to explore
          </div>
        )}
      </div>
    </motion.div>
  )
}
