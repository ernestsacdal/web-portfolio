const SERVICES = [
  { title: 'Full-Stack Development', subtitle: 'End-to-end web applications' },
  { title: 'AI & LLM Integration', subtitle: 'Intelligent product features' },
  { title: 'Automation Pipelines', subtitle: 'Workflows that actually scale' },
]

export function ServicesCard() {
  return (
    <div className="bento-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p
        style={{
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text2)',
        }}
      >
        Services
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {SERVICES.map(({ title, subtitle }) => (
          <div
            key={title}
            style={{
              background: 'var(--bg3)',
              borderRadius: 12,
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{title}</p>
            <p style={{ fontSize: 12, color: 'var(--text2)' }}>{subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
