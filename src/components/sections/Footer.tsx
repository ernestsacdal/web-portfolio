import Image from 'next/image'
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
        className="flex flex-col items-center gap-3 md:grid md:grid-cols-[1fr_auto_1fr]"
        style={{ maxWidth: 960, margin: '0 auto', alignItems: 'center' }}
      >
        {/* Left — Logo */}
        <Image
          src="/logo.png"
          alt="EMS"
          width={120}
          height={48}
          className="h-12 w-auto mix-blend-multiply dark:mix-blend-normal dark:invert"
          style={{ display: 'block', width: 'auto', height: '3rem' }}
        />

        {/* Center — Copyright */}
        <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0, opacity: 0.7, textAlign: 'center' }}>
          © {year} Ernest Mikhail Sacdal · Sydney, Australia
        </p>

        {/* Right — Stack */}
        <p className="md:text-right" style={{ fontSize: 12, color: 'var(--text2)', margin: 0, opacity: 0.7, textAlign: 'center' }}>
          Next.js
        </p>
      </FadeIn>
    </footer>
  )
}
