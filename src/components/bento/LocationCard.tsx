'use client'

import { useEffect, useState } from 'react'

function getSydneyTime() {
  return new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Sydney',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date())
}

function getSydneyOffset() {
  const formatter = new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Sydney',
    timeZoneName: 'short',
  })
  const parts = formatter.formatToParts(new Date())
  return parts.find((p) => p.type === 'timeZoneName')?.value ?? 'AEST'
}

export function LocationCard() {
  const [time, setTime] = useState(getSydneyTime())
  const [tz] = useState(getSydneyOffset())

  useEffect(() => {
    const id = setInterval(() => setTime(getSydneyTime()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="bento-card" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <p
        style={{
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text2)',
        }}
      >
        Based in
      </p>

      <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>
        Sydney
      </p>
      <p style={{ fontSize: 12, color: 'var(--text2)' }}>Australia</p>

      <div style={{ marginTop: 'auto', paddingTop: 12 }}>
        <p
          style={{
            fontFamily: "'SF Mono', 'Fira Code', monospace",
            fontSize: 18,
            fontWeight: 600,
            color: 'var(--text)',
            letterSpacing: '0.02em',
          }}
        >
          {time}
        </p>
        <p style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{tz}</p>
      </div>
    </div>
  )
}
