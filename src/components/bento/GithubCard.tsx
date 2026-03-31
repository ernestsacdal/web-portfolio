import type { GithubData } from '@/types'

function getColor(count: number): string {
  if (count === 0) return 'var(--bg3)'
  if (count <= 2) return '#196c2e'
  if (count <= 5) return '#26a641'
  if (count <= 8) return '#39d353'
  return '#56e066'
}

interface GithubCardProps {
  data: GithubData | null
}

export function GithubCard({ data }: GithubCardProps) {
  const weeks = Array.from({ length: 52 }, (_, i) => data?.contributions[i] ?? [])
  const total = data?.totalContributions ?? 0
  const lastPushed = data?.lastPushed
    ? new Date(data.lastPushed).toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—'

  return (
    <div className="bento-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <p
        style={{
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text2)',
        }}
      >
        GitHub Activity
      </p>

      {/* Heatmap */}
      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 2, width: 'max-content' }}>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {Array.from({ length: 7 }, (_, di) => {
                const count = week[di] ?? 0
                return (
                  <div
                    key={di}
                    title={`${count} contribution${count !== 1 ? 's' : ''}`}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      background: getColor(count),
                      flexShrink: 0,
                    }}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <p style={{ fontSize: 12, color: 'var(--text2)' }}>
        <span style={{ color: 'var(--text)', fontWeight: 500 }}>{total.toLocaleString()}</span>
        {' contributions in the last year · Last pushed: '}
        <span style={{ color: 'var(--text)', fontWeight: 500 }}>{lastPushed}</span>
      </p>
    </div>
  )
}
