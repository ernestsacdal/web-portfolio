'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const FEATURED = {
  slug: 'groq-vs-openai-pretriage',
  title: "Why I chose Groq for PreTriage — and what I'd use in production",
  description:
    "Speed isn't just a performance metric in a clinical context — it's a UX requirement.",
  date: 'Apr 7, 2026',
  tag: 'AI',
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export function Blog() {
  const [cardHovered, setCardHovered] = useState(false)
  const [viewAllHovered, setViewAllHovered] = useState(false)

  return (
    <section
      id="blog"
      className="min-h-screen flex flex-col justify-center"
      style={{ width: '100%', padding: '2rem 1.25rem 6rem', maxWidth: 1280, margin: '0 auto' }}
    >
      {/* Header */}
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

      {/* Featured card */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <Link
          href={`/blog/${FEATURED.slug}`}
          style={{ textDecoration: 'none', display: 'block' }}
          onMouseEnter={() => setCardHovered(true)}
          onMouseLeave={() => setCardHovered(false)}
        >
          <div
            style={{
              position: 'relative',
              background: 'color-mix(in srgb, var(--text) 4%, transparent)',
              border: `0.5px solid ${cardHovered ? 'color-mix(in srgb, var(--text) 15%, transparent)' : 'var(--border)'}`,
              borderRadius: 12,
              padding: 22,
              cursor: 'pointer',
              transition: 'border-color 0.2s ease',
            }}
          >
            {/* Top row: tag + date */}
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
                {FEATURED.tag}
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: 'color-mix(in srgb, var(--text) 30%, transparent)',
                }}
              >
                {FEATURED.date}
              </span>
            </div>

            {/* Title */}
            <p
              style={{
                fontSize: 20,
                fontWeight: 400,
                color: 'var(--text)',
                lineHeight: 1.4,
                margin: '0 0 10px',
              }}
            >
              {FEATURED.title}
            </p>

            {/* Teaser */}
            <p
              style={{
                fontSize: 13,
                color: 'var(--text2)',
                lineHeight: 1.55,
                margin: '0 0 16px',
              }}
            >
              {FEATURED.description}
            </p>

            {/* Arrow */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <span
                style={{
                  fontSize: 13,
                  color: cardHovered
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
    </section>
  )
}
