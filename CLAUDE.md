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
GROQ_API_KEY          # Optional — Groq free tier, used for Connect 4 AI; falls back to minimax if absent
```

## API route conventions

- `/api/github` — `export const revalidate = 3600` (ISR, hourly)
- `/api/spotify` — `export const dynamic = 'force-dynamic'` (no-store, live polling)
- `/api/chat` — `force-dynamic`, Anthropic SDK, `claude-sonnet-4-0`, 300 max tokens
- `/api/connect4` — `force-dynamic`, POST, accepts board state + AI color, returns chosen column + source (`'groq'` | `'minimax'`)

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
- `src/components/sections/Hero.tsx` — staggered Framer Motion entrance (delays: 0 / 0.1 / 0.2 / 0.35s), pulsing availability badge, name with split color spans, role/bio with `clamp()` typography, social links with hover bg, CV download

### Phase 5 — Bento Grid ✅
- `src/components/sections/BentoGrid.tsx` — 36-column explicit CSS grid, 3-column layout with varied row heights (720px tall), mobile falls back to flex column; imports all 8 cards
- `src/components/bento/FeaturedProjectCard.tsx` — featured project showcase (PreTriage), live badge, tech tags (FastAPI, Next.js, Groq, AI), link to full project page
- `src/components/bento/LocationMap.tsx` — `react-leaflet` MapContainer centered on Sydney, theme-aware CartoDB tile layers (Voyager light / Dark All dark), all map controls disabled, non-interactive
- `src/components/bento/LocationCard.tsx` — dynamically imports `LocationMap` (prevents SSR issues), 3-ring pulsing dot overlay centered over map using `animate-ping`
- `src/components/bento/ServicesMarqueeCard.tsx` — vertically scrolling CSS marquee of 3 services (duplicated for seamless loop), `maskImage` top/bottom fade, uses `animate-marquee-vertical`
- `src/components/bento/LatestPostCard.tsx` — horizontal layout, tag badge, truncated title, conditional arrow link (only when `slug` exists)
- `src/components/bento/GithubCard.tsx` — 52×7 contribution heatmap, 5-level color scale, null-safe (shows empty grid when token not set)
- `src/components/bento/BuildCard.tsx` — static "Let's Build" CTA card
- `src/components/bento/TechStackCard.tsx` — infinite horizontal marquee of 12 simple-icons brand icons
- `src/components/bento/SpotifyCard.tsx` — polls `/api/spotify` every 30s, shimmer skeleton, "coming soon" fallback when env not set, sound bar animation
- `src/app/api/github/route.ts` — revalidates hourly
- `src/app/api/spotify/route.ts` — force-dynamic, falls back to recently played
- `src/app/globals.css` — added `@variant dark`, `--animate-marquee-vertical` token, `@keyframes marqueeVertical` (translateY 0 → -50% over 6s)

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

### Phase 13 — Polish & Enhancements ✅
- `src/app/icon.png` — custom logo replaces default Vercel favicon; Next.js App Router picks it up automatically
- `src/components/bento/GithubCard.tsx` — complete rewrite: interactive hover tooltips with ordinal date formatting (e.g. "3 contributions on March 15th"), new utilities `getColor()`, `ordinalSuffix()`, `formatHoverLabel()`, `formatOrdinalDate()`, 5-level green scale (`#166534` → `#4ade80`), null-safe fallback
- `src/components/bento/TechStackCard.tsx` — dual-row "belt" marquee: row 1 scrolls left (`animate-marquee`), row 2 scrolls right (`animate-marquee-reverse`), `LOOP_OFFSET` array for seamless wrap-around, 28 icons (was 12) with custom SVG paths for OpenAI and AWS, theme-aware fill via `useTheme()`, left/right mask gradient fade
- `src/components/dock/Dock.tsx` — `/logo.png` added with `mix-blend-multiply dark:mix-blend-normal dark:invert`; nav link groups separated by dividers; mobile hides nav links (`hidden sm:flex`)
- `src/components/sections/Footer.tsx` — same logo treatment as Dock
- `src/components/sections/Hero.tsx` — LinkedIn icon replaced with custom SVG path (removed from simple-icons v16); `SocialLink` interface extended to distinguish `simpleIcon` vs `lucideIcon`
- `src/components/sections/Projects.tsx` — full rewrite as client component: 3 hardcoded projects (PreTriage live, Portfolio v2 wip, TripView Clone planning), color-coded status badges, hover bg/border/arrow effects, `useRouter().push()` on click, Framer Motion stagger with 0.08s delay
- Unused stubs (not in BentoGrid): `src/components/ui/Tag.tsx`, `src/components/ui/StatusBadge.tsx`, `src/components/bento/ServicesCard.tsx`

### Phase 14 — Connect 4 Mini-Game (BuildCard) ✅
- `src/components/bento/BuildCard.tsx` — full rewrite as `'use client'` Connect 4 game (Human vs Hybrid AI); 30px cells, 3px gap, 7×6 board centered via flex; start screen with play button shown before game loads (optimization); Apple system colors: `#0A84FF` (human/blue), `#FF453A` (AI/red); column hover highlight, win-pulse animation on winning 4 cells; ⓘ info overlay explaining hybrid engine; ↺ restart resets to start screen
- `src/app/api/connect4/route.ts` — `force-dynamic` POST endpoint; proxies board state to Groq `llama-3.1-8b-instant` with 2s `AbortController` timeout; validates Groq suggestion with minimax depth-5 (overrides blunders); falls back to minimax depth-7 with alpha-beta pruning if Groq unavailable or times out
- AI hybrid rules (priority order): 1) immediate win (minimax depth-1) → play it; 2) block opponent win → block it; 3) Groq strategic suggestion → validate with minimax → play if sound; 4) fallback full minimax depth-7
- `GROQ_API_KEY` added to `.env.local` (gitignored) and as empty placeholder in `.env.example`; game falls back to pure minimax if key absent

### Phase 15 — Bento Grid Refinement ✅
- `src/components/bento/SkillsMarqueeCard.tsx` — new card: animated vertical marquee of skills/services list, green pulse dot in top-left, CSS mask gradient fade top/bottom, `animate-marquee-vertical` (10s loop); placed at right column row-start-1/row-end-4 in BentoGrid
- `src/components/sections/BentoGrid.tsx` — grid refined to 36-column × 15-row explicit placement; SkillsMarqueeCard replaces ServicesMarqueeCard in the active grid; ServicesMarqueeCard kept as unused stub
- `src/components/bento/FeaturedProjectCard.tsx` — content temporarily commented out (renders empty card); pending redesign
- `src/components/bento/ServicesCard.tsx` — 13-service grid stub (Full-Stack, AI/LLM, Automation, API Design, DB Architecture, Auth, Cloud, Real-Time, CMS, Performance, UI/UX, Team Collaboration, Code Review); exists but not wired into BentoGrid
- `src/app/globals.css` — `--animate-marquee-vertical` duration updated to 10s (was 6s)
