'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { BlogPost } from '@/types'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

interface BlogClientGridProps {
  posts: BlogPost[]
}

export function BlogClientGrid({ posts }: BlogClientGridProps) {
  const allTags = ['All', ...Array.from(new Set(posts.map((p) => p.tag).filter(Boolean)))]
  const [activeTag, setActiveTag] = useState('All')

  const filtered = activeTag === 'All' ? posts : posts.filter((p) => p.tag === activeTag)

  if (posts.length === 0) {
    return (
      <p style={{ color: 'var(--text2)', fontSize: 14, textAlign: 'center', padding: '4rem 0' }}>
        No posts yet. First one is coming soon.
      </p>
    )
  }

  return (
    <>
      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {allTags.map((tag) => {
          const isActive = activeTag === tag
          return (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              style={{
                padding: '7px 16px',
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
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 10,
        }}
      >
        {filtered.map((post) => (
          <motion.div key={post.slug} variants={item}>
            <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
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

                <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
                  {post.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--text2)' }}>
                    {new Date(post.date).toLocaleDateString('en-AU', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text2)' }}>{post.readTime}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <p style={{ color: 'var(--text2)', fontSize: 14, textAlign: 'center', padding: '3rem 0' }}>
          No posts tagged &ldquo;{activeTag}&rdquo;.
        </p>
      )}
    </>
  )
}
