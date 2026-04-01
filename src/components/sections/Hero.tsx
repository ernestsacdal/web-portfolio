'use client'

import { motion } from 'framer-motion'
import { Download } from 'lucide-react'

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/ernestsacdal', external: true },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/ernestsacdal', external: true },
  { label: 'Email', href: 'mailto:ernest@ernestsacdal.com' },
  { label: 'CV', href: '/cv.pdf', download: true },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const, delay },
  }),
}

export function Hero() {
  return (
    <section
      id="home"
      style={{
        width: '100%',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 1.25rem',
      }}
    >
      <div
        style={{
          maxWidth: 760,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 24,
        }}
      >
        {/* Availability badge */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0}
          variants={fadeUp}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            borderRadius: 50,
            background: 'rgba(0,113,227,0.12)',
            border: '1px solid rgba(0,113,227,0.3)',
            fontSize: 12,
            fontWeight: 500,
            color: '#0071E3',
          }}
        >
          <span
            className="animate-pulse-dot"
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#22c55e',
              flexShrink: 0,
              display: 'inline-block',
            }}
          />
          Available for project collabs
        </motion.div>

        {/* Name */}
        <motion.h1
          initial="hidden"
          animate="visible"
          custom={0.1}
          variants={fadeUp}
          style={{
            fontSize: 'clamp(2.8rem, 9vw, 5.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.04,
            margin: 0,
          }}
        >
          <span style={{ color: 'var(--text)' }}>Ernest</span>{' '}
          <span style={{ color: 'var(--text2)' }}>Sacdal</span>
        </motion.h1>

        {/* Role subtitle + Bio */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0.2}
          variants={fadeUp}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              color: 'var(--text2)',
              maxWidth: 500,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Full-Stack Developer &amp; AI Engineer
          </p>
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              color: 'var(--text2)',
              maxWidth: 500,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Building intelligent systems, automation pipelines, and products people actually use.
          </p>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0.35}
          variants={fadeUp}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            justifyContent: 'center',
            marginTop: 4,
          }}
        >
          {SOCIAL_LINKS.map(({ label, href, external, download }) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              {...(download ? { download: true } : {})}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '9px 18px',
                borderRadius: 50,
                border: '1px solid var(--border)',
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--text)',
                textDecoration: 'none',
                background: 'transparent',
                transition: 'background 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              {label}
              {download && <Download size={12} strokeWidth={2} />}
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
