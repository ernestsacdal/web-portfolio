import { NextResponse } from 'next/server'
import { getGithubData } from '@/lib/github'

export const revalidate = 3600

export async function GET() {
  try {
    const data = await getGithubData()
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' },
    })
  } catch (error) {
    console.error('[/api/github]', error)
    return NextResponse.json(
      {
        contributions: [],
        totalContributions: 0,
        lastPushed: null,
      },
      { status: 500 },
    )
  }
}
