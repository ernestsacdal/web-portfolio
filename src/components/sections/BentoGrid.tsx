import { getGithubData } from '@/lib/github'
import { getLatestPost } from '@/lib/mdx'
import { GithubCard } from '@/components/bento/GithubCard'
import { BuildCard } from '@/components/bento/BuildCard'
import { TechStackCard } from '@/components/bento/TechStackCard'
import { LocationCard } from '@/components/bento/LocationCard'
import { SpotifyCard } from '@/components/bento/SpotifyCard'
import { ServicesCard } from '@/components/bento/ServicesCard'
import { LatestPostCard } from '@/components/bento/LatestPostCard'
import { QuoteCard } from '@/components/bento/QuoteCard'
import { StaggerGrid, StaggerItem } from '@/components/ui/StaggerGrid'

export async function BentoGrid() {
  const [githubData, latestPost] = await Promise.all([
    getGithubData().catch(() => null),
    Promise.resolve(getLatestPost()),
  ])

  return (
    <section
      id="work"
      style={{ width: '100%', padding: '2rem 1.25rem 6rem', maxWidth: 1280, margin: '0 auto' }}
    >
      <StaggerGrid
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[10px]"
        style={{ gridAutoFlow: 'dense' }}
      >
        <StaggerItem className="col-span-1 sm:col-span-2 md:col-span-3">
          <GithubCard data={githubData} />
        </StaggerItem>

        <StaggerItem className="col-span-1">
          <BuildCard />
        </StaggerItem>

        <StaggerItem className="col-span-1 sm:col-span-2">
          <TechStackCard />
        </StaggerItem>

        <StaggerItem className="col-span-1">
          <LocationCard />
        </StaggerItem>

        <StaggerItem className="col-span-1">
          <QuoteCard />
        </StaggerItem>

        <StaggerItem className="col-span-1 sm:col-span-2">
          <SpotifyCard />
        </StaggerItem>

        <StaggerItem className="col-span-1 sm:col-span-2">
          <ServicesCard />
        </StaggerItem>

        <StaggerItem className="col-span-1">
          <LatestPostCard post={latestPost} />
        </StaggerItem>
      </StaggerGrid>
    </section>
  )
}
