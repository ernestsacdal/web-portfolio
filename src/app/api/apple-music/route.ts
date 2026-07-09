// Apple Music (MusicKit) setup:
// 1. https://developer.apple.com → Certificates, Identifiers & Profiles → Keys
//    → create a key with MusicKit enabled → download the .p8, note the Key ID
// 2. Team ID is on the Membership page
// 3. Set APPLE_TEAM_ID, APPLE_MUSIC_KEY_ID, APPLE_MUSIC_PRIVATE_KEY in .env.local
//    (paste the .p8 contents on one line, newlines escaped as \n)
// 4. Run the dev server, visit http://localhost:3000/apple-auth, sign in with
//    your Apple ID and copy the Music User Token into APPLE_MUSIC_USER_TOKEN
// Note: the user token expires roughly every 6 months — repeat step 4 to renew.

import { NextResponse } from 'next/server'
import { getRecentlyPlayed } from '@/lib/appleMusic'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const track = await getRecentlyPlayed()
    return NextResponse.json(track, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
    })
  } catch (error) {
    console.error('[/api/apple-music]', error)
    return NextResponse.json({ isPlaying: false })
  }
}
