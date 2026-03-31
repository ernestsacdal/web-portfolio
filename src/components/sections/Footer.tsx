import { FadeIn } from '@/components/ui/FadeIn'

const NAV_LINKS = [
  { label: 'Work', id: 'work' },
  { label: 'Blog', id: 'blog' },
  { label: 'Contact', id: 'contact' },
]

export function Footer() {
  return (
    <footer
      id="contact"
      style={{
        borderTop: '1px solid var(--border)',
        padding: '2rem 1.25rem',
        marginBottom: 80,
      }}
    >
      <FadeIn
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          textAlign: 'center',
        }}
      >
        {/* Logo */}
        <span
          style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: 'var(--text)',
            userSelect: 'none',
          }}
        >
          E·S
        </span>

        {/* Nav links */}
        <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {NAV_LINKS.map(({ label, id }) => (
            <a key={id} href={`#${id}`} className="footer-link">
              {label}
            </a>
          ))}
        </nav>

        {/* Divider */}
        <div style={{ width: '100%', maxWidth: 400, height: 1, background: 'var(--border)' }} />

        {/* Copyright + built with */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0 }}>
            © 2025 Ernest Sacdal
          </p>
          <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0 }}>
            Built with Next.js · Deployed on Vercel
          </p>
        </div>

        {/* Signature */}
        <p
          style={{
            fontSize: 11,
            color: 'var(--text2)',
            fontFamily: "'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace",
            margin: 0,
            opacity: 0.6,
          }}
        >
          Designed &amp; built by Ernest
        </p>
      </FadeIn>
    </footer>
  )
}
