'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { siSpotify } from 'simple-icons'
import type { SpotifyTrack } from '@/types'

const MOBILE_STYLES = `
  @media (max-width: 767px) {
    .spotify-track { flex-direction: column !important; align-items: center !important; gap: 10px !important; }
    .spotify-art { width: 56px !important; height: 56px !important; border-radius: 8px !important; }
    .spotify-text { text-align: center !important; }
    .spotify-text p { white-space: normal !important; overflow: visible !important; text-overflow: clip !important; }
    .spotify-title { font-size: 14px !important; }
    .spotify-artist { font-size: 12px !important; }
    .spotify-bars { display: none !important; }
  }
`

function SoundBars() {
  return (
    <div className="spotify-bars" style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 14 }}>
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
    <div className="bento-card" style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="shimmer" style={{ width: 70, height: 9, borderRadius: 6 }} />
        <div className="shimmer" style={{ width: 16, height: 16, borderRadius: 4 }} />
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div className="shimmer" style={{ width: 40, height: 40, borderRadius: 6, flexShrink: 0 }} />
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

    let id: ReturnType<typeof setInterval>

    function start() {
      fetchTrack()
      id = setInterval(fetchTrack, 30_000)
    }

    function onVisibilityChange() {
      if (document.hidden) {
        clearInterval(id)
      } else {
        start()
      }
    }

    start()
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  if (loading) return <Skeleton />

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

  const trackContent = (
    <>
      {track.albumArt && (
        <Image
          src={track.albumArt}
          alt="Album art"
          width={40}
          height={40}
          sizes="56px"
          className="spotify-art"
          style={{ borderRadius: 6, flexShrink: 0 }}
        />
      )}
      <div className="spotify-text" style={{ flex: 1, minWidth: 0 }}>
        <p
          className="spotify-title"
          style={{
            fontSize: 13,
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
          className="spotify-artist"
          style={{
            fontSize: 11,
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
    </>
  )

  return (
    <>
      <style>{MOBILE_STYLES}</style>
      <div className="bento-card" style={{ position: 'relative', display: 'flex', flexDirection: 'column', padding: '12px 14px' }}>
        {/* Spotify logo — absolute top right */}
        <svg viewBox="0 0 24 24" width={16} height={16} fill="#1DB954" aria-label="Spotify"
          style={{ position: 'absolute', top: 12, right: 14, flexShrink: 0 }}>
          <path d={siSpotify.path} />
        </svg>

        {/* Label — top left */}
        <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text2)', paddingRight: 24 }}>
          {track.isPlaying ? 'Now playing' : 'Last played'}
        </p>

        {/* Track group — fills remaining height, vertically centered */}
        {track.songUrl ? (
          <a
            href={track.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="spotify-track"
            style={{ flex: 1, display: 'flex', gap: 10, alignItems: 'center', textDecoration: 'none' }}
          >
            {trackContent}
          </a>
        ) : (
          <div className="spotify-track" style={{ flex: 1, display: 'flex', gap: 10, alignItems: 'center' }}>
            {trackContent}
          </div>
        )}

        {/* Animated bars — absolute bottom right */}
        {track.isPlaying && (
          <div style={{ position: 'absolute', bottom: 12, right: 14 }}>
            <SoundBars />
          </div>
        )}
      </div>
    </>
  )
}
