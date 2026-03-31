'use client'

import {
  siNextdotjs,
  siFastapi,
  siPython,
  siReact,
  siTypescript,
  siDocker,
  siLangchain,
  siPostgresql,
  siTailwindcss,
  siAnthropic,
  siGithub,
  siVercel,
} from 'simple-icons'
import { useTheme } from '@/lib/theme'

const ICONS = [
  siNextdotjs,
  siFastapi,
  siPython,
  siReact,
  siTypescript,
  siDocker,
  siLangchain,
  siPostgresql,
  siTailwindcss,
  siAnthropic,
  siGithub,
  siVercel,
]

// Double the array for seamless marquee loop
const MARQUEE_ICONS = [...ICONS, ...ICONS]

export function TechStackCard() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const fill = isDark ? '#ffffff' : '#1d1d1f'

  return (
    <div className="bento-card" style={{ overflow: 'hidden' }}>
      <p
        style={{
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text2)',
          marginBottom: 16,
        }}
      >
        Tech Stack
      </p>

      {/* Marquee wrapper with fade mask */}
      <div
        style={{
          overflow: 'hidden',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}
      >
        <div
          className="animate-marquee"
          style={{
            display: 'flex',
            gap: 24,
            width: 'max-content',
            alignItems: 'center',
          }}
        >
          {MARQUEE_ICONS.map((icon, i) => (
            <svg
              key={i}
              viewBox="0 0 24 24"
              width={24}
              height={24}
              fill={fill}
              style={{ flexShrink: 0, opacity: 0.75 }}
              aria-label={icon.title}
            >
              <path d={icon.path} />
            </svg>
          ))}
        </div>
      </div>
    </div>
  )
}
