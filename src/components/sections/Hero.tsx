'use client'

import { motion } from 'framer-motion'
import { Mail, FileText } from 'lucide-react'
import { siGithub } from 'simple-icons'

// LinkedIn was removed from simple-icons; use the official path directly
const siLinkedin = {
  path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  title: 'LinkedIn',
}

type SimpleIcon = { path: string; title: string }
type LucideIcon = React.ComponentType<{ size?: number; strokeWidth?: number }>
type SocialLink = {
  label: string
  href: string
  external?: boolean
  download?: boolean
  simpleIcon?: SimpleIcon
  lucideIcon?: LucideIcon
}

const SOCIAL_LINKS: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/ernestsacdal', external: true, simpleIcon: siGithub },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/ernestsacdal', external: true, simpleIcon: siLinkedin },
  { label: 'Email', href: 'mailto:ernest@ernestsacdal.com', lucideIcon: Mail },
  { label: 'CV', href: '/cv.pdf', download: true, lucideIcon: FileText },
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
          <span style={{ color: 'var(--text2)' }}>Mikhail</span>
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
            Software Engineer
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
          {SOCIAL_LINKS.map(({ label, href, external, download, simpleIcon, lucideIcon: LucideIcon }) => (
            <a
              key={label}
              href={href}
              title={label}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              {...(download ? { download: true } : {})}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                textDecoration: 'none',
                background: 'transparent',
                transition: 'background 0.2s ease',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              {simpleIcon && (
                <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true">
                  <path d={simpleIcon.path} />
                </svg>
              )}
              {LucideIcon && <LucideIcon size={16} strokeWidth={1.75} />}
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
