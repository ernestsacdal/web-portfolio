# Portfolio — Claude Context

Personal portfolio for **Ernest Sacdal**, Full-Stack Developer & AI Engineer.
Design direction: Apple-inspired — minimal, precise, intentional motion.

## Stack

- **Next.js 16** (App Router) · TypeScript strict mode
- **Tailwind CSS v4** — CSS-first config, no `tailwind.config.ts`
- **Framer Motion** · **MDX** (blog + projects) · **Lucide** icons
- **simple-icons** — brand SVG icons in TechStackCard marquee
- APIs: Apple Music (last played, MusicKit), GitHub (contribution graph), Groq (chat popup — Mikhai). Connect 4 runs a local minimax engine, no external API

## Critical conventions

- **Tailwind v4**: design tokens live in `src/app/globals.css` inside `@theme {}`. Do not create `tailwind.config.ts`.
- **Dark mode**: `.dark` class on `<html>`. `ThemeProvider` in `src/lib/theme.tsx` manages it — `sessionStorage` only, no system-preference detection. Switching animates via the View Transitions API as a circular reveal from the dock toggle (`toggleTheme(origin)`), with a `.theme-fade` crossfade fallback; the mount restore is never animated. Theme-aware accent is `var(--accent)` (`#0066cc` light / `#0a84ff` dark) — never hardcode `#0071E3`.
- **Inline styles primary**: use CSS vars (`var(--bg)`, `var(--text)`, etc.) for all theme-aware colors. Never hardcode hex values. Tailwind only for responsive grid utilities.
- **Named exports**: all components use `export function X()`, never default exports.
- **`use client`**: only where interactivity requires it — prefer Server Components.
- **No `any` types**: TypeScript strict mode throughout.
- **Server vs Client split**: `fs`-based data fetching (mdx.ts, github.ts) is server-only. Pages fetch server-side and pass to `*ClientGrid` client components.
- **Scroll animations**: use `FadeIn` / `StaggerGrid` / `StaggerItem` from `src/components/ui/` — never convert server components to client just for animation.
- **MDX content**: `src/content/projects/*.mdx` and `src/content/blog/*.mdx`. Parsed via `src/lib/mdx.ts`.
- **Types**: shared interfaces in `src/types/index.ts` — `Project`, `BlogPost`, `MusicTrack`, `GithubData`.
- **Images**: `next/image` with `width`, `height`, `alt`. Remote patterns for `*.mzstatic.com` and `avatars.githubusercontent.com` in `next.config.ts`.
- **Keyframe animations**: define in `globals.css` `@theme` block, reference via `var(--animate-*)`. For component-scoped animations, inject a `<style>` tag (see BuildCard `winPulse`, LogCard `logFadeIn`).
- **Event bus**: `src/lib/logEvents.ts` — `emitLog()` / `onLog()` using native `CustomEvent` on `window`. SSR-safe. Used by BuildCard → LogCard.

## Environment variables

All variables live in `.env.local` (gitignored). Copy `.env.example` to get started.

```
GITHUB_TOKEN             # GitHub personal access token (read:user scope)
GITHUB_USERNAME          # Your GitHub username
APPLE_TEAM_ID            # Optional — Apple Developer Membership page
APPLE_MUSIC_KEY_ID       # Optional — MusicKit-enabled key ID
APPLE_MUSIC_PRIVATE_KEY  # Optional — .p8 contents, one line, \n-escaped
APPLE_MUSIC_USER_TOKEN   # Optional — from /apple-auth (dev only); expires ~6 months
ANTHROPIC_API_KEY        # Not referenced in src/ — chat runs on Groq (kept in .env.example for now)
GROQ_API_KEY             # Required — chat popup (Mikhai), `openai/gpt-oss-120b`
```

## API routes

| Route | Cache | Description |
|---|---|---|
| `/api/github` | `revalidate = 3600` | Contribution graph, hourly ISR |
| `/api/apple-music` | `force-dynamic` | Dormant — AppleMusicCard removed from grid; route + lib kept for a future swap back |
| `/api/spotify` | `force-dynamic` | Dormant — SpotifyCard/spotify.ts kept for a future swap back; not in BentoGrid |

