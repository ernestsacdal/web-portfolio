'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { onLog } from '@/lib/logEvents'
import type { LogEventDetail } from '@/lib/logEvents'

// ─── Types ──────────────────────────────────────────────────────────────────────
type LogType = 'SYS' | 'GAME' | 'API' | 'AI' | 'USER'

type LogEntry = {
  id: number
  timestamp: string
  type: LogType
  message: string
  sub?: string
}

// ─── Constants ──────────────────────────────────────────────────────────────────
const TYPE_COLORS: Record<LogType, string> = {
  SYS:  'var(--text2)',
  GAME: '#0A84FF',
  API:  '#30D158',
  AI:   '#FF453A',
  USER: '#FF9F0A',
}

const FLOW_NODES = ['User', 'Frontend', 'API', 'AI Engine', 'Response'] as const
const MAX_LOGS = 13

// ─── Helpers ────────────────────────────────────────────────────────────────────
function getTimestamp(): string {
  const d = new Date()
  return [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map(n => String(n).padStart(2, '0'))
    .join(':')
}

// ─── Sub-components ─────────────────────────────────────────────────────────────
function LogView({ logs, containerRef }: { logs: LogEntry[]; containerRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={containerRef} style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 5, paddingRight: 2 }}>
      {logs.length === 0 && (
        <div style={{ fontSize: 10, color: 'var(--text2)', opacity: 0.5, marginTop: 8 }}>
          Waiting for events...
        </div>
      )}
      {logs.map((entry) => (
        <div
          key={entry.id}
          style={{ animation: 'logFadeIn 0.2s ease forwards', opacity: 0, flexShrink: 0 }}
        >
          <div style={{ display: 'flex', gap: 6, alignItems: 'baseline', flexWrap: 'nowrap' }}>
            <span style={{ fontSize: 9, color: 'var(--text2)', flexShrink: 0, opacity: 0.7 }}>
              [{entry.timestamp}]
            </span>
            <span style={{
              fontSize: 9,
              fontWeight: 700,
              color: TYPE_COLORS[entry.type],
              flexShrink: 0,
              letterSpacing: '0.03em',
            }}>
              [{entry.type}]
            </span>
            <span style={{ fontSize: 10, color: 'var(--text)', lineHeight: 1.4, wordBreak: 'break-word' }}>
              {entry.message}
            </span>
          </div>
          {entry.sub && (
            <div style={{ fontSize: 9, color: 'var(--text2)', paddingLeft: 12, marginTop: 1, opacity: 0.8 }}>
              {entry.sub}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function FlowView({ flowStep }: { flowStep: number }) {
  const accentColor = '#0A84FF'
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {FLOW_NODES.map((label, i) => {
          const isActive = i <= flowStep
          const isCurrent = i === flowStep
          const isDone = i < flowStep
          return (
            <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
              {i > 0 && (
                <div style={{
                  width: 22,
                  height: 2,
                  background: isActive ? accentColor : 'var(--bg3)',
                  transition: 'background 0.25s ease',
                  flexShrink: 0,
                }} />
              )}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: isActive ? accentColor : 'var(--bg3)',
                  border: `2px solid ${isActive ? accentColor : 'var(--border)'}`,
                  transition: 'background 0.25s ease, border-color 0.25s ease',
                  animation: isCurrent ? 'flowGlow 0.9s ease-in-out infinite' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {isDone && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span style={{
                  fontSize: 8,
                  color: isActive ? 'var(--text)' : 'var(--text2)',
                  letterSpacing: '0.03em',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.2s ease',
                  fontFamily: 'var(--font-mono)',
                  maxWidth: 46,
                  lineHeight: 1.3,
                }}>
                  {label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
      <div style={{ fontSize: 9, color: 'var(--text2)', letterSpacing: '0.06em', opacity: 0.7 }}>
        {flowStep < 0 ? '' :
         flowStep === 0 ? 'Receiving input...' :
         flowStep === 1 ? 'Processing move...' :
         flowStep === 2 ? 'Routing to AI...' :
         flowStep === 3 ? 'Evaluating board...' :
                          'Returning response'}
      </div>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export function LogCard() {
  const [mode, setMode] = useState<'log' | 'flow'>('log')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [flowStep, setFlowStep] = useState(-1)

  const logContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = logContainerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [logs])
  const timeoutIds      = useRef<ReturnType<typeof setTimeout>[]>([])
  const queueRef        = useRef<Array<() => Promise<void>>>([])
  const processingRef   = useRef(false)
  const mountedRef      = useRef(true)
  const entryId         = useRef(0)
  const startupFiredRef = useRef(false)
  // Flow animation sync — resolver is called by api:done to unblock the AI Engine hold
  const flowResolverRef = useRef<(() => void) | null>(null)
  const apiDoneRef      = useRef(false)

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const sleep = useCallback((ms: number) => new Promise<void>(resolve => {
    const id = setTimeout(resolve, ms)
    timeoutIds.current.push(id)
  }), [])

  const addLog = useCallback((entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    if (!mountedRef.current) return
    const id = ++entryId.current
    setLogs(prev => {
      const next = [...prev, { ...entry, id, timestamp: getTimestamp() }]
      return next.length > MAX_LOGS ? next.slice(next.length - MAX_LOGS) : next
    })
  }, [])

  // ── Queue ─────────────────────────────────────────────────────────────────────
  const processQueue = useCallback(async () => {
    if (processingRef.current) return
    processingRef.current = true
    while (queueRef.current.length > 0) {
      await queueRef.current.shift()!()
    }
    processingRef.current = false
  }, [])

  const addToQueue = useCallback((task: () => Promise<void>) => {
    queueRef.current.push(task)
    if (!processingRef.current) processQueue()
  }, [processQueue])

  // ── Flow animation ────────────────────────────────────────────────────────────
  // Steps quickly to AI Engine, then holds until api:done fires, then completes.
  const runFlowAnimation = useCallback(async () => {
    apiDoneRef.current = false
    setMode('flow')
    // User → Frontend → API: fast (these are local/immediate)
    for (let i = 0; i <= 2; i++) {
      setFlowStep(i)
      await sleep(100)
    }
    // Hold at AI Engine until the real API response arrives
    setFlowStep(3)
    if (!apiDoneRef.current) {
      await new Promise<void>(resolve => { flowResolverRef.current = resolve })
    }
    flowResolverRef.current = null
    // Response: brief pause then back to log
    setFlowStep(4)
    await sleep(300)
    setFlowStep(-1)
    setMode('log')
  }, [sleep])

  // ── Mount/unmount lifecycle (MUST BE FIRST EFFECT) ──────────────────────────
  // Resets refs on every (re)mount — handles StrictMode double-invoke and
  // Next.js router-cache restoration where the same instance is reused.
  useEffect(() => {
    mountedRef.current = true
    startupFiredRef.current = false
    return () => {
      mountedRef.current = false
      timeoutIds.current.forEach(clearTimeout)
      timeoutIds.current = []
    }
  }, [])

  // ── Startup logs (once per mount) ────────────────────────────────────────────
  useEffect(() => {
    if (startupFiredRef.current) return
    startupFiredRef.current = true
    const t1 = setTimeout(() => addLog({
      type: 'SYS',
      message: 'Page rendered → /',
      sub: '↳ app: 104ms • next: 3ms',
    }), 400)
    const t2 = setTimeout(() => addLog({ type: 'SYS', message: 'App ready' }), 900)
    timeoutIds.current.push(t1, t2)
  }, [addLog])

  // ── Ambient background logs ───────────────────────────────────────────────────
  useEffect(() => {
    function scheduleSpotify() {
      if (!mountedRef.current || document.hidden) return
      const delay = 28_000 + Math.random() * 4_000
      const id = setTimeout(() => {
        if (!mountedRef.current || document.hidden) return
        const latency = Math.floor(Math.random() * 600 + 200)
        addLog({ type: 'API', message: `GET /spotify → 200 OK (${latency}ms)` })
        scheduleSpotify()
      }, delay)
      timeoutIds.current.push(id)
    }
    function scheduleGithub() {
      if (!mountedRef.current || document.hidden) return
      const delay = 55_000 + Math.random() * 10_000
      const id = setTimeout(() => {
        if (!mountedRef.current || document.hidden) return
        addLog({ type: 'API', message: 'GET /github → 304 Not Modified' })
        scheduleGithub()
      }, delay)
      timeoutIds.current.push(id)
    }

    function onVisibilityChange() {
      if (!document.hidden) {
        scheduleSpotify()
        scheduleGithub()
      }
    }

    scheduleSpotify()
    scheduleGithub()
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [addLog])

  // ── Event listener ────────────────────────────────────────────────────────────
  useEffect(() => {
    return onLog((detail: LogEventDetail) => {
      switch (detail.type) {
        case 'game:start':
          addToQueue(async () => {
            addLog({ type: 'GAME', message: 'Connect 4 started' })
          })
          break

        case 'game:move':
          if (detail.player === 'human') {
            addToQueue(async () => {
              addLog({ type: 'GAME', message: `You placed → col ${detail.col + 1}` })
            })
            addToQueue(runFlowAnimation)
          }
          break

        case 'api:done':
          // Unblock the flow animation immediately — not through the queue
          apiDoneRef.current = true
          flowResolverRef.current?.()
          flowResolverRef.current = null
          addToQueue(async () => {
            const ok = detail.status === 200 ? '200 OK' : `${detail.status} Error`
            addLog({
              type: 'API',
              message: `POST ${detail.path} → ${ok} (${detail.latencyMs}ms)`,
              ...(detail.fallback ? { sub: '↳ fallback: local minimax' } : {}),
            })
            await sleep(200)
            addLog({ type: 'AI', message: `Placed → col ${detail.aiCol + 1} (${detail.latencyMs}ms)` })
          })
          break

        case 'game:end': {
          const msg =
            detail.winner === 'human_win' ? 'You win! 🎉' :
            detail.winner === 'ai_win'    ? 'AI wins.' :
                                            'Draw.'
          addToQueue(async () => { addLog({ type: 'GAME', message: msg }) })
          break
        }
      }
    })
  }, [addLog, addToQueue, runFlowAnimation, sleep])

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div
      className="bento-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 14,
        height: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* ── Header ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        marginBottom: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: '#30D158',
            display: 'block',
            animation: 'statusPulse 2s ease-in-out infinite',
            flexShrink: 0,
          }} />
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text2)' }}>
            SYSTEM LOG
          </span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['log', 'flow'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                fontSize: 9,
                fontWeight: 500,
                letterSpacing: '0.06em',
                padding: '3px 9px',
                borderRadius: 20,
                border: `1px solid ${mode === m ? '#0A84FF' : 'var(--border)'}`,
                background: mode === m ? '#0A84FF' : 'transparent',
                color: mode === m ? '#fff' : 'var(--text2)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                transition: 'all 0.15s ease',
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {mode === 'log'
          ? <LogView logs={logs} containerRef={logContainerRef} />
          : <FlowView flowStep={flowStep} />
        }
      </div>

      {/* ── Footer ── */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        gap: 10,
        marginTop: 10,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        {(Object.entries(TYPE_COLORS) as [LogType, string][]).map(([type, color]) => (
          <span key={type} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, display: 'block', flexShrink: 0 }} />
            <span style={{ fontSize: 9, color: 'var(--text2)', letterSpacing: '0.06em', opacity: 0.7 }}>{type}</span>
          </span>
        ))}
      </div>

    </div>
  )
}
