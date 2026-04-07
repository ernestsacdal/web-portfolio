'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { BlogPost } from '@/types'

const TABS = ['All', 'AI', 'Engineering', 'Design']

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const itemVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

function PostCard({ post }: { post: BlogPost }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={`/blog/${post.slug}`}
      style={{ textDecoration: 'none', display: 'block', height: '100%' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          height: '100%',
          background: 'color-mix(in srgb, var(--text) 4%, transparent)',
          border: `0.5px solid ${hovered ? 'color-mix(in srgb, var(--text) 15%, transparent)' : 'var(--border)'}`,
          borderRadius: 12,
          padding: 22,
          transition: 'border-color 0.2s ease',
          cursor: 'pointer',
          boxSizing: 'border-box',
        }}
      >
        {/* Tag */}
        <span
          style={{
            fontSize: 10,
            fontWeight: 400,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'color-mix(in srgb, var(--text) 30%, transparent)',
          }}
        >
          {post.tag}
        </span>

        {/* Title */}
        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: 'var(--text)',
            lineHeight: 1.45,
            flex: 1,
            margin: 0,
          }}
        >
          {post.title}
        </p>

        {/* Description */}
        <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.55, margin: 0 }}>
          {post.description}
        </p>

        {/* Date · read time */}
        <p style={{ fontSize: 11, color: 'var(--text2)', margin: 0 }}>
          {new Date(post.date).toLocaleDateString('en-AU', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
          {'  ·  '}
          {post.readTime}
        </p>
      </div>
    </Link>
  )
}

export function BlogClientGrid({ posts }: { posts: BlogPost[] }) {
  const [activeTab, setActiveTab] = useState('All')
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)

  const filtered = activeTab === 'All' ? posts : posts.filter((p) => p.tag === activeTab)

  if (posts.length === 0) {
    return (
      <p style={{ color: 'var(--text2)', fontSize: 14, textAlign: 'center', padding: '4rem 0' }}>
        No posts yet. First one is coming soon.
      </p>
    )
  }

  return (
    <>
      {/* Filter tabs — matches ProjectsClientGrid exactly */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              onMouseEnter={() => setHoveredTab(tab)}
              onMouseLeave={() => setHoveredTab(null)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: isActive
                  ? '0.5px solid color-mix(in srgb, var(--text) 20%, transparent)'
                  : '0.5px solid transparent',
                background: 'transparent',
                color: isActive
                  ? 'color-mix(in srgb, var(--text) 80%, transparent)'
                  : hoveredTab === tab
                    ? 'color-mix(in srgb, var(--text) 60%, transparent)'
                    : 'color-mix(in srgb, var(--text) 35%, transparent)',
                fontSize: 12,
                fontWeight: 400,
                cursor: 'pointer',
                transition: 'color 0.15s ease',
              }}
            >
              {tab}
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
          <motion.div key={post.slug} variants={itemVariant}>
            <PostCard post={post} />
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <p style={{ color: 'var(--text2)', fontSize: 14, textAlign: 'center', padding: '3rem 0' }}>
          No posts tagged &ldquo;{activeTab}&rdquo;.
        </p>
      )}
    </>
  )
}
