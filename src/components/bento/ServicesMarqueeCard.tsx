'use client'

const SERVICES = [
  'Full-Stack Development',
  'AI & LLM Integration',
  'Automation Pipelines',
  'API Design & Integration',
  'Database Architecture',
  'Auth & Access Control',
  'Cloud Deployment',
  'Real-Time Features',
  'CMS & Content Tools',
  'Performance Optimization',
  'UI/UX Implementation',
  'Team Collaboration',
  'Code Review & Audits',
]

const MARQUEE_ITEMS = [...SERVICES, ...SERVICES]

export function ServicesMarqueeCard() {
  return (
    <div
      className="bento-card"
      style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
    >
      {/* Vertical fade mask */}
      <div
        style={{
          overflow: 'hidden',
          flex: 1,
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
          maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
        }}
      >
        <div
          className="animate-marquee-vertical"
          style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
        >
          {MARQUEE_ITEMS.map((service, i) => (
            <p
              key={i}
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: 'var(--text2)',
                whiteSpace: 'nowrap',
                letterSpacing: '0.04em',
                lineHeight: 1,
              }}
            >
              {service}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
