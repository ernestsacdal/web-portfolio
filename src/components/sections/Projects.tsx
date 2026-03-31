'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

const PROJECTS = [
  {
    slug: 'pretriage',
    title: 'PreTriage',
    description:
      'AI-powered patient pre-triage system that assesses symptoms and prioritises care using LLMs.',
    tags: ['FastAPI', 'Next.js', 'Groq', 'AI'],
    status: 'live' as const,
    year: '2025',
    type: 'case-study' as const,
  },
  {
    slug: 'portfolio-v2',
    title: 'Portfolio v2',
    description:
      'This portfolio — Next.js, Apple-inspired design system, with an embedded AI assistant.',
    tags: ['Next.js', 'Design', 'Claude API'],
    status: 'wip' as const,
    year: '2025',
    type: 'minimal' as const,
  },
  {
    slug: 'tripview-clone',
    title: 'TripView Clone',
    description:
      'React Native public transit tracker for Sydney using Transport for NSW Open Data API.',
    tags: ['React Native', 'TfNSW API', 'Mobile'],
    status: 'planning' as const,
    year: '2025',
    type: 'minimal' as const,
  },
]

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  live: { bg: 'rgba(52,199,89,0.12)', color: '#34C759', label: 'Live' },
  wip: { bg: 'rgba(0,113,227,0.12)', color: '#0071E3', label: 'WIP' },
  planning: { bg: 'var(--bg3)', color: 'var(--text2)', label: 'Planning' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

export function Projects() {
  const router = useRouter()
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)

  return (
    <section
      id="projects"
      style={{ width: '100%', padding: '2rem 1.25rem 4rem', maxWidth: 1280, margin: '0 auto' }}
    >
      {/* Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 24,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text2)',
              marginBottom: 6,
            }}
          >
            Selected Work
          </p>
          <h2
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              margin: 0,
            }}
          >
            Projects
          </h2>
        </div>
        <Link
          href="/projects"
          style={{ fontSize: 13, fontWeight: 500, color: '#0071E3', textDecoration: 'none' }}
        >
          View all →
        </Link>
      </motion.div>

      {/* Rows — staggered */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        {PROJECTS.map((project, i) => {
          const isHovered = hoveredSlug === project.slug
          const badge = STATUS_STYLE[project.status]

          return (
            <motion.div
              key={project.slug}
              variants={fadeUp}
              onClick={() => router.push(`/projects/${project.slug}`)}
              onMouseEnter={() => setHoveredSlug(project.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
              style={{
                display: 'grid',
                gridTemplateColumns: '2.5rem 1fr auto',
                alignItems: 'start',
                gap: 12,
                padding: '16px 12px',
                borderRadius: 12,
                border: `1px solid ${isHovered ? 'var(--border)' : 'transparent'}`,
                background: isHovered ? 'var(--bg2)' : 'transparent',
                cursor: 'pointer',
                transition: 'background 0.2s ease, border-color 0.2s ease',
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'var(--text2)',
                  paddingTop: 3,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                0{i + 1}
              </span>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
                    {project.title}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      padding: '2px 8px',
                      borderRadius: 50,
                      background: badge.bg,
                      color: badge.color,
                    }}
                  >
                    {badge.label}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text2)' }}>{project.year}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.55, margin: 0 }}>
                  {project.description}
                </p>
                <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: 11,
                        color: 'var(--text2)',
                        background: 'var(--bg3)',
                        padding: '3px 8px',
                        borderRadius: 50,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <span
                style={{
                  fontSize: 18,
                  color: 'var(--text2)',
                  paddingTop: 2,
                  transform: isHovered ? 'translate(3px, -3px)' : 'translate(0, 0)',
                  transition: 'transform 0.2s ease',
                  display: 'inline-block',
                }}
              >
                ↗
              </span>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
