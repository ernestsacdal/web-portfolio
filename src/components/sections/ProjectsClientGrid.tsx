'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Project } from '@/types'

const FILTER_TABS = ['All', 'AI / ML', 'Full-Stack', 'Client']

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

function filterProjects(projects: Project[], activeTab: string): Project[] {
  if (activeTab === 'All') return projects
  if (activeTab === 'AI / ML')
    return projects.filter((p) =>
      p.tags.some((t) => /^ai$|ml/i.test(t) || t.toLowerCase() === 'ai'),
    )
  if (activeTab === 'Full-Stack')
    return projects.filter((p) =>
      p.tags.some((t) => /full.?stack|next\.?js|fastapi/i.test(t)),
    )
  if (activeTab === 'Client')
    return projects.filter((p) => p.tags.some((t) => /client/i.test(t)))
  return projects
}

interface ProjectsClientGridProps {
  projects: Project[]
}

export function ProjectsClientGrid({ projects }: ProjectsClientGridProps) {
  const [activeTab, setActiveTab] = useState('All')
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)

  const filtered = filterProjects(projects, activeTab)

  return (
    <>
      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
        {FILTER_TABS.map((tab) => {
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '6px 14px',
                borderRadius: 50,
                border: `0.5px solid ${isActive ? 'var(--border)' : 'var(--border)'}`,
                background: isActive ? 'var(--bg2)' : 'transparent',
                color: isActive ? 'var(--text)' : 'var(--text2)',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab}
            </button>
          )
        })}
      </div>

      {/* Rows */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {filtered.map((project, i) => {
          const isHovered = hoveredSlug === project.slug
          const category = project.tags[0] ?? ''

          return (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              onMouseEnter={() => setHoveredSlug(project.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 10px',
                borderBottom: '0.5px solid var(--border)',
                background: isHovered ? 'var(--bg2)' : 'transparent',
                transition: 'background 0.15s ease',
                textDecoration: 'none',
                borderRadius: 4,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: 'var(--text2)',
                  fontVariantNumeric: 'tabular-nums',
                  flexShrink: 0,
                  width: '2.5rem',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'var(--text)',
                  whiteSpace: 'nowrap',
                }}
              >
                {project.title}
              </span>

              <StatusLabel status={project.status} />

              <span style={{ flex: 1 }} />

              <span
                style={{
                  fontSize: 11,
                  color: 'var(--text2)',
                  whiteSpace: 'nowrap',
                }}
              >
                {category}
              </span>

              <span
                style={{
                  fontSize: 11,
                  color: 'var(--text2)',
                  whiteSpace: 'nowrap',
                  minWidth: '2.5rem',
                  textAlign: 'right',
                }}
              >
                {project.year}
              </span>

              <span
                style={{
                  fontSize: 14,
                  color: 'var(--text2)',
                  transform: isHovered ? 'translate(3px, -3px)' : 'translate(0, 0)',
                  transition: 'transform 0.2s ease',
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              >
                ↗
              </span>
            </Link>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: 'var(--text2)', fontSize: 13, textAlign: 'center', padding: '3rem 0' }}>
          No projects in &ldquo;{activeTab}&rdquo;.
        </p>
      )}
    </>
  )
}
