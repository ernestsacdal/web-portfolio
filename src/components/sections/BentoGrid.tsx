import { getGithubData } from '@/lib/github'
import { GithubCard } from '@/components/bento/GithubCard'
import { BuildCard } from '@/components/bento/BuildCard'
import { TechStackCard } from '@/components/bento/TechStackCard'
import { LocationCard } from '@/components/bento/LocationCard'
import { SpotifyCard } from '@/components/bento/SpotifyCard'
import { QuoteCard } from '@/components/bento/QuoteCard'
import { LogCard } from '@/components/bento/LogCard'
import { SkillsMarqueeCard } from '@/components/bento/SkillsMarqueeCard'

export async function BentoGrid() {
  const githubData = await getGithubData().catch(() => null)

  return (
    <section
      id="bento"
      className="min-h-screen flex flex-col justify-center"
      style={{ width: '100%', padding: '2rem 1.25rem 6rem', maxWidth: 1280, margin: '0 auto' }}
    >
      {/* 36-column explicit-placement grid on md+; 2-column iOS widget grid on mobile */}
      <div
        className={[
          'max-md:grid max-md:grid-cols-2 max-md:gap-4',
          'md:grid',
          'md:grid-cols-[repeat(36,_minmax(0,_1fr))]',
          'md:grid-rows-[repeat(15,_minmax(0,_1fr))]',
          'md:h-[720px]',
          'md:gap-3',
        ].join(' ')}
      >
        {/* Map — full width, order 1 */}
        <div className="md:col-start-1 md:col-end-11 md:row-start-1 md:row-end-[8] max-md:col-span-2 max-md:order-1 max-md:h-[170px] max-md:overflow-hidden max-md:rounded-[22px]">
          <LocationCard />
        </div>

        {/* Quote — hidden on mobile */}
        <div className="md:col-start-1 md:col-end-11 md:row-start-[8] md:row-end-[10] max-md:hidden">
          <QuoteCard />
        </div>

        {/* System Log — full width, order 2 */}
        <div className="md:col-start-11 md:col-end-[24] md:row-start-1 md:row-end-[8] max-md:col-span-2 max-md:order-2 max-md:h-[170px] max-md:overflow-hidden max-md:rounded-[22px]">
          <LogCard />
        </div>

        {/* Spotify — half width, order 4 (right of Services) */}
        <div className="md:col-start-11 md:col-end-[24] md:row-start-[8] md:row-end-[10] max-md:col-span-1 max-md:order-4 max-md:h-[170px] max-md:overflow-hidden max-md:rounded-[22px]">
          <SpotifyCard />
        </div>

        {/* Services — half width, order 3 (left of Spotify) */}
        <div className="md:col-start-[24] md:col-end-[37] md:row-start-1 md:row-end-4 max-md:col-span-1 max-md:order-3 max-md:h-[170px] max-md:overflow-hidden max-md:rounded-[22px]">
          <SkillsMarqueeCard />
        </div>

        {/* Connect 4 — full width, order 5, 2× height */}
        <div className="md:col-start-[24] md:col-end-[37] md:row-start-4 md:row-end-[10] max-md:col-span-2 max-md:order-5 max-md:h-[340px] max-md:overflow-hidden max-md:rounded-[22px]">
          <BuildCard />
        </div>

        {/* GitHub Heatmap — full width, order 6 */}
        <div className="md:col-start-1 md:col-end-[19] md:row-start-[10] md:row-end-[16] max-md:col-span-2 max-md:order-6 max-md:h-[185px] max-md:overflow-hidden max-md:rounded-[22px]">
          <GithubCard data={githubData} />
        </div>

        {/* Tech Stack — full width, order 7 */}
        <div className="md:col-start-[19] md:col-end-[37] md:row-start-[10] md:row-end-[16] max-md:col-span-2 max-md:order-7 max-md:h-[170px] max-md:overflow-hidden max-md:rounded-[22px]">
          <TechStackCard />
        </div>
      </div>
    </section>
  )
}
