import { SignJWT, importPKCS8 } from 'jose'
import type { MusicTrack } from '@/types'

const RECENTLY_PLAYED_URL = 'https://api.music.apple.com/v1/me/recent/played/tracks?limit=1'

const TOKEN_TTL_SECONDS = 12 * 60 * 60

let cachedToken: string | null = null
let tokenExpiresAt = 0

export async function getDeveloperToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken

  const { APPLE_TEAM_ID, APPLE_MUSIC_KEY_ID, APPLE_MUSIC_PRIVATE_KEY } = process.env
  if (!APPLE_TEAM_ID || !APPLE_MUSIC_KEY_ID || !APPLE_MUSIC_PRIVATE_KEY) {
    throw new Error('Missing APPLE_TEAM_ID, APPLE_MUSIC_KEY_ID or APPLE_MUSIC_PRIVATE_KEY')
  }

  // .env files store the .p8 contents on one line with literal "\n" sequences
  const key = await importPKCS8(APPLE_MUSIC_PRIVATE_KEY.replace(/\\n/g, '\n'), 'ES256')

  const token = await new SignJWT({})
    .setProtectedHeader({ alg: 'ES256', kid: APPLE_MUSIC_KEY_ID })
    .setIssuer(APPLE_TEAM_ID)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS)
    .sign(key)

  cachedToken = token
  tokenExpiresAt = Date.now() + (TOKEN_TTL_SECONDS - 60) * 1000
  return token
}

interface AppleMusicSong {
  attributes?: {
    name: string
    artistName: string
    url?: string
    artwork?: { url: string }
  }
}

export async function getRecentlyPlayed(): Promise<MusicTrack> {
  try {
    const { APPLE_MUSIC_USER_TOKEN } = process.env
    if (!APPLE_MUSIC_USER_TOKEN) return { isPlaying: false }

    const token = await getDeveloperToken()

    const res = await fetch(RECENTLY_PLAYED_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Music-User-Token': APPLE_MUSIC_USER_TOKEN,
      },
      cache: 'no-store',
    })

    if (!res.ok) return { isPlaying: false }

    const data: { data?: AppleMusicSong[] } = await res.json()
    const attrs = data.data?.[0]?.attributes

    if (!attrs) return { isPlaying: false }

    return {
      // The Apple Music API has no now-playing endpoint — always "last played"
      isPlaying: false,
      title: attrs.name,
      artist: attrs.artistName,
      albumArt: attrs.artwork?.url.replace('{w}x{h}', '200x200'),
      songUrl: attrs.url,
    }
  } catch {
    return { isPlaying: false }
  }
}
