'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { siApplemusic } from 'simple-icons'
import type { MusicTrack } from '@/types'

const MOBILE_STYLES = `
  @media (max-width: 767px) {
    .music-track { flex-direction: column !important; align-items: center !important; gap: 10px !important; }
    .music-art { width: 56px !important; height: 56px !important; border-radius: 8px !important; }
    .music-text { text-align: center !important; }
    .music-text p { white-space: normal !important; overflow: visible !important; text-overflow: clip !important; }
    .music-title { font-size: 14px !important; }
    .music-artist { font-size: 12px !important; }
  }
`

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

export function AppleMusicCard() {
  const [track, setTrack] = useState<MusicTrack | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTrack() {
      try {
        const res = await fetch('/api/apple-music')
        const data: MusicTrack = await res.json()
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
      id = setInterval(fetchTrack, 60_000)
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
        <p style={{ fontSize: 13, color: 'var(--text2)' }}>🎵 Music coming soon</p>
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
          className="music-art"
          style={{ borderRadius: 6, flexShrink: 0 }}
        />
      )}
      <div className="music-text" style={{ flex: 1, minWidth: 0 }}>
        <p
          className="music-title"
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
          className="music-artist"
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
        {/* Apple Music logo — absolute top right */}
        <svg viewBox="0 0 24 24" width={16} height={16} fill="#FA243C" aria-label="Apple Music"
          style={{ position: 'absolute', top: 12, right: 14, flexShrink: 0 }}>
          <path d={siApplemusic.path} />
        </svg>

        {/* Label — top left */}
        <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text2)', paddingRight: 24 }}>
          Last played
        </p>

        {/* Track group — fills remaining height, vertically centered */}
        {track.songUrl ? (
          <a
            href={track.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="music-track"
            style={{ flex: 1, display: 'flex', gap: 10, alignItems: 'center', textDecoration: 'none' }}
          >
            {trackContent}
          </a>
        ) : (
          <div className="music-track" style={{ flex: 1, display: 'flex', gap: 10, alignItems: 'center' }}>
            {trackContent}
          </div>
        )}
      </div>
    </>
  )
}
