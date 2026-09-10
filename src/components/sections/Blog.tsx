'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { BlogPost } from '@/types'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

function formatDate(iso: string): string {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}

interface BlogProps {
  posts: BlogPost[]
}

export function Blog({ posts }: BlogProps) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)
  const [viewAllHovered, setViewAllHovered] = useState(false)

  if (!posts.length) return null

  return (
    <section
      id="blog"
      style={{
        width: '100%',
        padding: 'clamp(3.5rem, 6vw, 5rem) 1.25rem',
        maxWidth: 1280,
        margin: '0 auto',
      }}
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
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
              fontWeight: 400,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'color-mix(in srgb, var(--text) 30%, transparent)',
              marginBottom: 6,
            }}
          >
            Writing
          </p>
          <h2
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
              fontWeight: 500,
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
          onMouseEnter={() => setViewAllHovered(true)}
          onMouseLeave={() => setViewAllHovered(false)}
          style={{
            fontSize: 13,
            fontWeight: 400,
            color: viewAllHovered
              ? 'color-mix(in srgb, var(--text) 70%, transparent)'
              : 'color-mix(in srgb, var(--text) 40%, transparent)',
            textDecoration: 'none',
            transition: 'color 0.15s ease',
          }}
        >
          View all ›
        </Link>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {posts.map((post) => {
          const isHovered = hoveredSlug === post.slug
          return (
            <motion.div key={post.slug} variants={fadeUp}>
              <Link
                href={`/blog/${post.slug}`}
                style={{ textDecoration: 'none', display: 'block', height: '100%' }}
                onMouseEnter={() => setHoveredSlug(post.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
              >
                <div
                  style={{
                    position: 'relative',
                    background: 'color-mix(in srgb, var(--text) 4%, transparent)',
                    border: `0.5px solid ${isHovered ? 'color-mix(in srgb, var(--text) 15%, transparent)' : 'var(--border)'}`,
                    borderRadius: 12,
                    padding: 22,
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    minHeight: 200,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 14,
                    }}
                  >
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
                    <span
                      style={{
                        fontSize: 12,
                        color: 'color-mix(in srgb, var(--text) 30%, transparent)',
                      }}
                    >
                      {formatDate(post.date)}
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: 17,
                      fontWeight: 400,
                      color: 'var(--text)',
                      lineHeight: 1.4,
                      margin: '0 0 10px',
                    }}
                  >
                    {post.title}
                  </p>

                  <p
                    style={{
                      fontSize: 13,
                      color: 'var(--text2)',
                      lineHeight: 1.55,
                      margin: '0 0 16px',
                      flex: 1,
                    }}
                  >
                    {post.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <span
                      style={{
                        fontSize: 13,
                        color: isHovered
                          ? 'color-mix(in srgb, var(--text) 50%, transparent)'
                          : 'color-mix(in srgb, var(--text) 20%, transparent)',
                        transition: 'color 0.2s ease',
                        display: 'inline-block',
                      }}
                    >
                      ›
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
