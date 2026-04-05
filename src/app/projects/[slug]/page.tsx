import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllProjects, getProjectBySlug } from '@/lib/mdx'
import { ProjectLinkButton } from '@/components/sections/ProjectLinkButton'

function deriveCategory(tags: string[]): string {
  if (tags.some((t) => /^ai$|ml/i.test(t) || t.toLowerCase() === 'ai')) return 'AI / ML'
  if (tags.some((t) => /full.?stack|next\.?js|fastapi/i.test(t))) return 'Full-Stack'
  if (tags.some((t) => /client/i.test(t))) return 'Client'
  return tags[0] ?? ''
}

function InlineList({ children }: { children: React.ReactNode }) {
  const items = React.Children.toArray(children).filter(React.isValidElement)
  return (
    <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.75, margin: 0 }}>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && ' — '}
          {(item as React.ReactElement<{ children: React.ReactNode }>).props.children}
        </React.Fragment>
      ))}
    </p>
  )
}

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

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params

  let meta, content
  try {
    ;({ meta, content } = getProjectBySlug(slug))
  } catch {
    notFound()
  }

  const isCaseStudy = meta.type === 'case-study'

  return (
    <main style={{ padding: '5rem 1.25rem 6rem', maxWidth: 760, margin: '0 auto' }}>
      {/* Back */}
      <Link href="/projects" className="back-link" style={{ marginBottom: 40 }}>
        ‹ Projects
      </Link>

      {/* Eyebrow */}
      <p
        style={{
          fontSize: 10,
          fontWeight: 400,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'color-mix(in srgb, var(--text) 30%, transparent)',
          marginBottom: 12,
          margin: '0 0 12px',
        }}
      >
        {deriveCategory(meta.tags)} · {meta.year}
      </p>

      {/* Title */}
      <h1
        style={{
          fontSize: 'clamp(1.75rem, 4vw, 2rem)',
          fontWeight: 500,
          letterSpacing: '-0.02em',
          color: 'var(--text)',
          lineHeight: 1.15,
          marginBottom: 16,
        }}
      >
        {meta.title}
      </h1>

      {/* Description */}
      <p
        style={{
          fontSize: 13,
          color: 'var(--text2)',
          lineHeight: 1.75,
          maxWidth: '65ch',
          marginBottom: 32,
        }}
      >
        {meta.description}
      </p>

      {/* Divider */}
      <div
        style={{
          height: 0,
          borderBottom: '0.5px solid var(--border)',
          marginBottom: 40,
        }}
      />

      {/* Overview section */}
      <div style={{ marginBottom: 40 }}>
        <p
          style={{
            fontSize: 10,
            fontWeight: 400,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text2)',
            marginBottom: 12,
          }}
        >
          Overview
        </p>
        <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.75, margin: 0 }}>
          {meta.description}
        </p>
      </div>

      {/* Stack section */}
      <div style={{ marginBottom: 40 }}>
        <p
          style={{
            fontSize: 10,
            fontWeight: 400,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text2)',
            marginBottom: 12,
          }}
        >
          Stack
        </p>
        <p style={{ fontSize: 11, color: 'var(--text2)', margin: 0 }}>
          {meta.tags.join('  ·  ')}
        </p>
      </div>

      {/* What I built — case study MDX only, hidden if content is empty */}
      {isCaseStudy && content && content.trim() && (
        <div style={{ marginBottom: 40 }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 400,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text2)',
              marginBottom: 16,
            }}
          >
            What I Built
          </p>
          <div className="prose">
            <MDXRemote source={content} components={{ ul: InlineList }} />
          </div>
        </div>
      )}

      {/* Screenshot — only if coverImage is a valid non-empty string */}
      {meta.coverImage && meta.coverImage.trim() !== '' && (
        <div
          style={{
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: '0.75rem',
            overflow: 'hidden',
            position: 'relative',
            marginBottom: 40,
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

      {/* Footer */}
      {(meta.liveUrl || meta.githubUrl) && (
        <>
          <div
            style={{
              height: 0,
              borderBottom: '0.5px solid var(--border)',
              marginBottom: 24,
            }}
          />
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {meta.liveUrl && (
              <ProjectLinkButton href={meta.liveUrl} label="↗ Live demo" />
            )}
            {meta.githubUrl && (
              <ProjectLinkButton href={meta.githubUrl} label="GitHub" />
            )}
          </div>
        </>
      )}
    </main>
  )
}
