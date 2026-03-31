import type { BlogPost } from '@/types'

interface BlogProps {
  posts: BlogPost[]
}

export default function Blog({ posts: _posts }: BlogProps) {
  return null
}
