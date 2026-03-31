import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/mdx'
import { BlogClientGrid } from '@/components/sections/BlogClientGrid'

export const metadata: Metadata = {
  title: 'Blog — Ernest Sacdal',
  description: 'Writing on engineering, AI, and design by Ernest Sacdal.',
  openGraph: {
    title: 'Blog — Ernest Sacdal',
    description: 'Writing on engineering, AI, and design by Ernest Sacdal.',
  },
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <main style={{ padding: '6rem 1.25rem 6rem', maxWidth: 1280, margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 32,
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
            Writing
          </p>
          <h1
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              margin: 0,
            }}
          >
            Blog
          </h1>
        </div>
        <Link
          href="/"
          style={{ fontSize: 13, fontWeight: 500, color: 'var(--text2)', textDecoration: 'none' }}
        >
          ← Back
        </Link>
      </div>

      <BlogClientGrid posts={posts} />
    </main>
  )
}
