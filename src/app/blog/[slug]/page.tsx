import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllPosts, getPostBySlug } from '@/lib/mdx'
import { ReadingProgress } from '@/components/ui/ReadingProgress'

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} — Ernest Sacdal`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) notFound()

  const allPosts = getAllPosts()
  const idx = allPosts.findIndex((p) => p.slug === slug)
  const prev = allPosts[idx + 1] ?? null
  const next = allPosts[idx - 1] ?? null

  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  return (
    <>
      <ReadingProgress />

      <main style={{ padding: '5rem 1.25rem 6rem', maxWidth: 760, margin: '0 auto' }}>
        {/* Back */}
        <Link
          href="/blog"
          style={{
            fontSize: 13,
            color: 'var(--text2)',
            textDecoration: 'none',
            display: 'inline-block',
            marginBottom: 32,
          }}
        >
          ← Blog
        </Link>

        {/* Tag pill */}
        {post.tag && (
          <div style={{ marginBottom: 16 }}>
            <span
              style={{
                display: 'inline-block',
                padding: '3px 10px',
                borderRadius: 50,
                background: 'rgba(0,113,227,0.12)',
                border: '1px solid rgba(0,113,227,0.25)',
                fontSize: 11,
                fontWeight: 500,
                color: '#0071E3',
              }}
            >
              {post.tag}
            </span>
          </div>
        )}

        {/* Title */}
        <h1
          style={{
            fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            lineHeight: 1.15,
            maxWidth: 720,
            marginBottom: 16,
          }}
        >
          {post.title}
        </h1>

        {/* Meta */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: 14, color: 'var(--text2)' }}>{formattedDate}</span>
          <span style={{ fontSize: 14, color: 'var(--text2)' }}>{post.readTime}</span>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--border)', marginBottom: 40 }} />

        {/* Content */}
        <div className="prose" style={{ maxWidth: 680 }}>
          <MDXRemote source={post.content} />
        </div>

        {/* Bottom nav */}
        <div
          style={{
            marginTop: 64,
            paddingTop: 32,
            borderTop: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          <Link
            href="/blog"
            style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none' }}
          >
            ← Back to blog
          </Link>

          {(prev || next) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                {prev && (
                  <Link href={`/blog/${prev.slug}`} style={{ textDecoration: 'none' }}>
                    <p style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>← Previous</p>
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{prev.title}</p>
                  </Link>
                )}
              </div>
              <div className="sm:text-right">
                {next && (
                  <Link href={`/blog/${next.slug}`} style={{ textDecoration: 'none' }}>
                    <p style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Next →</p>
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{next.title}</p>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
