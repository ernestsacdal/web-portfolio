import Link from 'next/link'
import { getAllPosts } from '@/lib/mdx'
import { FadeIn } from '@/components/ui/FadeIn'
import { StaggerGrid, StaggerItem } from '@/components/ui/StaggerGrid'
import type { BlogPost } from '@/types'

const PLACEHOLDER_CARDS: BlogPost[] = [
  { slug: '', title: 'Coming soon', description: 'First post is in the works.', date: '', tag: 'Engineering', readTime: '—', published: false },
  { slug: '', title: 'Coming soon', description: 'More writing on the way.', date: '', tag: 'AI', readTime: '—', published: false },
  { slug: '', title: 'Coming soon', description: 'Stay tuned.', date: '', tag: 'Design', readTime: '—', published: false },
]

function BlogCard({ post }: { post: BlogPost }) {
  const content = (
    <div
      className="bento-card"
      style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}
    >
      <span
        style={{
          display: 'inline-block',
          alignSelf: 'flex-start',
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

      <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', lineHeight: 1.45, flex: 1 }}>
        {post.title}
      </p>

      <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{post.description}</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: 'var(--text2)' }}>
          {post.date
            ? new Date(post.date).toLocaleDateString('en-AU', { year: 'numeric', month: 'short', day: 'numeric' })
            : 'Draft'}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text2)' }}>{post.readTime}</span>
      </div>
    </div>
  )

  if (!post.slug) return <div style={{ height: '100%' }}>{content}</div>

  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      {content}
    </Link>
  )
}

export function Blog() {
  const posts = getAllPosts()
  const cards = posts.length > 0 ? posts.slice(0, 3) : PLACEHOLDER_CARDS

  return (
    <section
      id="blog"
      className="min-h-screen flex flex-col justify-center"
      style={{ width: '100%', padding: '2rem 1.25rem 6rem', maxWidth: 1280, margin: '0 auto' }}
    >
      <FadeIn>
        <div
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
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text2)',
                marginBottom: 6,
              }}
            >
              Writing
            </p>
            <h2
              style={{
                fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                color: 'var(--text)',
                margin: 0,
              }}
            >
              Blog
            </h2>
          </div>
          <Link
            href="/blog"
            style={{ fontSize: 13, fontWeight: 500, color: '#0071E3', textDecoration: 'none' }}
          >
            All posts →
          </Link>
        </div>
      </FadeIn>

      <StaggerGrid
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))',
          gap: 10,
        }}
      >
        {cards.map((post, i) => (
          <StaggerItem key={post.slug || i}>
            <BlogCard post={post} />
          </StaggerItem>
        ))}
      </StaggerGrid>
    </section>
  )
}
