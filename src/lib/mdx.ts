import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import type { Project, BlogPost } from '@/types'

const projectsDir = path.join(process.cwd(), 'src/content/projects')
const blogDir = path.join(process.cwd(), 'src/content/blog')

function slugFrom(filename: string) {
  return filename.replace(/\.mdx?$/, '')
}

export function getAllProjects(): Project[] {
  if (!fs.existsSync(projectsDir)) return []
  return fs
    .readdirSync(projectsDir)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(projectsDir, filename), 'utf-8')
      const { data } = matter(raw)
      return { slug: slugFrom(filename), ...data } as Project
    })
}

export function getProjectBySlug(slug: string): { meta: Project; content: string } {
  const filepath = path.join(projectsDir, `${slug}.mdx`)
  const raw = fs.readFileSync(filepath, 'utf-8')
  const { data, content } = matter(raw)
  return { meta: { slug, ...data } as Project, content }
}

export function getAllBlogPosts(): BlogPost[] {
  if (!fs.existsSync(blogDir)) return []
  return fs
    .readdirSync(blogDir)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(blogDir, filename), 'utf-8')
      const { data, content } = matter(raw)
      return {
        slug: slugFrom(filename),
        readTime: readingTime(content).text,
        ...data,
      } as BlogPost
    })
    .filter((post) => post.published)
}

export function getBlogPostBySlug(slug: string): { meta: BlogPost; content: string } {
  const filepath = path.join(blogDir, `${slug}.mdx`)
  const raw = fs.readFileSync(filepath, 'utf-8')
  const { data, content } = matter(raw)
  return {
    meta: { slug, readTime: readingTime(content).text, ...data } as BlogPost,
    content,
  }
}
