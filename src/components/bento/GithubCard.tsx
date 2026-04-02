'use client'

import { useState } from 'react'
import type { GithubData } from '@/types'

function getColor(level: number): string {
  if (level === 0) return 'var(--bg3)'
  if (level === 1) return '#166534'
  if (level === 2) return '#16a34a'
  if (level === 3) return '#22c55e'
  return '#4ade80'
}

function ordinalSuffix(d: number): string {
  const v = d % 100
  const s = ['th', 'st', 'nd', 'rd']
  return s[(v - 20) % 10] ?? s[v] ?? s[0]
}

function formatHoverLabel(dateStr: string, count: number): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const month = date.toLocaleDateString('en-US', { month: 'long' })
  const ord = ordinalSuffix(d)
  const noun = count === 1 ? 'contribution' : 'contributions'
  return `${count} ${noun} on ${month} ${d}${ord}`
}

function formatOrdinalDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' })
  const month = date.toLocaleDateString('en-US', { month: 'long' })
  const ord = ordinalSuffix(d)
  return `${weekday}, ${month} ${d}${ord} ${y}`
}

interface GithubCardProps {
  data: GithubData | null
}

export function GithubCard({ data }: GithubCardProps) {
  const [hoverLabel, setHoverLabel] = useState<string | null>(null)

  const contributions = data?.contributions ?? []
  const total = data?.totalContributions ?? 0
  const lastPushed = data?.lastPushed ?? null

  const weeks: { date: string; count: number; level: number }[][] = []
  for (let i = 0; i < contributions.length; i += 7) {
    weeks.push(contributions.slice(i, i + 7))
  }

  return (
    <div
      className="bento-card"
      style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text2)' }}>
          GitHub Activity
        </p>
        {hoverLabel && (
          <span style={{ fontSize: 12, color: 'var(--text2)' }}>{hoverLabel}</span>
        )}
      </div>

      {/* Heatmap */}
      <div style={{ overflowX: 'auto', direction: 'rtl', flex: 1, minHeight: 0, display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            direction: 'ltr',
            display: 'flex',
            gap: 'clamp(2px, 0.5vw, 4px)',
            width: 'max-content',
            margin: '0 auto',
          }}
        >
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(2px, 0.5vw, 4px)' }}>
              {week.map((day, di) => (
                <div
                  key={di}
                  onMouseEnter={() => setHoverLabel(formatHoverLabel(day.date, day.count))}
                  onMouseLeave={() => setHoverLabel(null)}
                  style={{
                    width: 'clamp(10px, 2vw, 16px)',
                    height: 'clamp(10px, 2vw, 16px)',
                    borderRadius: 3,
                    background: getColor(day.level),
                    flexShrink: 0,
                    cursor: 'default',
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <p style={{ fontSize: 13, color: 'var(--text2)' }}>
        Last pushed on {formatOrdinalDate(lastPushed)}
      </p>
    </div>
  )
}
