# Portfolio — Claude Context

Personal portfolio for **Ernest Sacdal**, Full-Stack Developer & AI Engineer.
Design direction: Apple-inspired — minimal, precise, intentional motion.

## Stack

- **Next.js 16** (App Router) · TypeScript strict mode
- **Tailwind CSS v4** — CSS-first config, no `tailwind.config.ts`
- **Framer Motion** · **MDX** (blog + projects) · **Lucide** icons
- **simple-icons** — brand SVG icons in TechStackCard marquee
- APIs: Spotify (now playing), GitHub (contribution graph), Anthropic Claude (chat popup)

## Critical conventions

- **Tailwind v4**: design tokens live in `src/app/globals.css` inside `@theme {}`. Do not create `tailwind.config.ts`.
- **Dark mode**: `.dark` class on `<html>`. `ThemeProvider` in `src/lib/theme.tsx` manages it (localStorage + system preference).
- **MDX content**: `src/content/projects/*.mdx` and `src/content/blog/*.mdx`. Parsed server-side via `src/lib/mdx.ts` (gray-matter + reading-time).
- **Types**: all shared interfaces in `src/types/index.ts` — `Project`, `BlogPost`, `SpotifyTrack`, `GithubData`.
- **Named exports**: all components use `export function X()`, never default exports.
- **Server vs Client split**: data fetching with `fs` (mdx.ts, github.ts) is server-only. Pages fetch data server-side and pass to `*ClientGrid` client components for interactivity (filters, animations).
- **Scroll animations**: use `FadeIn` and `StaggerGrid`/`StaggerItem` wrappers from `src/components/ui/`. Server components pass children to these client wrappers — never convert a server component to client just for animation.
- **Inline styles primary**: use CSS vars (`var(--bg)`, `var(--text)`, etc.) for all theme-aware colors. Never hardcode hex values in components. Tailwind only for responsive grid utilities.
- **Images**: use `next/image` with `width`, `height`, `alt`. Spotify album art uses `unoptimized` prop. Remote patterns for `i.scdn.co` and `avatars.githubusercontent.com` are configured in `next.config.ts`.
- **`use client`**: only where interactivity requires it — prefer Server Components.
- **No `any` types**: TypeScript strict mode throughout.

## Environment variables

All variables live in `.env.local` (gitignored). Copy `.env.example` to get started.

```
GITHUB_TOKEN          # GitHub personal access token (read:user scope)
GITHUB_USERNAME       # Your GitHub username
SPOTIFY_CLIENT_ID     # Optional — Spotify Developer Dashboard
SPOTIFY_CLIENT_SECRET # Optional — Spotify Developer Dashboard
SPOTIFY_REFRESH_TOKEN # Optional — long-lived refresh token
ANTHROPIC_API_KEY     # Anthropic Console — required for chat popup
```

## API route conventions

- `/api/github` — `export const revalidate = 3600` (ISR, hourly)
- `/api/spotify` — `export const dynamic = 'force-dynamic'` (no-store, live polling)
- `/api/chat` — `force-dynamic`, Anthropic SDK, `claude-sonnet-4-0`, 300 max tokens

## Build phases

### Phase 1 — Foundation ✅
- Project scaffolded, all dependencies installed
- Design system: `globals.css` with full `@theme` token set, CSS vars for light/dark
- `src/types/index.ts`, `src/lib/theme.tsx`, `src/lib/mdx.ts`, `src/lib/spotify.ts`, `src/lib/github.ts`
- Content stubs: `pretriage.mdx`, `placeholder.mdx`
- All component scaffolds (typed shells) in `components/dock/`, `components/sections/`, `components/bento/`, `components/ui/`
- Route stubs for `/blog`, `/blog/[slug]`, `/projects`, `/projects/[slug]`, `/api/chat`, `/api/github`, `/api/spotify`

### Phase 2 — Theme System & Root Layout ✅
- `src/lib/theme.tsx` — ThemeProvider + useTheme (default dark, class toggle)
- `src/app/layout.tsx` — full OpenGraph/Twitter metadata, `className="dark"` default, `<Dock />` mounted globally
- `src/components/ui/PageTransition.tsx` — Framer Motion AnimatePresence (named export)
- `src/components/dock/Dock.tsx` — converted to named export to match layout import

