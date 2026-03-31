import { NextResponse } from 'next/server'
import { getGithubData } from '@/lib/github'

export const revalidate = 3600

export async function GET() {
  try {
    const data = await getGithubData()
    return NextResponse.json(data)
  } catch (error) {
    console.error('[/api/github]', error)
    return NextResponse.json(
      {
        contributions: [],
        totalContributions: 0,
        mostUsedLanguage: 'TypeScript',
        lastPushed: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
