# Shopyntra — features and implementation

This document describes what the app does and how the main pieces fit together. It is aimed at developers onboarding to the codebase or extending behavior.

## Overview

**Shopyntra** is a small React demo for **catalog search**: users enter a query, results load from the **SearchSpring** JSON API, and products render in a responsive grid with pagination, loading states, and product cards that highlight pricing and sale status.

## Tech stack

| Layer | Choice |
|--------|--------|
| UI | React 19, TypeScript |
| Build | Vite |
| Styling | CSS Modules + global tokens in `src/index.css` |
| Class names | `clsx` via `src/lib/cn.ts` |

## High-level layout

- **`App`** (`src/App.tsx`) — Shell with top navigation and the main search surface.
- **`SearchPage`** (`src/features/search/SearchPage.tsx`) — Search form, recent-search shortcuts, error and empty states, pagination, and **`ProductGrid`**.

Data flow: `SearchPage` → **`useProductSearch`** → **`fetchSearchResults`** → JSON mapped to **`SearchResponse`** / **`SearchProduct`**.

## Search and API

### Endpoint

- **`src/features/search/api/searchApi.ts`** builds a URL to SearchSpring’s `search.json` endpoint using a fixed **`SEARCH_SITE_ID`** and query params (`q`, `page`, `resultsFormat=native`, etc.).
- **`fetchSearchResults`** performs a `fetch` with an optional **`AbortSignal`** so in-flight requests are cancelled when the query or page changes.

### Types

- **`SearchProduct`** — `id`, optional `name`, `thumbnailImageUrl`, `price`, `msrp`, and optional **`on_sale`** as `string[]` (SearchSpring-style facets; the UI treats **`"Yes"`** in that array as on sale).
- **`SearchPagination`** / **`SearchResponse`** — Mirrors the API shape used by the UI for results and page controls.

### Search hook (`useProductSearch`)

**`src/features/search/hooks/useProductSearch.ts`** owns:

- Input value vs **submitted** query (search runs on submit / chosen recent term, not on every keystroke by default through this hook’s API).
- **Page** state and **`load(query, page)`** orchestration.
- **Abort** of the previous request when a new one starts.
- **Loading** and **error** state for the UI.

#### Session cache

- An in-memory **`Map`** keyed by **`sessionCacheKey(query, page)`** stores **`SearchResponse`** for the current browser session.
- **`rememberSearchSessionCache`** enforces a max size (**`SEARCH_SESSION_CACHE_MAX`**, 40 entries) by evicting the oldest key. Revisiting the same query/page avoids a network round-trip.

#### Recent searches

- **`src/features/search/lib/recentSearches.ts`** persists up to **5** distinct terms in **`localStorage`** (`shopyntra_recent_searches`), with safe parsing and quota handling.
- After a successful search for page **1**, the term is recorded and exposed to the UI for **`QuickSearch`**.

## Search page UI

- **`SearchForm`** — Controlled input; submit triggers **`runSearch`**.
- **`QuickSearch`** — Chips built from **`recentSearches`**; picking one calls **`startSearch(term)`** (sets query, resets to page 1, loads).
- **`PaginationBar`** (top and bottom) — Previous/next and a sliding window of page numbers; **`busy`** disables controls while loading. Changing page calls **`onPageChange`**, which reloads and scrolls the top pagination region into view for context.

## Product grid and loading

**`src/components/ProductGrid/ProductGrid.tsx`**:

- While **`loading`**, renders a grid of **`ProductSkeletonCard`** placeholders (staggered animation via CSS custom property **`--sk-delay`**), with **`VisuallyHidden`** “Loading results” and **`aria-live="polite"`** for assistive tech.
- When idle, maps **`products`** to **`ProductCard`** in a semantic **`<ul>` / `<li>`** list.

## Product card

**`src/components/ProductCard/ProductCard.tsx`** + **`ProductCard.module.css`**

### Content

- **Image** — Lazy-loaded when **`thumbnailImageUrl`** exists; fixed width/height hints for layout stability.
- **Placeholder** — Gradient block when there is no image.
- **Title** — `name` or “Untitled”; clamped to two lines in CSS.
- **Price** — Renders **`msrp`** struck through and current **`price`** in bold when **`parseAmount(msrp)`** is greater than **`parseAmount(price)`** (sale vs list logic independent of `on_sale`).

### Sale badge

- Shown when **`product.on_sale?.includes('Yes')`** (supports API values like `["Yes"]`).
- Markup: outer **`saleTag`**, inner **`saleTagText`** so animations can layer a shine **(`::after`)** under legible text (**`z-index`** stacking).

### Motion and hover (CSS)

- **Card** — Slightly stronger shadow on hover.
- **Image area** — **`overflow: hidden`** on **`imageWrap`**; **`.image`** (and placeholder) use **`transform: scale(...)`** with **`transition`** on card hover so the media zooms inside the frame without reflowing text.
- **Sale tag**
  - **`saleTagEnter`** — One-shot entrance (opacity + scale + small vertical motion, overshoot easing).
  - **`saleTagPulse`** — Repeating soft “ring” via animated **`box-shadow`**.
  - **`saleTagShine`** — Periodic skewed highlight sweep on **`::after`**.
  - **`.card:hover .saleTag`** — Slight scale-up on the badge when the whole card is hovered.
- **`prefers-reduced-motion: reduce`** — Animations on the tag and shine layer are disabled so the badge stays static and readable.

## Styling conventions

- **CSS Modules** per component (e.g. **`*.module.css`**).
- Shared palette and typography variables live in **`src/index.css`** (e.g. **`--accent`**, **`--text-h`**, **`--shadow-card`**), aligned with a Myntra-inspired look.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + production bundle |
| `npm run lint` | ESLint |
| `npm run preview` | Preview production build |

## Extending the app

- **New product fields** — Extend **`SearchProduct`** in **`searchApi.ts`**, then read them in **`ProductCard`** or other views. If the API nests fields differently, add a normalizer in **`fetchSearchResults`** before the rest of the app consumes data.
- **Different site / env** — Replace or parameterize **`SEARCH_SITE_ID`** and URL building in **`searchApi.ts`** (and avoid committing secrets; this integration is public JSON only).
- **Heavier motion** — Prefer keeping decorative animation in CSS; respect **`prefers-reduced-motion`** for anything looping or attention-grabbing.
