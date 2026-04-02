'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { Project } from '@/types'

const FILTER_TAGS = ['All', 'AI', 'Full-Stack', 'Mobile', 'Backend']

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  live: { bg: 'rgba(52,199,89,0.12)', color: '#34C759', label: 'Live' },
  wip: { bg: 'rgba(0,113,227,0.12)', color: '#0071E3', label: 'WIP' },
  planning: { bg: 'var(--bg3)', color: 'var(--text2)', label: 'Planning' },
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
}

interface ProjectsClientGridProps {
  projects: Project[]
}

export function ProjectsClientGrid({ projects }: ProjectsClientGridProps) {
  const router = useRouter()
  const [activeTag, setActiveTag] = useState('All')
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)

  const filtered =
    activeTag === 'All'
      ? projects
      : projects.filter((p) =>
          p.tags.some((t) => t.toLowerCase().includes(activeTag.toLowerCase())),
        )

  return (
    <>
      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {FILTER_TAGS.map((tag) => {
          const isActive = activeTag === tag
          return (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              style={{
                padding: '10px 16px',
                borderRadius: 50,
                border: `1px solid ${isActive ? 'transparent' : 'var(--border)'}`,
                background: isActive ? '#0071E3' : 'transparent',
                color: isActive ? '#fff' : 'var(--text2)',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {tag}
            </button>
          )
        })}
      </div>

      {/* Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
          gap: 10,
        }}
      >
        {filtered.map((project) => {
          const badge = STATUS_STYLE[project.status]
          const isHovered = hoveredSlug === project.slug

          return (
            <motion.div
              key={project.slug}
              variants={item}
              onClick={() => router.push(`/projects/${project.slug}`)}
              onMouseEnter={() => setHoveredSlug(project.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
              style={{
                background: 'var(--bg2)',
                border: `1px solid ${isHovered ? 'var(--border)' : 'transparent'}`,
                borderRadius: '1.25rem',
                overflow: 'hidden',
                cursor: 'pointer',
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
              }}
            >
              {/* Cover image area */}
              <div
                style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  background: 'var(--bg3)',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {project.coverImage && (
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                )}
              </div>

              {/* Card body */}
              <div style={{ padding: '1rem 1.25rem 1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
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
                </div>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.55, margin: '0 0 12px' }}>
                  {project.description}
                </p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
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
            </motion.div>
          )
        })}
      </motion.div>

      {filtered.length === 0 && (
        <p style={{ color: 'var(--text2)', fontSize: 14, textAlign: 'center', padding: '3rem 0' }}>
          No projects found for &ldquo;{activeTag}&rdquo;.
        </p>
      )}
    </>
  )
}
