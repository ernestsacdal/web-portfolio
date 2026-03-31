'use client'

import { motion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'

const containerVariant = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const itemVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

interface MotionProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function StaggerGrid({ children, className, style }: MotionProps) {
  return (
    <motion.div
      variants={containerVariant}
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

export function StaggerItem({ children, className, style }: MotionProps) {
  return (
    <motion.div variants={itemVariant} className={className} style={style}>
      {children}
    </motion.div>
  )
}
