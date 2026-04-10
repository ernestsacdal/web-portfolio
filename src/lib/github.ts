import type { GithubData } from '@/types'

const LEVEL_MAP: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
}

const query = `
  query($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`

export async function getGithubData(): Promise<GithubData> {
  const username = process.env.GITHUB_USERNAME
  const token = process.env.GITHUB_TOKEN

  const to = new Date()
  const from = new Date(to)
  from.setFullYear(from.getFullYear() - 1)

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { username, from: from.toISOString(), to: to.toISOString() },
    }),
    next: { revalidate: 3600 },
  })

  const json = await res.json()
  const calendar =
    json.data?.user?.contributionsCollection?.contributionCalendar

  const contributions: { date: string; count: number; level: number }[] = (
    calendar?.weeks ?? []
  ).flatMap(
    (week: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: LEVEL_MAP[day.contributionLevel] ?? 0,
      })),
  )

  const lastPushed =
    [...contributions].reverse().find((d) => d.count > 0)?.date ?? null

  return {
    contributions,
    totalContributions: calendar?.totalContributions ?? 0,
    lastPushed,
  }
}
