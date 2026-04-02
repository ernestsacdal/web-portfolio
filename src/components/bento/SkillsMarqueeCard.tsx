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

const LOOP = [...SERVICES, ...SERVICES]

export function SkillsMarqueeCard() {
  return (
    <div
      className="bento-card"
      style={{ overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}
    >
      {/* Animated green dot — top-left */}
      <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 1 }}>
        <span
          className="animate-pulse-dot"
          style={{ display: 'block', width: 8, height: 8, borderRadius: '50%', background: '#4ade80' }}
        />
      </div>

      {/* Vertical chip marquee */}
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
          maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
        }}
      >
        <div
          className="animate-marquee-vertical"
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
        >
          {LOOP.map((service, i) => (
            <p
              key={i}
              style={{
                fontSize: 18,
                fontWeight: 400,
                color: 'var(--text2)',
                whiteSpace: 'nowrap',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                textAlign: 'center',
                width: '100%',
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
