# Portfolio — Claude Context

Personal portfolio for **Ernest Sacdal**, Full-Stack Developer & AI Engineer.
Design direction: Apple-inspired — minimal, precise, intentional motion.

## Stack

- **Next.js 16** (App Router) · TypeScript strict mode
- **Tailwind CSS v4** — CSS-first config, no `tailwind.config.ts`
- **Framer Motion** · **MDX** (blog + projects) · **Lucide** icons
- **simple-icons** — brand SVG icons in TechStackCard marquee
- APIs: Spotify (now playing), GitHub (contribution graph), Anthropic Claude (chat popup), Groq (Connect 4 AI)

## Critical conventions

- **Tailwind v4**: design tokens live in `src/app/globals.css` inside `@theme {}`. Do not create `tailwind.config.ts`.
- **Dark mode**: `.dark` class on `<html>`. `ThemeProvider` in `src/lib/theme.tsx` manages it (localStorage + system preference).
- **Inline styles primary**: use CSS vars (`var(--bg)`, `var(--text)`, etc.) for all theme-aware colors. Never hardcode hex values. Tailwind only for responsive grid utilities.
- **Named exports**: all components use `export function X()`, never default exports.
- **`use client`**: only where interactivity requires it — prefer Server Components.
- **No `any` types**: TypeScript strict mode throughout.
- **Server vs Client split**: `fs`-based data fetching (mdx.ts, github.ts) is server-only. Pages fetch server-side and pass to `*ClientGrid` client components.
- **Scroll animations**: use `FadeIn` / `StaggerGrid` / `StaggerItem` from `src/components/ui/` — never convert server components to client just for animation.
- **MDX content**: `src/content/projects/*.mdx` and `src/content/blog/*.mdx`. Parsed via `src/lib/mdx.ts`.
- **Types**: shared interfaces in `src/types/index.ts` — `Project`, `BlogPost`, `SpotifyTrack`, `GithubData`.
- **Images**: `next/image` with `width`, `height`, `alt`. Remote patterns for `i.scdn.co` and `avatars.githubusercontent.com` in `next.config.ts`.
- **Keyframe animations**: define in `globals.css` `@theme` block, reference via `var(--animate-*)`. For component-scoped animations, inject a `<style>` tag (see BuildCard `winPulse`, LogCard `logFadeIn`).
- **Event bus**: `src/lib/logEvents.ts` — `emitLog()` / `onLog()` using native `CustomEvent` on `window`. SSR-safe. Used by BuildCard → LogCard.

## Environment variables

All variables live in `.env.local` (gitignored). Copy `.env.example` to get started.

```
GITHUB_TOKEN          # GitHub personal access token (read:user scope)
GITHUB_USERNAME       # Your GitHub username
SPOTIFY_CLIENT_ID     # Optional — Spotify Developer Dashboard
SPOTIFY_CLIENT_SECRET # Optional — Spotify Developer Dashboard
SPOTIFY_REFRESH_TOKEN # Optional — long-lived refresh token
ANTHROPIC_API_KEY     # Anthropic Console — required for chat popup
GROQ_API_KEY          # Optional — Groq free tier, Connect 4 AI; falls back to minimax if absent
```

## API routes

| Route | Cache | Description |
|---|---|---|
| `/api/github` | `revalidate = 3600` | Contribution graph, hourly ISR |
| `/api/spotify` | `force-dynamic` | Now playing, live polling |
| `/api/chat` | `force-dynamic` | Anthropic SDK, `claude-sonnet-4-0`, 300 tokens |
| `/api/connect4` | `force-dynamic` | POST board state → Groq + minimax hybrid, returns `col` |

## Bento grid layout

36-column × 15-row explicit CSS grid, 720px tall, `gap-3`. Mobile: flex column.

| Card | Grid position | Notes |
|---|---|---|
| `LocationCard` | col 1–11, row 1–8 | react-leaflet map, SSR-safe dynamic import |
| `SpotifyCard` | col 1–11, row 8–10 | polls every 30s, shimmer fallback |
| `LogCard` | col 11–24, row 1–8 | live event log + flow visualizer |
| `QuoteCard` | col 11–24, row 8–10 | static quote |
| `SkillsMarqueeCard` | col 24–37, row 1–4 | vertical marquee, 10s loop |
| `BuildCard` | col 24–37, row 4–10 | Connect 4 game, emits log events |
| `GithubCard` | col 1–19, row 10–16 | 52×7 heatmap, hover tooltips |
| `TechStackCard` | col 19–37, row 10–16 | dual-row belt marquee, 28 icons |

## Component inventory

```
src/
├── app/
│   ├── globals.css          — @theme tokens, CSS vars, keyframes
│   ├── layout.tsx           — OpenGraph metadata, ThemeProvider, Dock
│   ├── page.tsx             — Hero + BentoGrid + Projects + Blog + Footer
│   └── api/chat | github | spotify | connect4
├── components/
│   ├── bento/               — all bento cards (see grid table above)
│   ├── dock/                — Dock, TerminalPopup, ChatPopup
│   ├── sections/            — Hero, BentoGrid, Projects, Blog, Footer
│   └── ui/                  — FadeIn, StaggerGrid, ReadingProgress, PageTransition
├── content/
│   ├── projects/pretriage.mdx
│   └── blog/placeholder.mdx
├── lib/
│   ├── logEvents.ts         — typed event bus (emitLog / onLog)
│   ├── mdx.ts               — getAllPosts, getAllProjects, getBySlug
│   ├── github.ts            — getGithubData (server-only)
│   ├── spotify.ts           — getNowPlaying
│   └── theme.tsx            — ThemeProvider, useTheme
└── types/index.ts           — Project, BlogPost, SpotifyTrack, GithubData
```

## Unused stubs (not wired into BentoGrid)

- `src/components/bento/FeaturedProjectCard.tsx` — empty card, pending redesign
- `src/components/bento/ServicesMarqueeCard.tsx` — superseded by SkillsMarqueeCard
- `src/components/bento/ServicesCard.tsx` — 13-service grid, not placed
- `src/components/ui/Tag.tsx`, `StatusBadge.tsx`

## Recent phases

### Phase 14 — Connect 4 (BuildCard) ✅
- `BuildCard.tsx` — Human vs Hybrid AI; minimax depth-6 local + Groq `llama-3.1-8b-instant` with 2s timeout; alpha-beta pruning; start screen, win-pulse animation, ⓘ info overlay
- `api/connect4/route.ts` — validates Groq suggestion with minimax depth-5; falls back to minimax depth-7

### Phase 15 — Bento Refinement ✅
- `SkillsMarqueeCard.tsx` — vertical marquee, replaces ServicesMarqueeCard in grid
- `BentoGrid.tsx` — 36×15 explicit placement, current card set finalized

### Phase 16 — LogCard (Live System Monitor) ✅
- `src/lib/logEvents.ts` — discriminated union event bus (`emitLog` / `onLog`); SSR-safe; event types: `game:start`, `game:move`, `game:end`, `api:start`, `api:done`, `user:action`
- `src/components/bento/LogCard.tsx` — two modes: **log** (monospace terminal feed, max 13 entries, `logFadeIn` animation) and **flow** (5-node pipeline: User → Frontend → API → AI Engine → Response, 280ms/step); queue system serializes overlapping events; module-level `startupFired` guard for StrictMode; ambient Spotify/GitHub logs on randomized intervals
- `src/components/bento/BuildCard.tsx` — now emits 6 log events at game start, human move, API call start/done (with real latency), and game end
