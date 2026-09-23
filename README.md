# Patek Philippe — Scroll-Driven Cinematic Experience

> **Live:** https://patek-philippe-web-bspx.vercel.app
> **Source:** https://github.com/biplabshankar27-code/Patek-Philippe-Web-App
> **Stack:** Next.js 14 (Pages Router) · TypeScript · GSAP · Lenis · motion · TailwindCSS 3

A luxury, scroll-driven cinematic watch website in the spirit of Cartier / Apple / Dior brand pages. A 47-second generated hero film is scrubbed frame-by-frame as the user scrolls through 12 scenes; five Patek Philippe timepieces are revealed at ambient loop points, each with its own product panel.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [How the Scroll Engine Works](#how-the-scroll-engine-works)
6. [Video Segment Timeline](#video-segment-timeline)
7. [Performance Rules](#performance-rules)
8. [Deployment](#deployment)
9. [Common Tasks](#common-tasks)
10. [Known Caveats](#known-caveats)

---

## Overview

**The experience, step by step:**

1. **Landing (IDLE)** — the golden-hall opening scene plays as a soft ambient loop (0.2s–2.8s window), with the "Patek Philippe / Genève · Since 1839" headline overlay and a pulsing gold scroll line.
2. **Scrub mode** — the user's scroll position maps 1:1 onto a timeline (10,340 px ≙ 47s of film). Seeking runs through a learing-smoothed RAF loop capped at 24 fps. Five watches appear with glass info panels:

| Video Scene | Watch | Price |
|---|---|---|
| Library Desk | Calatrava 5226G | $47,262 |
| Marina Rain | Nautilus 5712/1A | $48,000 |
| Ice Cavern | Grand Complication 5204G | $380,971 |
| Jungle Sunrays | Aquanaut 5168G | $88,898 |
| Desert Sunset | Golden Ellipse 3738/100G | $46,997 |

3. **Loop mode (ambient)** — pausing scroll for 550ms inside a scene's loop window switches its video window into a mini clip-on-play (e.g. candle flicker, rain, lightning). `LOOP → SCRUB` only the real scroll resumes (Lenis inertia is filtered). When resuming, video jumps forward to the scene's `scrollResume` point.
4. **Auto-reset** — past 98% scroll, after 1.5s, the page animates back to top (GSAP scrollTo 2.5s) and returns to IDLE.
5. **Keyboard** — `ArrowDown / ArrowUp` jump one scene in either direction, always landing **inside the target scene's loop window**.
6. **Below the fold** — Catalog (5 producing watches), Story (philosophy/craft panels with pull quote), Footer.

---

## Tech Stack

| Tool | Version | Notes |
|---|---|---|
| next | 14.2.x | Pages Router (not App Router) |
| react | 18.3.x | |
| typescript | 5.6.x | |
| gsap | 3.12.x | ScrollTrigger + ScrollToPlugin, all imports **dynamic** inside `useEffect` |
| lenis | 1.x | Not `@studio-freight/lenis`. Wired into GSAP ticker, `lagSmoothing(0)` |
| motion | 12.x | imported from `motion/react` (not `framer-motion`) |
| tailwindcss | 3.4.x | Layout only; all animated values are inline styles |
| lucide-react | — | icons |
| clsx + tailwind-merge | — | `cn()` in `lib/utils.ts` |

```bash
npm install
```

---

## Getting Started

```bash
npm run dev      # http://localhost:3000
npm run build    # production build check
npm run start    # serve the production build
npm run lint     # ESLint
```

> **Note:** the hero video lives at `public/video/master_scrollytelling_g1_opt.mp4`
> (the 33 MB optimized encode; the 167 MB master is excluded from git & deploys).

---

## Project Structure

```
PATEK Philippe WEB/
├── pages/
│   ├── _app.tsx          ← Lenis init + GSAP ticker + global <Header />
│   └── index.tsx         ← CustomCursor + Hero + Catalog + Story + Footer
├── sections/
│   ├── Hero.tsx          ← Scroll-driven video scrubber (main engine)
│   ├── Catalog.tsx       ← 5-card watch grid
│   ├── Story.tsx         ← 2-panel editorial layout
│   └── Footer.tsx        ← footer with IF seal + 3-column links
├── components/
│   ├── Header.tsx        ← fixed pill navbar + PP seal + dropdown
│   ├── FrameText.tsx     ← left glass panel (title/subtitle)
│   ├── BuyCard.tsx       ← right glass panel (price/notes/CTA)
│   ├── CustomCursor.tsx  ← gold dot + lagging ring
│   └── ui/
│       └── liquid-weather-glass.tsx  ← LiquidGlassCard
├── config/
│   └── frames.ts         ← ALL scene/frame data (edit site copy here)
├── styles/globals.css    ← design tokens, typography helpers, cursor CSS
└── public/video/
    ├── master_scrollytelling_g1.mp4      ← 167 MB source (git-ignored)
    └── master_scrollytelling_g1_opt.mp4  ← 33 MB scrub-friendly deploy encode
```

**Design tokens:** `bg #050509` · `champagne #F2D28B` · `ivory #F6F3F0` · `grey #9E9EAE` · Cormorant Garamond (display) + Inter (UI).

---

## How the Scroll Engine Works

```
scroll ─ Lenis (1.6s inertia) ─ ScrollTrigger.update ─ progress p (0→1)
     p × 47s = targetTime ── lerp (0.08) ── RAF
        (a) capped seek at 24fps (41.67ms)
        (b) seeks only if readyState≥2 and Δt>0.04s
        (c) 550ms of a no-progress shadow gap discovery → LOOP plays in-window
```

**Modes:** `IDLE` → (first scroll) → `SCRUB` → (pause 550ms in-loopable-scene) → `LOOP` → (real scroll) → `SCRUB` → (p > 0.98, 1.5s) → auto-reset → `IDLE`.

Key refs live in `sections/Hero.tsx`. Copy for the watch panels resides entirely in `config/frames.ts`.

---

## Video Segment Timeline

Segment timeline (seconds) is stored in `config/frames.ts:SEGMENTS`. It is calibrated **specifically** against `master_scrollytelling_g1.mp4` (47.0s). If you ever swap the video, you must **re-measure** every keyframe:

| # | Scene | Start–End | Loop window |
|---|---|---|---|
| 1 | Golden Hall Opening | 0–3 | — (transition) |
| 2 | Library Desk | 3–11 | **4–7** |
| 3 | Library → Marina | 7–11 | — |
| 4 | Marina Rain | 11–19 | **12–16** |
| 5 | Ice Cave Plunge | 16–19 | — |
| 6 | Ice Cavern | 19–26 | **20–23** |
| 7 | Ice → Jungle | 23–26 | — |
| 8 | Jungle Sunrays | 26–34 | **27–30** |
| 9 | Jungle → Desert | 30–34 | — |
| 10 | Desert Sunset | 34–43 | **36–39** |
| 11 | Return to Hall | 39–43 | — |
| 12 | Final Display | 43–47 | **44–46** |

**Re-measuring checklist (if the video changes):**
1. `transitionStart` — where the scene visibly begins
2. `transitionEnd` — when the scene is fully on-screen
3. `loopStart / loopEnd` — a calm 2–4s window (never crossing a cut)
4. `scrollResume` — last useful frame before the next scene
5. `TOTAL_VIDEO_DURATION` → recompute `TOTAL_SCROLL_PX = duration × PX_PER_SECOND (220)`

---

## Performance Rules (do not regress)

| Rule | Value | Why |
|---|---|---|
| Seek cap | 24 fps (41.67ms) | Video decoder chokes at 60fps seeks |
| Seek threshold | Δt > 0.04s | Skips meaningless micro-seeks |
| ReadyState guard | `>= 2` | Never seek without buffered data |
| Lerp factor | 0.08 | Cinematic but not mushy |
| Scroll-stop filter | Δprogress > 0.0008 | Ignores Lenis coast ticks (would kill LOOP) |
| LOOP trigger | 550ms of real stop | Stable pause detection |
| Deployment encode | 33 MB / CRF 23 / key-int 48 s / +faststart | Low bitrate keeps CDN scrubbing smooth |
| GPU layers | `translateZ(0)` + `will-change` on both videos | Forces compositor surface |
| Lenis | duration 1.6s, `gsap.ticker.lagSmoothing(0)` | Smooth and stable |

---

## Deployment

Production: **https://patek-philippe-web-bspx.vercel.app** (Vercel ↔ GitHub connected)

- `git push` → automatic build + deploy
- Pull requests → preview URLs
- `.vercelignore` / `.gitignore` keep the 167 MB master out of the repo and deploy cold-start small

Manual deploy (if ever needed):

```bash
npx vercel deploy --prod --yes
```

---

## Common Tasks

**Change watch copy / prices** → edit `config/frames.ts`.
**Change hero headline** → edit the "idle-title" block in `sections/Hero.tsx`.
**Swap the video** → re-encode to ~CRF 23 with `-g 48`, drop it in `public/video`, update `EXPERIENCE_VIDEO` in `config/frames.ts`, re-measure `SEGMENTS` (see above).
**Tune scroll pacing** → `PX_PER_SECOND` in `config/frames.ts` (higher = faster scroll-through).

---

## Known Caveats

- The 12 scenes are measured manually; if the source film is ever re-rendered, remeasure `SEGMENTS` before shipping.
- Global cursor is custom; touch devices fall back to the native cursor (no visible dot/ring).
- The `motion/react` package must **not** be installed as `framer-motion`; the import path differs.
- All demand for the video first-load is served from Vercel static CDN; consider moving hero media to Cloudinary/Mux if adding more scenes or 4K.
