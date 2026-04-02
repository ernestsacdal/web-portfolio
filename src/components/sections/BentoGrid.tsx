import { getGithubData } from '@/lib/github'
import { GithubCard } from '@/components/bento/GithubCard'
import { BuildCard } from '@/components/bento/BuildCard'
import { TechStackCard } from '@/components/bento/TechStackCard'
import { LocationCard } from '@/components/bento/LocationCard'
import { SpotifyCard } from '@/components/bento/SpotifyCard'
import { QuoteCard } from '@/components/bento/QuoteCard'
import { FeaturedProjectCard } from '@/components/bento/FeaturedProjectCard'
import { SkillsMarqueeCard } from '@/components/bento/SkillsMarqueeCard'

export async function BentoGrid() {
  const githubData = await getGithubData().catch(() => null)

  return (
    <section
      id="bento"
      className="min-h-screen flex flex-col justify-center"
      style={{ width: '100%', padding: '2rem 1.25rem 6rem', maxWidth: 1280, margin: '0 auto' }}
    >
      {/* 36-column explicit-placement grid — matches Jesica's proportions */}
      <div
        className={[
          'md:grid max-md:flex max-md:flex-col max-md:gap-3',
          'grid-cols-[repeat(36,_minmax(0,_1fr))]',
          'grid-rows-[repeat(15,_minmax(0,_1fr))]',
          'gap-3',
        ].join(' ')}
        style={{ height: 720 }}
      >
        {/* Left column — Location (tall) */}
        <div className="col-start-1 col-end-11 row-start-1 row-end-[8]">
          <LocationCard />
        </div>

        {/* Left column — Spotify now playing (compact strip) */}
        <div className="col-start-1 col-end-11 row-start-[8] row-end-[10]">
          <SpotifyCard />
        </div>

        {/* Center — Featured project (tall) */}
        <div className="col-start-11 col-end-[24] row-start-1 row-end-[8]">
          <FeaturedProjectCard />
        </div>

        {/* Center — Quote (compact strip) */}
        <div className="col-start-11 col-end-[24] row-start-[8] row-end-[10]">
          <QuoteCard />
        </div>

        {/* Right — Skills marquee (small top) */}
        <div className="col-start-[24] col-end-[37] row-start-1 row-end-4">
          <SkillsMarqueeCard />
        </div>

        {/* Right — Build CTA (tall bottom) */}
        <div className="col-start-[24] col-end-[37] row-start-4 row-end-[10]">
          <BuildCard />
        </div>

        {/* Bottom left — GitHub activity */}
        <div className="col-start-1 col-end-[19] row-start-[10] row-end-[16]">
          <GithubCard data={githubData} />
        </div>

        {/* Bottom right — Tech stack */}
        <div className="col-start-[19] col-end-[37] row-start-[10] row-end-[16]">
          <TechStackCard />
        </div>
      </div>
    </section>
  )
}
