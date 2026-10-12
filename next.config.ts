import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.mzstatic.com' },
      { protocol: 'https', hostname: 'i.scdn.co' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
  // Mikhai reads the site's content at runtime (src/lib/mikhai/knowledge.ts);
  // ship those files with the chat function.
  outputFileTracingIncludes: {
    '/api/chat': ['./src/content/**/*', './cv/ernest-sacdal-cv.html'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'simple-icons', 'framer-motion'],
  },
}

export default withMDX(nextConfig)
