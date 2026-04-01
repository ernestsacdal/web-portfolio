import Link from 'next/link'

const TAGS = ['FastAPI', 'Next.js', 'Groq', 'AI']

export function FeaturedProjectCard() {
  return (
    <div
      className="bento-card"
      style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      {/* Label */}
      <p
        style={{
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text2)',
        }}
      >
        Featured Project
      </p>

      {/* Title + live badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15 }}>
          PreTriage
        </p>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '3px 9px',
            borderRadius: 50,
            background: 'rgba(34, 197, 94, 0.12)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            fontSize: 10,
            fontWeight: 600,
            color: '#22c55e',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: '#22c55e',
              display: 'inline-block',
            }}
          />
          Live
        </span>
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: 13,
          color: 'var(--text2)',
          lineHeight: 1.6,
          flex: 1,
        }}
      >
        AI-powered patient pre-triage system that assesses symptoms and prioritises care using LLMs.
        Reduces nursing workload at the point of care.
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {TAGS.map((tag) => (
          <span
            key={tag}
            style={{
              padding: '3px 9px',
              borderRadius: 50,
              background: 'var(--bg3)',
              fontSize: 11,
              fontWeight: 500,
              color: 'var(--text2)',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Link */}
      <Link
        href="/projects/pretriage"
        style={{ fontSize: 13, fontWeight: 500, color: '#0071E3', textDecoration: 'none' }}
      >
        → View project
      </Link>
    </div>
  )
}
