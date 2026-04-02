const SERVICES = [
  { title: 'Full-Stack Development', subtitle: 'End-to-end web applications' },
  { title: 'AI & LLM Integration', subtitle: 'Intelligent product features' },
  { title: 'Automation Pipelines', subtitle: 'Workflows that actually scale' },
  { title: 'API Design & Integration', subtitle: 'Clean, documented, reliable' },
  { title: 'Database Architecture', subtitle: 'Structured for performance' },
  { title: 'Auth & Access Control', subtitle: 'Secure from day one' },
  { title: 'Cloud Deployment', subtitle: 'Ship fast, stay available' },
  { title: 'Real-Time Features', subtitle: 'Live updates, zero lag' },
  { title: 'CMS & Content Tools', subtitle: 'Edit without a developer' },
  { title: 'Performance Optimization', subtitle: 'Sub-second load times' },
  { title: 'UI/UX Implementation', subtitle: 'Designs that feel as good as they look' },
  { title: 'Team Collaboration', subtitle: 'Embedded or async, built around you' },
  { title: 'Code Review & Audits', subtitle: 'Find the gaps before they cost you' },
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
