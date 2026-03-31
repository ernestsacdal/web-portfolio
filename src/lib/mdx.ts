import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import type { Project, BlogPost } from '@/types'

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog')
const PROJECTS_DIR = path.join(process.cwd(), 'src/content/projects')

// ── Blog ─────────────────────────────────────────────────────────────────

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8')
      const { data, content } = matter(raw)
      const stats = readingTime(content)
      return {
        slug: file.replace('.mdx', ''),
        title: data.title,
        description: data.description,
        date: data.date,
        tag: data.tag,
        readTime: stats.text,
        published: data.published ?? false,
      } as BlogPost
    })
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getLatestPost(): BlogPost | null {
  const posts = getAllPosts()
  return posts[0] ?? null
}

export function getPostBySlug(slug: string) {
  const file = path.join(BLOG_DIR, `${slug}.mdx`)
  if (!fs.existsSync(file)) return null
  const raw = fs.readFileSync(file, 'utf-8')
  const { data, content } = matter(raw)
  const stats = readingTime(content)
  return { ...data, slug, content, readTime: stats.text } as BlogPost & { content: string }
}

// ── Projects ──────────────────────────────────────────────────────────────

export function getAllProjects(): Project[] {
  if (!fs.existsSync(PROJECTS_DIR)) return []
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(PROJECTS_DIR, filename), 'utf-8')
      const { data } = matter(raw)
      return { slug: filename.replace(/\.mdx?$/, ''), ...data } as Project
    })
}

export function getProjectBySlug(slug: string): { meta: Project; content: string } {
  const filepath = path.join(PROJECTS_DIR, `${slug}.mdx`)
  const raw = fs.readFileSync(filepath, 'utf-8')
  const { data, content } = matter(raw)
  return { meta: { slug, ...data } as Project, content }
}
