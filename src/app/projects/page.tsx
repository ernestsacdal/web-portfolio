import type { Metadata } from 'next'
import { getAllProjects } from '@/lib/mdx'
import { ProjectsClientGrid } from '@/components/sections/ProjectsClientGrid'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Selected work — full-stack applications, AI systems, and mobile apps.',
  openGraph: {
    title: 'Projects',
    description: 'Selected work — full-stack applications, AI systems, and mobile apps.',
  },
}

export default function ProjectsPage() {
  const projects = getAllProjects()

  return (
    <main style={{ padding: '6rem 1.25rem 6rem', maxWidth: 1280, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
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
          All Work
        </p>
        <h1
          style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
            fontWeight: 500,
            letterSpacing: '-0.025em',
            color: 'var(--text)',
            margin: 0,
          }}
        >
          Projects
        </h1>
      </div>

      <ProjectsClientGrid projects={projects} />
    </main>
  )
}
