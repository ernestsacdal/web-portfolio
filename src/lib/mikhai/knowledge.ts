/**
 * Mikhai's knowledge — built from the site's own content, never hand-copied.
 *
 * Sources: the CV (cv/ernest-sacdal-cv.html), every project MDX, every
 * published blog MDX, and src/content/about.md. Each is split on its
 * headings into small chunks and indexed with BM25 (MiniSearch). Per
 * question, `retrieve` returns the best chunks that fit a token budget, so a
 * request stays inside Groq's free-tier limits however large the site grows.
 *
 * Server-only (reads the filesystem). On Vercel the content files ship with
 * the /api/chat function via `outputFileTracingIncludes` in next.config.ts.
 */
import fs from 'fs'
import path from 'path'
import MiniSearch from 'minisearch'
import { getAllPosts, getAllProjects, getPostBySlug, getProjectBySlug } from '@/lib/mdx'
import type { Project } from '@/types'
import { ALIASES } from './aliases'

export type ChunkKind = 'cv' | 'project' | 'blog' | 'about'

export interface Chunk {
  /** `<kind>:<doc>:<section>[:<part>]` — alias keys match on this prefix */
  id: string
  kind: ChunkKind
  /** Document title, e.g. "Wednesday — Half Price Tracker" */
  doc: string
  /** Section heading within the document */
  section: string
  /** Page on this site the chunk comes from */
  url: string
  /** Publication date — blog posts only */
  date?: string
  text: string
  tokens: number
  /** Position across the whole knowledge base, for stable ordering */
  order: number
}

export interface Retrieved extends Chunk {
  score: number
}

export interface Knowledge {
  chunks: Chunk[]
  byId: Map<string, Chunk>
  /** Always-on table of contents for the system prompt */
  index: string
  search: MiniSearch<Chunk & { title: string; aliases: string }>
}

/** Longest a single chunk may be before it is split on paragraphs. */
const MAX_CHUNK_TOKENS = 400

/** Rough token count (~4 chars/token for English) — used for budgeting only. */
export const estimateTokens = (s: string): number => Math.ceil(s.length / 4)

const slugify = (s: string): string =>
  s
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

// ─── Text helpers ───────────────────────────────────────────────────────────

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
}

function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n: string) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, name: string) => NAMED_ENTITIES[name.toLowerCase()] ?? m)
}

function htmlToText(html: string): string {
  const text = html
    // keep an entry's title, date/url on one line: "Software Engineer · Mar 2024 – Feb 2025"
    .replace(/<\/span>\s*<span class="entry-(?:date|url)">/g, ' · ')
    .replace(/<li[^>]*>/g, '\n- ')
    .replace(/<\/(?:div|p|li|ul|h[1-6])>/g, '\n')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<[^>]+>/g, '')
  return decodeEntities(text)
    .split('\n')
    .map(line => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n')
}

/** Split markdown on ##/### headings; text before the first heading is "Overview". */
function markdownSections(body: string): { heading: string; text: string }[] {
  const out: { heading: string; text: string }[] = []
  let heading = 'Overview'
  let lines: string[] = []
  const flush = () => {
    const text = lines.join('\n').trim()
    if (text) out.push({ heading, text })
  }
  for (const line of body.replace(/<!--[\s\S]*?-->/g, '').split('\n')) {
    const m = /^#{2,3}\s+(.+?)\s*$/.exec(line)
    if (m) {
      flush()
      heading = m[1]
      lines = []
    } else {
      lines.push(line)
    }
  }
  flush()
  return out
}

/** Split an over-long section on blank lines into parts that fit MAX_CHUNK_TOKENS. */
function splitLong(text: string): string[] {
  if (estimateTokens(text) <= MAX_CHUNK_TOKENS) return [text]
  const parts: string[] = []
  let current = ''
  for (const para of text.split(/\n\s*\n/)) {
    const next = current ? `${current}\n\n${para}` : para
    if (current && estimateTokens(next) > MAX_CHUNK_TOKENS) {
      parts.push(current)
      current = para
    } else {
      current = next
    }
  }
  if (current) parts.push(current)
  return parts
}

// ─── Sources ────────────────────────────────────────────────────────────────

interface Draft {
  id: string
  kind: ChunkKind
  doc: string
  section: string
  url: string
  date?: string
  text: string
}

function pushSection(out: Draft[], base: Omit<Draft, 'id' | 'section' | 'text'>, docId: string, section: string, text: string) {
  const parts = splitLong(text)
  parts.forEach((part, i) => {
    out.push({
      ...base,
      id: `${base.kind}:${docId ? `${docId}:` : ''}${slugify(section)}${parts.length > 1 ? `:${i + 1}` : ''}`,
      section: parts.length > 1 ? `${section} (${i + 1}/${parts.length})` : section,
      text: part,
    })
  })
}

const CV_PATH = path.join(process.cwd(), 'cv', 'ernest-sacdal-cv.html')
const ABOUT_PATH = path.join(process.cwd(), 'src', 'content', 'about.md')