### Phase 3 — Floating Dock ✅
- `src/components/dock/Dock.tsx` — glass-morphism pill, nav links, theme toggle, terminal + chat buttons
- `src/components/dock/TerminalPopup.tsx` — macOS terminal easter egg with typewriter, traffic lights, blinking cursor
- `src/components/dock/ChatPopup.tsx` — Claude-powered chat bubble with typing indicator, message bubbles
- `src/app/api/chat/route.ts` — Anthropic SDK, `claude-sonnet-4-0`, Ernest system prompt
- `@anthropic-ai/sdk` installed

### Phase 4 — Hero Section ✅
- `src/components/sections/Hero.tsx` — staggered Framer Motion entrance (delays: 0 / 0.1 / 0.2 / 0.35s), availability badge, name, role/bio, social links + CV download

### Phase 5 — Bento Grid ✅
- `src/components/sections/BentoGrid.tsx` — async server component, 4-column responsive grid with `grid-auto-flow: dense`
- `src/components/bento/GithubCard.tsx` — 52×7 contribution heatmap, 5-level color scale, null-safe (shows empty grid when token not set)
- `src/components/bento/BuildCard.tsx` — static "Let's Build" CTA card
- `src/components/bento/TechStackCard.tsx` — infinite marquee of 12 simple-icons brand icons
- `src/components/bento/LocationCard.tsx` — live clock ticking every second in Sydney timezone (`Intl.DateTimeFormat`)
- `src/components/bento/SpotifyCard.tsx` — polls `/api/spotify` every 30s, shimmer skeleton, "coming soon" fallback when env not set, sound bar animation
- `src/components/bento/ServicesCard.tsx` — services list
- `src/components/bento/LatestPostCard.tsx` — links to latest published MDX post
- `src/components/bento/QuoteCard.tsx` — static quote
- `src/app/api/github/route.ts` — revalidates hourly
- `src/app/api/spotify/route.ts` — force-dynamic, falls back to recently played

### Phase 6 — Projects ✅
- `src/components/sections/Projects.tsx` — homepage featured rows, hover state, staggered motion
- `src/components/sections/ProjectsClientGrid.tsx` — client component, tag filter pills, staggered card grid
- `src/app/projects/page.tsx` — server component, fetches via `getAllProjects()`, static metadata
- `src/app/projects/[slug]/page.tsx` — SSG via `generateStaticParams`, two layouts: `case-study` (full MDX + cover image) and `minimal`
- `src/content/projects/pretriage.mdx` — full case study content

### Phase 7 — Blog ✅
- `src/lib/mdx.ts` — rewritten with `getAllPosts()`, `getLatestPost()`, `getPostBySlug()` (blog) + `getAllProjects()`, `getProjectBySlug()` (projects)
- `src/components/sections/Blog.tsx` — server component, 3 placeholder cards when no published posts
- `src/components/sections/BlogClientGrid.tsx` — client component, derives unique tags, filter + stagger
- `src/app/blog/page.tsx` — server component, static metadata
- `src/app/blog/[slug]/page.tsx` — SSG, reading progress bar, prev/next navigation
- `src/components/ui/ReadingProgress.tsx` — 2px fixed accent bar, passive scroll listener

### Phase 8 — Footer ✅
- `src/components/sections/Footer.tsx` — server component, FadeIn wrapper, `.footer-link` CSS class for hover, `id="contact"`, `marginBottom: 80` for dock clearance

### Phase 9 — Scroll Animations ✅
- `src/components/ui/FadeIn.tsx` — client wrapper, `whileInView` fadeUp, `viewport={{ once: true }}`
- `src/components/ui/StaggerGrid.tsx` — exports `StaggerGrid` (container) + `StaggerItem` (child), staggerChildren 0.08s
- Applied to: Hero (inline), BentoGrid, Blog, Footer, Projects sections

### Phase 10 — Environment Variables ✅
- `.env.local` — template with placeholder values (gitignored via `.env*`)
- `.env.example` — empty values, safe to commit (`!.env.example` negation in `.gitignore`)

### Phase 11 — Performance & SEO ✅
- `next.config.ts` — `images.remotePatterns` for `i.scdn.co` (Spotify) and `avatars.githubusercontent.com`
- `generateMetadata` on `/projects`, `/blog` (static) and `/blog/[slug]`, `/projects/[slug]` (dynamic from frontmatter)
- SpotifyCard album art uses `unoptimized` prop (dynamic CDN URL)

### Phase 12 — Final Checklist ✅
- `README.md` rewritten — setup guide, env var reference table, project structure, content authoring docs
- All API cards have graceful fallbacks: GitHub shows empty heatmap, Spotify shows shimmer then placeholder
- Build passes cleanly: 9 routes, all TypeScript clean
