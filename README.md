# Portfolio

Personal portfolio for Ernest Sacdal — Full-Stack Developer & AI Engineer.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, and Framer Motion.

---

## Stack

- **Next.js 16** — App Router, server components, static generation
- **TypeScript** — strict mode throughout
- **Tailwind CSS v4** — CSS-first config via `@theme {}` in `globals.css`
- **Framer Motion** — scroll animations, page transitions, stagger grids
- **MDX** — blog posts and project case studies in `src/content/`
- **Lucide React** — icons
- APIs: GitHub (contribution graph), Spotify (now playing), Anthropic Claude (chat popup)

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

See [Environment Variables](#environment-variables) below for details on each key.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GITHUB_TOKEN` | Yes | Personal access token — [create one](https://github.com/settings/tokens) with `read:user` scope |
| `GITHUB_USERNAME` | Yes | Your GitHub username |
| `ANTHROPIC_API_KEY` | Yes | API key from [Anthropic Console](https://console.anthropic.com/settings/api-keys) — powers the chat popup |
| `SPOTIFY_CLIENT_ID` | Optional | Spotify app client ID from [Developer Dashboard](https://developer.spotify.com/dashboard) |
| `SPOTIFY_CLIENT_SECRET` | Optional | Spotify app client secret |
| `SPOTIFY_REFRESH_TOKEN` | Optional | Long-lived refresh token ([guide](https://developer.spotify.com/documentation/web-api/tutorials/refreshing-tokens)) |

> The site works without Spotify credentials — the card shows a graceful placeholder.  
> GitHub and Anthropic keys are needed for the contribution graph and chat popup.

---

## Project Structure

```
src/
  app/                  # Next.js App Router pages + API routes
    api/chat/           # Claude-powered chat endpoint
    api/github/         # GitHub contribution data
    api/spotify/        # Spotify now-playing / recently-played
    blog/               # Blog index + [slug] pages
    projects/           # Projects index + [slug] pages
  components/
    bento/              # Bento grid cards (GitHub, Spotify, TechStack, etc.)
    dock/               # Floating dock (Dock, TerminalPopup, ChatPopup)
    sections/           # Page sections (Hero, BentoGrid, Projects, Blog, Footer)
    ui/                 # Shared UI primitives (FadeIn, StaggerGrid, ReadingProgress)
  content/
    blog/               # MDX blog posts
    projects/           # MDX project case studies
  lib/                  # Data fetching utilities (github.ts, spotify.ts, mdx.ts, theme.tsx)
  types/                # Shared TypeScript interfaces
```

---

## Content

### Adding a blog post

Create `src/content/blog/your-post-slug.mdx`:

```mdx
---
title: Your Post Title
description: A short description shown in cards.
date: '2025-06-01'
tag: Engineering
published: true
---

Your content here.
```

### Adding a project

Create `src/content/projects/your-project-slug.mdx`:

```mdx
---
title: Project Name
description: Short description.
tags: ['Next.js', 'Python']
status: live
year: '2025'
type: case-study
liveUrl: https://example.com
githubUrl: https://github.com/your-username/repo
---

Your case study content here.
```

Set `type: minimal` for a simple layout without MDX body content.

---

## Deployment

Deploy on [Vercel](https://vercel.com) — add all environment variables in the project settings.

```bash
npm run build   # verify a clean build locally first
```
