export interface Project {
  slug: string
  title: string
  description: string
  tags: string[]
  status: 'live' | 'wip' | 'planning' | 'nda'
  year: string
  type: 'case-study' | 'minimal'
  liveUrl?: string
  githubUrl?: string
  coverImage?: string
  screenshots?: string[]
  badgeCover?: boolean
}

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  tag: string
  readTime: string
  published: boolean
}

export interface SpotifyTrack {
  isPlaying: boolean
  title?: string
  artist?: string
  albumArt?: string
  songUrl?: string
}

export interface GithubData {
  contributions: { date: string; count: number; level: number }[]
  totalContributions: number
  lastPushed: string | null
}
