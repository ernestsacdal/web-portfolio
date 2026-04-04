'use client'

import { useState } from 'react'

interface ProjectLinkButtonProps {
  href: string
  label: string
}

export function ProjectLinkButton({ href, label }: ProjectLinkButtonProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `0.5px solid ${hovered ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: 6,
        padding: '8px 16px',
        fontSize: 11,
        color: hovered ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.5)',
        textDecoration: 'none',
        transition: 'border-color 0.15s ease, color 0.15s ease',
        display: 'inline-block',
      }}
    >
      {label}
    </a>
  )
}
