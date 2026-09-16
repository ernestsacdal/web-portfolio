import Image from 'next/image'
import { FadeIn } from '@/components/ui/FadeIn'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      id="contact"
      style={{
        borderTop: '1px solid var(--border)',
        padding: '1.5rem 0',
        marginBottom: 80,
      }}
    >
      <FadeIn
        className="flex flex-col items-center gap-3 md:grid md:grid-cols-[1fr_auto_1fr]"
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 1.25rem',
          alignItems: 'center',
        }}
      >
        {/* Left — Logo */}
        <Image
          src="/logo.png"
          alt="EMS"
          width={120}
          height={48}
          className="mix-blend-multiply dark:mix-blend-normal dark:invert"
          style={{ display: 'block', width: 'auto', height: '2rem' }}
        />

        {/* Center — Copyright */}
        <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0, textAlign: 'center' }}>
          © {year} Ernest Mikhail Sacdal · Sydney, Australia
        </p>

        {/* Right — Stack */}
        <p className="md:text-right" style={{ fontSize: 12, color: 'var(--text2)', margin: 0, textAlign: 'center' }}>
          Built with Next.js
        </p>
      </FadeIn>
    </footer>
  )
}
