# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server at http://localhost:3000
npm run build    # production build (also type-checks)
npm run start    # serve production build
npx next lint    # ESLint via Next.js built-in config (no .eslintrc — uses next/core-web-vitals)
npx tsc --noEmit # standalone type-check without building
```

No test runner is configured.

## Architecture

**Stack:** Next.js 15 App Router + React 19 + TypeScript. No CSS framework — all styles in one file (`app/globals.css`, BEM naming). Only runtime dependency beyond Next.js is `fast-xml-parser`.

**Data source:** Mave.digital RSS feed (`https://cloud.mave.digital/54964`). `lib/episodes.ts` fetches and parses it into `Episode[]`. The page uses `export const revalidate = 3600` for ISR — no manual cache invalidation.

**RSC / Client split:** `app/page.tsx` is a server component that renders the episode grid. `AudioPlayer` and `MobileControls` are `'use client'` islands. They communicate with server-rendered DOM elements via `data-*` attributes and class mutations (`.is-playing` on `.ep` cards, `#sidebar`/`#sidebarMask`/`#burgerBtn` by ID). This is intentional — it avoids lifting audio state through the RSC boundary.

**Styling conventions:**
- All CSS lives in `app/globals.css` — no CSS modules, no styled-components
- BEM-like naming: `sidebar__title`, `ep__thumb`, `player__seek`
- CSS custom properties: `--cream: #fef2e2`, `--gray: #a3a3a3`, `--sidebar-w: 240px`
- Responsive breakpoints: `≤960px` (mobile: sidebar slides in, single-column grid), `961–1300px` (2-column grid), `>1300px` (3-column grid)
- Seek bar progress uses a CSS custom property `--seek-pct` set via JS

**Fonts:**
- Inter Tight — loaded via `next/font/google` in `layout.tsx`
- Episode titles use Impact (system font) as a bold condensed display face.

**Path alias:** `@/*` maps to the repo root (e.g. `@/lib/episodes`, `@/components/Sidebar`).

**Images:** `next/image` is not used — plain `<img loading="lazy">` throughout. `cdn.mave.digital` is whitelisted in `next.config.ts` for the cases where `next/image` might be added later.
