'use client'

import { motion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'

const fadeUpVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

interface FadeInProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function FadeIn({ children, className, style }: FadeInProps) {
  return (
    <motion.div
      variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}