function cvDrafts(): Draft[] {
  if (!fs.existsSync(CV_PATH)) return []
  const html = fs.readFileSync(CV_PATH, 'utf-8')
  const page = html.slice(html.indexOf('<div class="page">'))
  const base = { kind: 'cv' as const, doc: "Ernest's CV", url: '/ernestsacdalcv.pdf' }
  const out: Draft[] = []

  const [header, ...sections] = page.split(/<h2>/)
  pushSection(out, base, 'header', 'Header', htmlToText(header))

  for (const raw of sections) {
    const title = decodeEntities(raw.slice(0, raw.indexOf('</h2>')))
    const sectionSlug = slugify(title)
    const body = raw.slice(raw.indexOf('</h2>') + 5)
    // Experience / Projects / Education: one chunk per entry
    const entries = body.split(/(?=<div class="entry-head">)/).filter(e => htmlToText(e))
    if (entries.length > 1) {
      for (const entry of entries) {
        const text = htmlToText(entry)
        const entryTitle = text.split('\n')[0].split(' · ')[0]
        out.push({ ...base, id: `cv:${sectionSlug}:${slugify(entryTitle)}`, section: `${title} › ${entryTitle}`, text })
      }
    } else {
      pushSection(out, base, sectionSlug, title, htmlToText(body))
    }
  }
  return out
}

const STATUS_TEXT: Record<Project['status'], string> = {
  live: 'live',
  wip: 'work in progress',
  planning: 'planning',
  nda: 'client work under NDA — only what is written here is public',
}

function projectDrafts(projects: Project[]): Draft[] {
  const out: Draft[] = []
  for (const meta of projects) {
    const { content } = getProjectBySlug(meta.slug)
    const base = { kind: 'project' as const, doc: meta.title, url: `/projects/${meta.slug}` }
    const overview = [
      meta.title,
      `Status: ${STATUS_TEXT[meta.status] ?? meta.status} · Year: ${meta.year}`,
      meta.description,
      meta.tags?.length ? `Tech: ${meta.tags.join(', ')}` : '',
      meta.liveUrl ? `Live: ${meta.liveUrl}` : '',
      meta.githubUrl ? `Code: ${meta.githubUrl}` : '',
      `Case study: /projects/${meta.slug}`,
    ].filter(Boolean).join('\n')
    out.push({ ...base, id: `project:${meta.slug}:summary`, section: 'Summary', text: overview })
    for (const s of markdownSections(content)) pushSection(out, base, meta.slug, s.heading, s.text)
  }
  return out
}

function blogDrafts(): Draft[] {
  const out: Draft[] = []
  for (const post of getAllPosts()) {
    const full = getPostBySlug(post.slug)
    if (!full) continue
    const base = { kind: 'blog' as const, doc: post.title, url: `/blog/${post.slug}`, date: post.date }
    out.push({
      ...base,
      id: `blog:${post.slug}:summary`,
      section: 'Summary',
      text: [post.title, `Published ${post.date} · ${post.tag} · ${post.readTime}`, post.description, `Post: /blog/${post.slug}`].join('\n'),
    })
    for (const s of markdownSections(full.content)) pushSection(out, base, post.slug, s.heading, s.text)
  }
  return out
}

function aboutDrafts(): Draft[] {
  if (!fs.existsSync(ABOUT_PATH)) return []
  // drop frontmatter; markdownSections strips comments, so TODO-only sections vanish
  const body = fs.readFileSync(ABOUT_PATH, 'utf-8').replace(/^---[\s\S]*?---\n/, '')
  const out: Draft[] = []
  const base = { kind: 'about' as const, doc: "Ernest's notes", url: '/' }
  for (const s of markdownSections(body)) {
    if (s.heading === 'Overview') continue
    pushSection(out, base, '', s.heading, s.text)
  }
  return out
}

// ─── Index (always in the system prompt) ────────────────────────────────────

const STATUS_ORDER: Record<Project['status'], number> = { live: 0, wip: 1, planning: 2, nda: 3 }

function buildIndex(projects: Project[], aboutSections: string[]): string {
  const posts = getAllPosts()
  const lines = [
    "CV — Ernest Mikhail Sacdal, Software Engineer · Full-Stack Developer · AI/ML Engineer, Sydney. Download: /ernestsacdalcv.pdf",
    '',
    'Projects (case study at each link):',
    ...projects.map(p => `- ${p.title} (${p.status === 'nda' ? 'under NDA' : p.status}, ${p.year}) — ${p.description} /projects/${p.slug}`),
    '',
    'Blog posts:',
    ...posts.map(p => `- ${p.title} (published ${p.date}) — ${p.description} /blog/${p.slug}`),
  ]
  if (aboutSections.length) lines.push('', `Ernest's own notes cover: ${aboutSections.join('; ')}.`)
  return lines.join('\n')
}

// ─── Build + search ─────────────────────────────────────────────────────────

