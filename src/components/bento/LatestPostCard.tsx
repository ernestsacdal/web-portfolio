import Link from 'next/link'
import type { BlogPost } from '@/types'

interface LatestPostCardProps {
  post: BlogPost | null
}

export function LatestPostCard({ post }: LatestPostCardProps) {
  const tag = post?.tag ?? 'Coming soon'
  const title = post?.title ?? 'First post coming soon...'
  const slug = post?.slug

  return (
    <div
      className="bento-card"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 1.25rem',
      }}
    >
      {/* Label */}
      <p
        className="hidden sm:block"
        style={{
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text2)',
          flexShrink: 0,
        }}
      >
        Latest Post
      </p>

      {/* Divider */}
      <div className="hidden sm:block" style={{ width: 1, height: 16, background: 'var(--border)', flexShrink: 0 }} />

      {/* Tag */}
      <span
        style={{
          padding: '2px 8px',
          borderRadius: 50,
          background: 'rgba(0,113,227,0.12)',
          border: '1px solid rgba(0,113,227,0.25)',
          fontSize: 10,
          fontWeight: 500,
          color: '#0071E3',
          flexShrink: 0,
        }}
      >
        {tag}
      </span>

      {/* Title */}
      <p
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--text)',
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {title}
      </p>

      {/* Arrow link */}
      {slug && (
        <Link
          href={`/blog/${slug}`}
          style={{ fontSize: 16, color: 'var(--text2)', textDecoration: 'none', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 44, minHeight: 44 }}
        >
          →
        </Link>
      )}
    </div>
  )
}