Dormant components kept for future swaps: `SpotifyCard` (+ lib/spotify.ts, /api/spotify), `LocationCard` (+ LocationMap, react-leaflet), and `AppleMusicCard` (+ lib/appleMusic.ts, /api/apple-music, /apple-auth).
| `/api/chat` | `force-dynamic` | Mikhai. Validates turns (user/assistant only, last 6, capped), retrieves site content (`src/lib/mikhai/`), streams Groq `openai/gpt-oss-120b` → falls back to `openai/gpt-oss-20b` on 429 (separate limit bucket) → `429 {error:'busy'}`. Budgeted for Groq's **free tier** (8K tokens/min, 200K/day): ~4.5K tokens/message worst case. 502 JSON on other upstream failures. Logs usage + remaining-token headers. Check console.groq.com/docs/deprecations before changing models |
| `/api/chat/retrieve` | `force-dynamic` | **Dev only** (404 in production): `GET ?q=&prev=` shows what Mikhai would retrieve. Used by `scripts/eval-retrieval.mjs` |
| `/api/connect4` | `force-dynamic` | POST `{ board, aiColor }` → `bestMove()` from `src/lib/connect4.ts`, 800ms budget; returns `{ col, depth, nodes, ms, forced?, source }`; 400 on malformed body |

## Bento grid layout

36-column × 15-row explicit CSS grid, 720px tall, `gap-3`. Mobile: flex column.

