# Portfolio — Claude Context

Personal portfolio for **Ernest Sacdal**, Full-Stack Developer & AI Engineer.
Design direction: Apple-inspired — minimal, precise, intentional motion.

## Stack

- **Next.js 16** (App Router) · TypeScript strict mode
- **Tailwind CSS v4** — CSS-first config, no `tailwind.config.ts`
- **Framer Motion** · **MDX** (blog + projects) · **Lucide** icons
- **Leaflet / React-Leaflet** (location card)
- APIs: Spotify (now playing), GitHub (contribution graph), Claude AI (chat popup)

## Critical conventions

- **Tailwind v4**: design tokens live in `src/app/globals.css` inside `@theme {}`. Do not create `tailwind.config.ts`.
- **Dark mode**: `.dark` class on `<html>`. `ThemeProvider` in `src/lib/theme.tsx` manages it (localStorage + system preference).
- **MDX content**: `src/content/projects/*.mdx` and `src/content/blog/*.mdx`. Parsed server-side via `src/lib/mdx.ts` (gray-matter + reading-time).
- **Types**: all shared interfaces in `src/types/index.ts` — `Project`, `BlogPost`, `SpotifyTrack`, `GithubData`.

## Environment variables required

```
SPOTIFY_CLIENT_ID
SPOTIFY_CLIENT_SECRET
SPOTIFY_REFRESH_TOKEN
GITHUB_TOKEN
```

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

Requires `ANTHROPIC_API_KEY` in `.env.local` for chat to work.

### Phase 4 — Components (pending)
Hero, BentoGrid, all bento cards, section layouts.

### Phase 3+ (pending)
Page implementations, API routes, animations, MDX rendering.
