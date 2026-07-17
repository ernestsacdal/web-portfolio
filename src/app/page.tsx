import { Hero } from '@/components/sections/Hero'
import { BentoGrid } from '@/components/sections/BentoGrid'
import { Projects } from '@/components/sections/Projects'
import { Blog } from '@/components/sections/Blog'
import { Footer } from '@/components/sections/Footer'
import { getAllPosts } from '@/lib/mdx'

export default function Home() {
  const posts = getAllPosts().slice(0, 2)
  return (
    <main>
      <Hero />
      <BentoGrid />
      <Projects />
      <Blog posts={posts} />
      <Footer />
    </main>
  )
}
