import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllProjects, getProjectBySlug } from '@/lib/mdx'

export async function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }))
}

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const { meta } = getProjectBySlug(slug)
    return {
      title: `${meta.title} — Ernest Sacdal`,
      description: meta.description,
      openGraph: {
        title: meta.title,
        description: meta.description,
        type: 'website',
      },
    }
  } catch {
    return {}
  }
}

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  live: { bg: 'rgba(52,199,89,0.12)', color: '#34C759', label: 'Live' },
  wip: { bg: 'rgba(0,113,227,0.12)', color: '#0071E3', label: 'WIP' },
  planning: { bg: 'var(--bg3)', color: 'var(--text2)', label: 'Planning' },
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params

  let meta, content
  try {
    ;({ meta, content } = getProjectBySlug(slug))
  } catch {
    notFound()
  }

  const badge = STATUS_STYLE[meta.status]

  if (meta.type === 'case-study') {
    return (
      <main style={{ padding: '5rem 1.25rem 6rem', maxWidth: 760, margin: '0 auto' }}>
        {/* Back */}
        <Link
          href="/projects"
          style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', display: 'inline-block', marginBottom: 32 }}
        >
          ← Projects
        </Link>

        {/* Tag + year */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
          {meta.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 11,
                fontWeight: 500,
                padding: '3px 10px',
                borderRadius: 50,
                background: 'var(--bg3)',
                color: 'var(--text2)',
              }}
            >
              {tag}
            </span>
          ))}
          <span style={{ fontSize: 12, color: 'var(--text2)' }}>{meta.year}</span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            lineHeight: 1.1,
            marginBottom: 16,
          }}
        >
          {meta.title}
        </h1>

        {/* Description */}
        <p style={{ fontSize: '1.2rem', color: 'var(--text2)', lineHeight: 1.6, marginBottom: 24 }}>
          {meta.description}
        </p>

        {/* Status + links row */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              padding: '4px 12px',
              borderRadius: 50,
              background: badge.bg,
              color: badge.color,
            }}
          >
            {badge.label}
          </span>
          {meta.liveUrl && (
            <a
              href={meta.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 13, fontWeight: 500, color: '#0071E3', textDecoration: 'none' }}
            >
              ↗ Live site
            </a>
          )}
          {meta.githubUrl && (
            <a
              href={meta.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 13, fontWeight: 500, color: 'var(--text2)', textDecoration: 'none' }}
            >
              GitHub →
            </a>
          )}
        </div>

        {/* Cover image */}
        {meta.coverImage && (
          <div
            style={{
              width: '100%',
              aspectRatio: '16/9',
              borderRadius: '1rem',
              overflow: 'hidden',
              background: 'var(--bg3)',
              marginBottom: 40,
              position: 'relative',
            }}
          >
            <Image
              src={meta.coverImage}
              alt={meta.title}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        )}
        {!meta.coverImage && (
          <div
            style={{
              width: '100%',
              aspectRatio: '16/9',
              borderRadius: '1rem',
              background: 'var(--bg3)',
              marginBottom: 40,
            }}
          />
        )}

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--border)', marginBottom: 40 }} />

        {/* MDX content */}
        <div className="prose">
          <MDXRemote source={content} />
        </div>

        {/* Tech stack */}
        <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text2)', marginBottom: 12 }}>
            Tech Stack
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {meta.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  padding: '5px 12px',
                  borderRadius: 50,
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        {(meta.liveUrl || meta.githubUrl) && (
          <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
            {meta.liveUrl && (
              <a
                href={meta.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '10px 20px',
                  borderRadius: 50,
                  background: '#0071E3',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                View Live ↗
              </a>
            )}
            {meta.githubUrl && (
              <a
                href={meta.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '10px 20px',
                  borderRadius: 50,
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                GitHub →
              </a>
            )}
          </div>
        )}
      </main>
    )
  }

  // Minimal layout
  return (
    <main style={{ padding: '5rem 1.25rem 6rem', maxWidth: 760, margin: '0 auto' }}>
      {/* Back */}
      <Link
        href="/projects"
        style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', display: 'inline-block', marginBottom: 32 }}
      >
        ← Projects
      </Link>

      {/* Tag + year */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
        {meta.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: 11,
              fontWeight: 500,
              padding: '3px 10px',
              borderRadius: 50,
              background: 'var(--bg3)',
              color: 'var(--text2)',
            }}
          >
            {tag}
          </span>
        ))}
        <span style={{ fontSize: 12, color: 'var(--text2)' }}>{meta.year}</span>
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: 'var(--text)',
          lineHeight: 1.1,
          marginBottom: 16,
        }}
      >
        {meta.title}
      </h1>

      {/* Description */}
      <p style={{ fontSize: '1rem', color: 'var(--text2)', lineHeight: 1.75, marginBottom: 28 }}>
        {meta.description}
      </p>

      {/* Tech stack */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {meta.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: 12,
              fontWeight: 500,
              padding: '5px 12px',
              borderRadius: 50,
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Links */}
      <div style={{ display: 'flex', gap: 12 }}>
        {meta.liveUrl && (
          <a
            href={meta.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '10px 20px',
              borderRadius: 50,
              background: '#0071E3',
              color: '#fff',
              fontSize: 13,
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            View Live ↗
          </a>
        )}
        {meta.githubUrl && (
          <a
            href={meta.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '10px 20px',
              borderRadius: 50,
              border: '1px solid var(--border)',
              color: 'var(--text)',
              fontSize: 13,
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            GitHub →
          </a>
        )}
      </div>
    </main>
  )
}
