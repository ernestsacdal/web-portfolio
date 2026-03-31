import Link from 'next/link'
import type { BlogPost } from '@/types'

interface LatestPostCardProps {
  post: BlogPost | null
}

export function LatestPostCard({ post }: LatestPostCardProps) {
  const tag = post?.tag ?? 'Coming soon'
  const title = post?.title ?? 'First post coming soon...'
  const readTime = post?.readTime ?? '5 min read · Draft'
  const slug = post?.slug

  return (
    <div
      className="bento-card"
      style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative' }}
    >
      <p
        style={{
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text2)',
        }}
      >
        Latest Post
      </p>

      {/* Tag pill */}
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
          alignSelf: 'flex-start',
        }}
      >
        {tag}
      </span>

      <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', lineHeight: 1.35, flex: 1 }}>
        {title}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: 12, color: 'var(--text2)' }}>{readTime}</p>
        {slug && (
          <Link
            href={`/blog/${slug}`}
            style={{ fontSize: 16, color: 'var(--text2)', textDecoration: 'none' }}
          >
            →
          </Link>
        )}
      </div>
    </div>
  )
}