const STOP_WORDS = new Set(
  ('a an and are as at be but by can could did do does for from had has have he her his how i ' +
   'if in is it its me my of on or our she so tell than that the their them then there these ' +
   'they this to us was we were what when where which who whom why will with would you your ' +
   'ernest ernests about any some')
    .split(' '),
)

function aliasesFor(id: string): string {
  return Object.entries(ALIASES)
    .filter(([prefix]) => id.startsWith(prefix))
    .map(([, terms]) => terms)
    .join(' ')
}

function build(): Knowledge {
  const projects = getAllProjects().sort(
    (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || b.year.localeCompare(a.year) || a.title.localeCompare(b.title),
  )
  const about = aboutDrafts()
  const drafts = [...cvDrafts(), ...projectDrafts(projects), ...blogDrafts(), ...about]

  const chunks: Chunk[] = drafts.map((d, order) => ({ ...d, order, tokens: estimateTokens(d.text) }))
  const search = new MiniSearch<Chunk & { title: string; aliases: string }>({
    idField: 'id',
    fields: ['title', 'aliases', 'text'],
    storeFields: [],
    processTerm: term => {
      const t = term.toLowerCase()
      return STOP_WORDS.has(t) ? null : t
    },
    searchOptions: {
      boost: { title: 3, aliases: 2 },
      fuzzy: term => (term.length > 4 ? 0.2 : false),
      prefix: term => term.length > 3,
      combineWith: 'OR',
    },
  })
  search.addAll(chunks.map(c => ({ ...c, title: `${c.doc} ${c.section}`, aliases: aliasesFor(c.id) })))

  const aboutSections = [...new Set(about.map(c => c.section.replace(/ \(\d+\/\d+\)$/, '')))]
  return {
    chunks,
    byId: new Map(chunks.map(c => [c.id, c])),
    index: buildIndex(projects, aboutSections),
    search,
  }
}

let cached: Knowledge | null = null

/** Built once per server instance; rebuilt on every call in development so content edits show up live. */
export function getKnowledge(): Knowledge {
  if (process.env.NODE_ENV !== 'production') return build()
  cached ??= build()
  return cached
}

// ─── Retrieval ──────────────────────────────────────────────────────────────

/** Words that point back at the previous question's subject ("what's its stack?"). */
const BACK_REFERENCE = /\b(it|its|it's|that|this|those|they|them|their|the app|the project|more)\b/i

/** Short or back-referencing questions lean on the previous question for their subject. */
export function isFollowUp(question: string): boolean {
  return question.trim().split(/\s+/).length <= 7 || BACK_REFERENCE.test(question)
}

/** Weight of the previous question's matches in a follow-up. */
const PREVIOUS_WEIGHT = 0.6
/** Multiplier for the previous subject's documents when the question refers back to it. */
const SUBJECT_BOOST = 3

const docKey = (c: Chunk): string => `${c.kind}|${c.url}|${c.doc}`

const MAX_CHUNKS = 8
/** Chunks scoring below this fraction of the best match are noise. */
const MIN_RELATIVE_SCORE = 0.15

/**
 * Best chunks for the question within `budgetTokens`. A follow-up question
 * also searches the previous one at reduced weight, so "how does it work?"
 * keeps its subject.
 */
export function retrieve(question: string, previousQuestion: string | undefined, budgetTokens: number): Retrieved[] {
  const k = getKnowledge()
  const scores = new Map<string, number>()
  for (const r of k.search.search(question)) scores.set(String(r.id), r.score)
  if (previousQuestion && isFollowUp(question)) {
    const previous = k.search.search(previousQuestion)
    for (const r of previous) {
      const id = String(r.id)
      scores.set(id, (scores.get(id) ?? 0) + PREVIOUS_WEIGHT * r.score)
    }
    // "its", "that", "they"… mean the previous subject — favour its documents
    // over whatever the current words match on their own.
    if (BACK_REFERENCE.test(question)) {
      const subject = new Set(
        previous.slice(0, 3).flatMap(r => {
          const c = k.byId.get(String(r.id))
          return c ? [docKey(c)] : []
        }),
      )
      for (const [id, score] of scores) {
        const c = k.byId.get(id)
        if (c && subject.has(docKey(c))) scores.set(id, score * SUBJECT_BOOST)
      }
    }
  }

  const ranked = [...scores].sort((a, b) => b[1] - a[1])
  if (!ranked.length) return []
  const floor = ranked[0][1] * MIN_RELATIVE_SCORE

  const picked: Retrieved[] = []
  let used = 0
  for (const [id, score] of ranked) {
    if (score < floor || picked.length >= MAX_CHUNKS) break
    const chunk = k.byId.get(id)
    if (!chunk || used + chunk.tokens > budgetTokens) continue
    picked.push({ ...chunk, score })
    used += chunk.tokens
  }

  // Present grouped by document (best document first), in reading order within each
  const docBest = new Map<string, number>()
  for (const c of picked) docBest.set(docKey(c), Math.max(docBest.get(docKey(c)) ?? 0, c.score))
  return picked.sort((a, b) => (docBest.get(docKey(b))! - docBest.get(docKey(a))!) || a.order - b.order)
}
