// Spotify OAuth setup:
// 1. Go to https://developer.spotify.com/dashboard — create an app
// 2. Set redirect URI to http://localhost:3000/callback
// 3. Scopes: user-read-currently-playing user-read-recently-played
// 4. Authorize: https://accounts.spotify.com/authorize?client_id=YOUR_ID&response_type=code
//    &redirect_uri=http://localhost:3000/callback
//    &scope=user-read-currently-playing%20user-read-recently-played
// 5. Exchange code for refresh_token via POST to https://accounts.spotify.com/api/token
// 6. Store SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN in .env.local

import { NextResponse } from 'next/server'
import { getNowPlaying, getRecentlyPlayed } from '@/lib/spotify'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const track = await getNowPlaying()
    if (track.isPlaying || track.title) {
      return NextResponse.json(track)
    }
    const recent = await getRecentlyPlayed()
    return NextResponse.json(recent)
  } catch (error) {
    console.error('[/api/spotify]', error)
    return NextResponse.json({ isPlaying: false })
  }
}
