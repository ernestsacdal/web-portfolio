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
          'bento-grid-desktop',
          'max-md:flex max-md:flex-col max-md:gap-4',
          'md:max-lg:grid md:max-lg:grid-cols-2 md:max-lg:gap-3 md:max-lg:auto-rows-[minmax(180px,auto)]',
          'lg:grid',
          'lg:grid-cols-[repeat(36,_minmax(0,_1fr))]',
          'lg:grid-rows-[repeat(15,_minmax(0,_1fr))]',
          'gap-3',
        ].join(' ')}
      >
        {/* Left column — Location (tall) */}
        <div className="min-h-[200px] lg:min-h-0 lg:col-start-1 lg:col-end-11 lg:row-start-1 lg:row-end-[8]">
          <LocationCard />
        </div>

        {/* Left column — Spotify now playing (compact strip) */}
        <div className="min-h-[80px] lg:min-h-0 lg:col-start-1 lg:col-end-11 lg:row-start-[8] lg:row-end-[10]">
          <SpotifyCard />
        </div>

        {/* Center — Featured project (tall) */}
        <div className="min-h-[160px] lg:min-h-0 lg:col-start-11 lg:col-end-[24] lg:row-start-1 lg:row-end-[8]">
          <FeaturedProjectCard />
        </div>

        {/* Center — Quote (compact strip) */}
        <div className="min-h-[80px] lg:min-h-0 lg:col-start-11 lg:col-end-[24] lg:row-start-[8] lg:row-end-[10]">
          <QuoteCard />
        </div>

        {/* Right — Skills marquee (small top) */}
        <div className="min-h-[160px] lg:min-h-0 lg:col-start-[24] lg:col-end-[37] lg:row-start-1 lg:row-end-5">
          <SkillsMarqueeCard />
        </div>

        {/* Right — Build CTA (tall bottom) */}
        <div className="min-h-[200px] lg:min-h-0 lg:col-start-[24] lg:col-end-[37] lg:row-start-5 lg:row-end-[10]">
          <BuildCard />
        </div>

        {/* Bottom left — GitHub activity */}
        <div className="min-h-[200px] lg:min-h-0 md:max-lg:col-span-2 lg:col-start-1 lg:col-end-[19] lg:row-start-[10] lg:row-end-[16]">
          <GithubCard data={githubData} />
        </div>

        {/* Bottom right — Tech stack */}
        <div className="min-h-[160px] lg:min-h-0 md:max-lg:col-span-2 lg:col-start-[19] lg:col-end-[37] lg:row-start-[10] lg:row-end-[16]">
          <TechStackCard />
        </div>
      </div>
    </section>
  )
}
