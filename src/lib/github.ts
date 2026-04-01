import type { GithubData } from '@/types'

export async function getGithubData(): Promise<GithubData> {
  const res = await fetch(
    'https://github-contributions-api.jogruber.de/v4/ernestsacdal?y=last',
    { next: { revalidate: 3600 } },
  )

  const data = await res.json()
  const contributions: { date: string; count: number; level: number }[] =
    data.contributions ?? []

  const lastPushed =
    [...contributions].reverse().find((d) => d.count > 0)?.date ?? null

  return {
    contributions,
    totalContributions: data.total?.lastYear ?? 0,
    lastPushed,
  }
}
