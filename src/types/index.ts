export interface Project {
  slug: string
  title: string
  description: string
  tags: string[]
  status: 'live' | 'wip' | 'planning'
  year: string
  type: 'case-study' | 'minimal'
  liveUrl?: string
  githubUrl?: string
  coverImage?: string
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
  contributions: number[][]
  totalContributions: number
  mostUsedLanguage: string
  lastPushed: string
}
