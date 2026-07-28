'use client'

import { useEffect, useState } from 'react'

const CARD_CSS = `
  @keyframes statusPulse {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0.25; }
  }
  .status-dot {
    background: #157A42;
    animation: statusPulse 2s ease-in-out infinite;
  }
  .dark .status-dot { background: #3FB873; }
  .status-plus { color: #157A42; }
  .dark .status-plus { color: #3FB873; }
  @media (prefers-reduced-motion: reduce) {
    .status-dot { animation: none; }
  }
  @media (max-width: 767px) {
    .status-row {
      flex-direction: column !important;
      justify-content: center !important;
      gap: 14px;
      padding: 30px 8px 14px !important;
    }
    .status-div { display: none !important; }
  }
`

export function StatusCard() {
  const [time, setTime] = useState('')
  const [tz, setTz] = useState('AEST')

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-AU', {
      timeZone: 'Australia/Sydney',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZoneName: 'short',
    })
    function tick() {
      const parts = fmt.formatToParts(new Date())
      const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
      setTime(`${get('hour')}:${get('minute')}`)
      const name = get('timeZoneName')
      if (name) setTz(name)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="bento-card" style={{ position: 'relative', overflow: 'hidden' }}>
      <style>{CARD_CSS}</style>

      {/* Availability eyebrow */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          zIndex: 1,
        }}
      >
        <span className="status-dot" style={{ width: 6, height: 6, borderRadius: '50%' }} />
        <span
          style={{
            fontSize: 9,
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text2)',
          }}
        >
          Open to work
        </span>
      </div>

      {/* Clock + stat */}
      <div
        className="status-row"
        style={{
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          padding: '14px 8px 0',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            suppressHydrationWarning
            style={{
              fontSize: 19,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              fontVariantNumeric: 'tabular-nums',
              color: 'var(--text)',
            }}
          >
            {time || '--:--'}
          </div>
          <div
            style={{
              fontSize: 8.5,
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text2)',
              marginTop: 3,
            }}
          >
            Sydney · {tz}
          </div>
        </div>

        <div
          className="status-div"
          style={{ width: 1, height: 30, background: 'var(--border)', flexShrink: 0 }}
        />

        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: 19,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'var(--text)',
            }}
          >
            4<span className="status-plus">+</span>
          </div>
          <div
            style={{
              fontSize: 8.5,
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text2)',
              marginTop: 3,
            }}
          >
            yrs shipping
          </div>
        </div>
      </div>
    </div>
  )
}