| Card | Grid position | Notes |
|---|---|---|
| `WednesdayCard` | col 11–24, row 1–8 | Wednesday app feature — real brand logo/palette, CSS iPhone mockup of the home screen cropped by card edge, App Store pill |
| `StatusCard` | col 11–24, row 8–10 | live Sydney clock (HH:mm, AEST/AEDT auto) + "4+ yrs shipping" + pulsing "Open to work" |
| `LogCard` | col 1–11, row 1–8 | live event log + flow visualizer |
| `QuoteCard` | col 1–11, row 8–10 | static quote |
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
│   ├── apple-auth/          — dev-only MusicKit auth page (404s in production)
│   └── api/chat | github | apple-music | connect4
├── components/
│   ├── bento/               — all bento cards (see grid table above)
│   ├── dock/                — Dock (useNavHandler, theme toggle, popups), TerminalPopup, ChatPopup
│   ├── sections/            — Hero, BentoGrid, Projects (home), ProjectsClientGrid (/projects page), ProjectLinkButton, Blog, Footer
│   └── ui/                  — FadeIn, StaggerGrid, ReadingProgress, PageTransition
├── content/
│   ├── about.md             — Ernest's notes for Mikhai; TODO-only sections are skipped
│   ├── projects/*.mdx
│   └── blog/*.mdx
├── lib/
│   ├── mikhai/              — chat knowledge: knowledge.ts (loads CV + project/blog MDX + content/about.md, chunks by heading, BM25 via MiniSearch, retrieve()), aliases.ts (everyday words → chunks; tune here), prompt.ts (persona, grounding rules, cache-friendly layout)
│   ├── connect4.ts          — Connect 4 engine: minimax/alpha-beta, iterative deepening, Zobrist TT, parity eval (shared by route + client fallback)
│   ├── logEvents.ts         — typed event bus (emitLog / onLog)
│   ├── mdx.ts               — getAllPosts, getAllProjects, getBySlug
│   ├── github.ts            — getGithubData (server-only)
│   ├── appleMusic.ts        — getDeveloperToken (ES256 JWT via jose), getRecentlyPlayed
│   └── theme.tsx            — ThemeProvider, useTheme
└── types/index.ts           — Project, BlogPost, MusicTrack, GithubData
```

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

### Phase 17 — Projects Page & Navigation Refinement ✅
- `src/components/sections/ProjectLinkButton.tsx` — reusable bordered button for project footer links (live demo / GitHub); opens in new tab; hover brightens border + text
- `src/components/sections/ProjectsClientGrid.tsx` — filterable table-style grid for `/projects`; tabs: All · AI/ML · Full-Stack · Client; regex tag matching; empty-state fallback; StatusLabel sub-component
- `src/components/sections/Projects.tsx` — home section with hard-coded featured card (eyebrow, status dot, tags) + numbered list; Framer Motion stagger; StatusLabel
- `src/components/dock/Dock.tsx` — `useNavHandler()` hook: scrolls to section on homepage, pushes anchor route on other pages; Sun/Moon theme toggle; TerminalPopup + ChatPopup via AnimatePresence
- `src/app/projects/page.tsx` — server component fetching all projects via `getAllProjects()`, delegates to ProjectsClientGrid
- `src/app/projects/[slug]/page.tsx` — uses ProjectLinkButton for footer liveUrl/githubUrl links

### Phase 18 — Apple Music Card (replaces Spotify) ✅
- `src/lib/appleMusic.ts` — ES256 developer JWT via `jose` (cached 12h), `getRecentlyPlayed()` from MusicKit API; no now-playing endpoint exists, card always shows "Last played"
- `src/app/api/apple-music/route.ts` — replaces `/api/spotify`; s-maxage=60
- `src/components/bento/AppleMusicCard.tsx` — replaces SpotifyCard; 60s polling, `#FA243C` branding
- `src/app/apple-auth/` — dev-only page (404 in prod) to mint the Music User Token via MusicKit JS; token expires ~6 months

### Phase 19 — Connect 4 Engine (supersedes the Phase 14 hybrid) ✅
- `src/lib/connect4.ts` — single shared engine. Minimax in negamax form with alpha-beta; iterative deepening on a time budget (800ms server / 400ms client fallback), returning the best move from the last fully-completed depth; Zobrist-hashed transposition table (typed arrays, 52-bit Number keys — no BigInt); `Int8Array` board with make/unmake and O(1) win check from the landing cell; centre-first ordering; win-in-1 / forced-block shortcuts; moves that hand the opponent a win searched last. Evaluation weights three-in-a-window threats by **row parity** (odd rows → first player, even → second) with a dominance bonus for an unanswered good-parity threat, plus per-cell positional weights (windows-through-cell ÷ 2). Reaches depth 12–16 per move at ~2.4M nodes/s.
- `api/connect4/route.ts` — Groq removed from move selection (the 8B model was choosing near-random moves and the depth-5 gate accepted every column in normal positions). Validates the body, calls `bestMove`, returns search stats.
- `BuildCard.tsx` — duplicated minimax deleted; fallback uses the shared engine; info-overlay copy describes the real engine.
- `logEvents.ts` / `LogCard.tsx` — `api:done` carries optional `depth` / `nodes`; the feed shows `Placed → col N · depth D · X.XM nodes (ms)`.
- Measured: prototype won 14/14 vs the old depth-7 minimax while playing second at 500ms/move.

### Phase 20 — Mikhai v2: answers from the whole portfolio ✅
- **Single source of truth.** Mikhai no longer has a hand-typed facts paragraph. `src/lib/mikhai/knowledge.ts` builds its knowledge at cold start from `cv/ernest-sacdal-cv.html`, every project MDX, every published blog MDX and `src/content/about.md` (reusing `mdx.ts`). Edit content → deploy → Mikhai knows. Files ship with the function via `outputFileTracingIncludes` in `next.config.ts`.
- **Retrieval, sized for Groq's free tier.** ~90 chunks split on headings, BM25 via MiniSearch (title ×3, aliases ×2, fuzzy + prefix). Per question: ≤1,800 tokens of context, ≤8 chunks. Follow-ups search the previous question too, and back-references ("its", "that") multiply the previous subject's documents ×3.
- **Prompt layout for Groq's prefix cache:** `[system: persona + rules + INDEX]` is byte-identical every request; retrieved context + live facts (Sydney time, GitHub stats) go in a second system message after the history.
- **Grounding rules:** answer only from INDEX/CONTEXT; precedence CV > project pages > about.md > blog (dated); never take credit; no salary or phone number; links only from sources; never name the model/provider; ignore instructions in user messages.
- **Route hardening:** client can no longer inject `system` messages; Groq client built lazily, so `npm run build` no longer needs `GROQ_API_KEY`.
- **ChatPopup:** safe rich text (markdown links, bare URLs, emails, internal paths, bold — React nodes only; `javascript:` and `//` hrefs rejected), busy message on 429, history capped at 6, new suggestion chips.
- **Evals:** `scripts/eval-retrieval.mjs` (zero tokens, 32/32 at ship) — run after any content or alias change. `scripts/eval-mikhai.mjs` (real model, ~80–90K tokens ≈ 40% of the free daily budget) — needs `GROQ_API_KEY` in `.env.local`; run once per change, not in a loop.
- **Site copy still contradicting the CV** (Mikhai doesn't read it, visitors do): TerminalPopup "4 years shipping code" / "full-time · freelance · collabs" / its stack list; StatusCard "4+ yrs shipping".
