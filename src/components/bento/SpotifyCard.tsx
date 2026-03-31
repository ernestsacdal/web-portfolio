'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { siSpotify } from 'simple-icons'
import type { SpotifyTrack } from '@/types'

function SoundBars() {
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 14 }}>
      {[0, 0.3, 0.15].map((delay, i) => (
        <div
          key={i}
          className="animate-sound-bar"
          style={{
            width: 3,
            height: 12,
            background: '#1DB954',
            borderRadius: 1,
            transformOrigin: 'bottom',
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  )
}

function Skeleton() {
  return (
    <div className="bento-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="shimmer" style={{ width: 80, height: 10, borderRadius: 6 }} />
        <div className="shimmer" style={{ width: 20, height: 20, borderRadius: 4 }} />
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div className="shimmer" style={{ width: 48, height: 48, borderRadius: 8, flexShrink: 0 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          <div className="shimmer" style={{ width: '70%', height: 12, borderRadius: 6 }} />
          <div className="shimmer" style={{ width: '50%', height: 10, borderRadius: 6 }} />
        </div>
      </div>
    </div>
  )
}

export function SpotifyCard() {
  const [track, setTrack] = useState<SpotifyTrack | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTrack() {
      try {
        const res = await fetch('/api/spotify')
        const data: SpotifyTrack = await res.json()
        setTrack(data)
      } catch {
        setTrack({ isPlaying: false })
      } finally {
        setLoading(false)
      }
    }

    fetchTrack()
    const id = setInterval(fetchTrack, 30_000)
    return () => clearInterval(id)
  }, [])

  if (loading) return <Skeleton />

  // No data at all
  if (!track?.title) {
    return (
      <div
        className="bento-card"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <p style={{ fontSize: 13, color: 'var(--text2)' }}>🎵 Spotify coming soon</p>
      </div>
    )
  }

  return (
    <div className="bento-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text2)' }}>
          {track.isPlaying ? 'Now playing' : 'Last played'}
        </p>
        <svg viewBox="0 0 24 24" width={18} height={18} fill="#1DB954" aria-label="Spotify">
          <path d={siSpotify.path} />
        </svg>
      </div>

      {/* Track info */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {track.albumArt && (
          <Image
            src={track.albumArt}
            alt="Album art"
            width={48}
            height={48}
            style={{ borderRadius: 8, flexShrink: 0 }}
          />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--text)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {track.title}
          </p>
          <p
            style={{
              fontSize: 12,
              color: 'var(--text2)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginTop: 2,
            }}
          >
            {track.artist}
          </p>
        </div>
        {track.isPlaying && <SoundBars />}
      </div>
    </div>
  )
}
