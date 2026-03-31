import type { SpotifyTrack } from '@/types'

const TOKEN_URL = 'https://accounts.spotify.com/api/token'
const NOW_PLAYING_URL = 'https://api.spotify.com/v1/me/player/currently-playing'

async function getAccessToken(): Promise<string> {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env

  const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: SPOTIFY_REFRESH_TOKEN ?? '',
    }),
  })

  const data = await res.json()
  return data.access_token as string
}

export async function getNowPlaying(): Promise<SpotifyTrack> {
  try {
    const token = await getAccessToken()

    const res = await fetch(NOW_PLAYING_URL, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    })

    if (res.status === 204 || res.status > 400) {
      return { isPlaying: false }
    }

    const data = await res.json()
    const isPlaying: boolean = data.is_playing
    const item = data.item

    if (!item) return { isPlaying: false }

    return {
      isPlaying,
      title: item.name,
      artist: item.artists.map((a: { name: string }) => a.name).join(', '),
      albumArt: item.album.images[0]?.url,
      songUrl: item.external_urls.spotify,
    }
  } catch {
    return { isPlaying: false }
  }
}
