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
      'PreTriage guides patients through a voice-assisted intake before their appointment — so clinicians start every consult with full context, not blank questions.',
    tags: ['Next.js', 'FastAPI', 'ElevenLabs', 'Anthropic'],
    status: 'live' as const,
    year: '2026',
    type: 'case-study' as const,
  },
  {
    slug: 'niks-automotive',
    title: "Nik's Automotive",
    description:
      'Full-stack booking site for a mobile mechanic business — appointment scheduling via Supabase, email notifications via Resend, and an owner dashboard.',
    tags: ['Next.js', 'Supabase', 'Resend', 'Client'],
    status: 'live' as const,
    year: '2026',
    type: 'case-study' as const,
  },
  {
    slug: 'proposal-ai',
    title: 'ProposalAI',
    description:
      'AI-powered agent that generates end-to-end project proposals from user input — LangChain orchestration, OpenAI for content generation, and ElevenLabs for voice interaction.',
    tags: ['Next.js', 'LangChain', 'OpenAI', 'ElevenLabs'],
    status: 'nda' as const,
    year: '2024',
    type: 'case-study' as const,
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
  const [viewAllHovered, setViewAllHovered] = useState(false)

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
              fontWeight: 400,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'color-mix(in srgb, var(--text) 30%, transparent)',
              marginBottom: 6,
            }}
          >
            Selected Work
          </p>
          <h2
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
              fontWeight: 500,
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
          onMouseEnter={() => setViewAllHovered(true)}
          onMouseLeave={() => setViewAllHovered(false)}
          style={{
            fontSize: 13,
            fontWeight: 400,
            color: viewAllHovered
              ? 'color-mix(in srgb, var(--text) 70%, transparent)'
              : 'color-mix(in srgb, var(--text) 40%, transparent)',
            textDecoration: 'none',
            transition: 'color 0.15s ease',
          }}
        >
          View all ›
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
            background: 'color-mix(in srgb, var(--text) 4%, transparent)',
            border: `0.5px solid ${featuredHovered ? 'color-mix(in srgb, var(--text) 15%, transparent)' : 'var(--border)'}`,
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
                fontWeight: 400,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'color-mix(in srgb, var(--text) 30%, transparent)',
              }}
            >
              Featured · {featured.year}
            </span>
            <span
              style={{
                fontSize: 13,
                color: featuredHovered
                  ? 'color-mix(in srgb, var(--text) 50%, transparent)'
                  : 'color-mix(in srgb, var(--text) 20%, transparent)',
                transition: 'color 0.2s ease',
                display: 'inline-block',
              }}
            >
              ›
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
                  borderBottom: '0.5px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                  background: isHovered ? 'color-mix(in srgb, var(--text) 3%, transparent)' : 'transparent',
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
                      fontSize: 13,
                      color: isHovered
                        ? 'color-mix(in srgb, var(--text) 50%, transparent)'
                        : 'color-mix(in srgb, var(--text) 20%, transparent)',
                      transition: 'color 0.2s ease',
                      display: 'inline-block',
                    }}
                  >
                    ›
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
