import { FadeIn } from '@/components/ui/FadeIn'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      id="contact"
      style={{
        borderTop: '1px solid var(--border)',
        padding: '1.5rem 1.5rem',
        marginBottom: 80,
      }}
    >
      <FadeIn
        style={{
          maxWidth: 960,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
        }}
      >
        {/* Left — Logo */}
        <img
          src="/logo.png"
          alt="EMS"
          className="h-12 w-auto mix-blend-multiply dark:mix-blend-normal dark:invert"
          style={{ display: 'block' }}
        />

        {/* Center — Copyright */}
        <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0, opacity: 0.7, textAlign: 'center' }}>
          © {year} Ernest Mikhail Sacdal · Sydney, Australia
        </p>

        {/* Right — Stack */}
        <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0, opacity: 0.7, textAlign: 'right' }}>
          Next.js
        </p>
      </FadeIn>
    </footer>
  )
}
