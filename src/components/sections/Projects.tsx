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

const STATUS_LABEL: Record<string, string> = {
  live: 'Live',
  wip: 'WIP',
  planning: 'Planning',
  nda: 'NDA',
}

function StatusLabel({ status }: { status: string }) {
  return (
    <span
      style={{
        fontSize: 11,
        color: 'var(--text2)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        flexShrink: 0,
      }}
    >
      {status === 'live' && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#4ade80',
            flexShrink: 0,
            display: 'inline-block',
          }}
        />
      )}
      {STATUS_LABEL[status] ?? status}
    </span>
  )
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
  const [featuredHovered, setFeaturedHovered] = useState(false)
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)

  const featured = PROJECTS[0]
  const rest = PROJECTS.slice(1)

  return (
    <section
      id="projects"
      className="min-h-screen flex flex-col justify-center"
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

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        {/* Featured card */}
        <motion.div
          variants={fadeUp}
          onClick={() => router.push(`/projects/${featured.slug}`)}
          onMouseEnter={() => setFeaturedHovered(true)}
          onMouseLeave={() => setFeaturedHovered(false)}
          style={{
            position: 'relative',
            background: 'rgba(255,255,255,0.04)',
            border: `0.5px solid ${featuredHovered ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 12,
            padding: 22,
            cursor: 'pointer',
            transition: 'border-color 0.2s ease',
          }}
        >
          {/* Eyebrow + arrow row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text2)',
              }}
            >
              Featured · {featured.year}
            </span>
            <span
              style={{
                fontSize: 16,
                color: 'var(--text2)',
                transform: featuredHovered ? 'translate(3px, -3px)' : 'translate(0, 0)',
                transition: 'transform 0.2s ease',
                display: 'inline-block',
              }}
            >
              ↗
            </span>
          </div>

          {/* Title + status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
              {featured.title}
            </span>
            <StatusLabel status={featured.status} />
          </div>

          {/* Description */}
          <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.55, margin: '0 0 10px' }}>
            {featured.description}
          </p>

          {/* Tags — plain text */}
          <p style={{ fontSize: 11, color: 'var(--text2)', margin: 0 }}>
            {featured.tags.join('  ·  ')}
          </p>
        </motion.div>

        {/* Numbered list */}
        <motion.div variants={fadeUp} style={{ display: 'flex', flexDirection: 'column' }}>
          {rest.map((project, i) => {
            const isHovered = hoveredSlug === project.slug

            return (
              <div
                key={project.slug}
                onClick={() => router.push(`/projects/${project.slug}`)}
                onMouseEnter={() => setHoveredSlug(project.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '12px 8px',
                  borderBottom: '0.5px solid rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                  background: isHovered ? 'rgba(255,255,255,0.03)' : 'transparent',
                  borderRadius: 6,
                }}
              >
                {/* Index */}
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: 'var(--text2)',
                    fontVariantNumeric: 'tabular-nums',
                    flexShrink: 0,
                    width: '2rem',
                    paddingTop: 2,
                  }}
                >
                  0{i + 2}
                </span>

                {/* Title + tags column */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>
                      {project.title}
                    </span>
                    <StatusLabel status={project.status} />
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text2)', margin: 0 }}>
                    {project.tags.join('  ·  ')}
                  </p>
                </div>

                {/* Year + arrow */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    flexShrink: 0,
                    paddingTop: 2,
                  }}
                >
                  <span style={{ fontSize: 11, color: 'var(--text2)' }}>{project.year}</span>
                  <span
                    style={{
                      fontSize: 16,
                      color: 'var(--text2)',
                      transform: isHovered ? 'translate(3px, -3px)' : 'translate(0, 0)',
                      transition: 'transform 0.2s ease',
                      display: 'inline-block',
                    }}
                  >
                    ↗
                  </span>
                </div>
              </div>
            )
          })}
        </motion.div>
      </motion.div>
    </section>
  )
}
