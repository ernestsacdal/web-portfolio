import type { GithubData } from '@/types'

const GRAPHQL_URL = 'https://api.github.com/graphql'

const CONTRIBUTIONS_QUERY = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
            }
          }
        }
      }
      repositories(first: 10, orderBy: { field: PUSHED_AT, direction: DESC }, ownerAffiliations: OWNER) {
        nodes {
          pushedAt
          languages(first: 1, orderBy: { field: SIZE, direction: DESC }) {
            nodes {
              name
            }
          }
        }
      }
    }
  }
`

export async function getGithubData(username = 'ernestsacdal'): Promise<GithubData> {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: CONTRIBUTIONS_QUERY, variables: { username } }),
    next: { revalidate: 3600 },
  })

  const { data } = await res.json()
  const user = data?.user

  const calendar = user?.contributionsCollection?.contributionCalendar
  const contributions: number[][] = (calendar?.weeks ?? []).map(
    (w: { contributionDays: { contributionCount: number }[] }) =>
      w.contributionDays.map((d) => d.contributionCount),
  )

  const repos: { pushedAt: string; languages: { nodes: { name: string }[] } }[] =
    user?.repositories?.nodes ?? []

  const langCounts: Record<string, number> = {}
  for (const repo of repos) {
    const lang = repo.languages?.nodes?.[0]?.name
    if (lang) langCounts[lang] = (langCounts[lang] ?? 0) + 1
  }

  const mostUsedLanguage =
    Object.entries(langCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'TypeScript'

  const lastPushed = repos[0]?.pushedAt ?? new Date().toISOString()

  return {
    contributions,
    totalContributions: calendar?.totalContributions ?? 0,
    mostUsedLanguage,
    lastPushed,
  }
}
