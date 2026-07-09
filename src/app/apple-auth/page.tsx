import { notFound } from 'next/navigation'
import { getDeveloperToken } from '@/lib/appleMusic'
import { AppleAuthClient } from './AppleAuthClient'

export default async function AppleAuthPage() {
  if (process.env.NODE_ENV === 'production') notFound()

  let developerToken: string
  try {
    developerToken = await getDeveloperToken()
  } catch (error) {
    return (
      <main style={{ maxWidth: 560, margin: '80px auto', padding: '0 24px' }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)' }}>Apple Music auth</h1>
        <p style={{ marginTop: 12, fontSize: 14, color: 'var(--text2)' }}>
          Could not generate a developer token: {error instanceof Error ? error.message : 'unknown error'}
        </p>
        <p style={{ marginTop: 8, fontSize: 14, color: 'var(--text2)' }}>
          Set APPLE_TEAM_ID, APPLE_MUSIC_KEY_ID and APPLE_MUSIC_PRIVATE_KEY in .env.local first
          (see src/app/api/apple-music/route.ts for the setup steps), then restart the dev server.
        </p>
      </main>
    )
  }

  return <AppleAuthClient developerToken={developerToken} />
}
