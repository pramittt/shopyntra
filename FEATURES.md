# Shopyntra — features and implementation

This document describes what the app does and how the main pieces fit together. It is aimed at developers onboarding to the codebase or extending behavior.

## Overview

**Shopyntra** is a React demo storefront for **catalog search** powered by **SearchSpring**. Users search products, filter and sort results, scroll through an infinite product grid, and manage a **bag** and **wishlist** with size-aware line items. State persists in `localStorage` for cart, wishlist, and recent searches.

## Tech stack

| Layer | Choice |
|--------|--------|
| UI | React 19, TypeScript |
| Build | Vite |
| Styling | CSS Modules + global tokens in `src/index.css` |
| Class names | `clsx` via `src/lib/cn.ts` |

## High-level layout

```
App (CartProvider → WishlistProvider)
├── AppNav          — sticky top bar; wishlist + bag icons with counts
├── SearchPage      — search, filters, sort, infinite results grid
├── CartSidePanel   — slides in from the right
├── WishlistSidePanel — slides in from the right
└── CartSnackbar    — toast after cart / wishlist actions
```

Data flow for search:

`SearchPage` → **`useProductSearch`** → **`fetchSearchResults`** → **`ISearchResponse`** / **`ISearchProduct`**

## Type organization

Domain and UI types use an **`I` prefix** on interfaces (e.g. `ISearchProduct`, `ICartLineItem`). Each feature or component folder can expose a local **`types.ts`**:

| Location | Examples |
|----------|----------|
| `src/features/search/api/types.ts` | `ISearchProduct`, `ISearchResponse`, `IActiveFilter`, `ISortSelection`, `IPriceRange` |
| `src/context/types.ts` | `ICartLineItem`, `ICartContextValue`, `IWishlistEntry` |
| `src/features/search/components/types.ts` | `IFacetPanelProps`, `ISortSelectProps` |
| Component folders | `IProductCardProps`, `ILeftSidePanelProps`, etc. |

`searchApi.ts` re-exports API types via `export * from './types'`.

## Search and API

### Endpoint

- **`src/features/search/api/searchApi.ts`** builds URLs to SearchSpring `search.json` using **`SEARCH_SITE_ID`** (`scmq7n`), `resultsFormat=native`, and **`RESULTS_PER_PAGE`** (48).
- Query params: `q`, `page`, `resultsPerPage`, `filter.{field}`, `sort.{field}`.
- **`fetchSearchResults`** supports **`AbortSignal`** for cancellation.

### Filters and sort

- **Facet filters** — `filter.{field}={value}` from **`IActiveFilter[]`**.
- **Price range** — `filter.price.low` and `filter.price.high` via **`withPriceRange`**, **`parsePriceRangeFromFilters`**, **`getPriceBounds`**.
- **Sort** — `sort.{field}=asc|desc`; UI default “Best match” omits sort params (relevance).
- Helpers: **`stableFiltersKey`**, **`sortKey`**, **`parseAmount`**, **`getProductSizes`**, **`abbreviateSizeLabel`**, **`parseQuantityAvailable`**, **`isLowStock`**.

### Search hook (`useProductSearch`)

**`src/features/search/hooks/useProductSearch.ts`** owns:

- Input vs **submitted** query (search on submit or recent-term pick).
- **Active filters**, **sort selection**, and **price bounds** derived from facet catalog.
- **Infinite scroll** — appends pages with **`dedupeAppend`**; **`hasMore`** / **`loadMore`** from pagination.
- **Loading** / **loadingMore** / **error** states.
- **Facet catalog ref** — keeps facet UI when a filtered response returns no facet payload (e.g. zero results).
- Scroll-to-results on filter/sort change via **`topNavId`**.

#### Session cache

- In-memory **`Map`** keyed by **`sessionCacheKey(query, page, sort, filtersKey)`**.
- Max **40** entries (**`SEARCH_SESSION_CACHE_MAX`**); evicts oldest on overflow.

#### Recent searches

- Up to **5** terms in **`localStorage`** (`shopyntra_recent_searches`) via **`recentSearches.ts`**.

## Search page UI

### Toolbar (sticky)

**`ResultsToolbar`** sits below the nav (`top: 52px`) while scrolling results:

- **Filter** / **Sort** buttons on the left — open **`LeftSidePanel`** drawers from the left (mirror of bag/wishlist from the right).
- Toggle open/closed with a **cross icon** on the active button; panel header also has a close control.
- **“Showing X of Y”** on the right when results exist.
- **`ActiveFilterChips`** — removable chips for applied filters (including price range); **Clear all** when multiple are active.

### Filter panel

**`FacetPanel`** inside **`LeftSidePanel`**:

- Facet value lists (color facet hidden in UI).
- Color swatches via **`colorSwatch.ts`** when facet type is palette.
- **`PriceRangeFilter`** — dual range sliders; **debounced commit on change** (~350ms) plus immediate flush on release; reads live input values to avoid stale state.

### Sort panel

**`SortSelect`** (sheet variant in left panel) — list options; **“Best match”** when no sort; API `relevance` options excluded from the list.

### Results

- **`ProductGrid`** — skeleton grid while loading; main grid + trailing skeletons while **`loadingMore`**.
- **IntersectionObserver** sentinel triggers **`loadMore`** near the viewport bottom.
- Empty and end-of-results copy.

## Product card

**`ProductCard`** — image (prefers **`imageUrl`**, falls back to thumbnail), **sale** badge, **wishlist** heart, **quick-add** bag control.

- **Sizes** — from `size_dress` / `size` / `size_universal`; chips abbreviated via **`abbreviateSizeLabel`**.
- **Quick add** — no sizes: add directly; with sizes: overlay picker, then **`addItem(product, { size })`**.
- **Wishlist** — **`toggleWishlist`**.
- **Brand**, **name**, truncated **description** (`truncate.ts`, 150 chars).
- **Price** / strikethrough **MSRP**; **“Only few left”** when **`isLowStock`** on **`quantity_available`**.

Sale badge and image zoom use CSS animations with **`prefers-reduced-motion`** fallbacks.

## Cart

**`CartContext`** (`shopyntra-cart` in **`localStorage`**):

- Lines keyed by **`lineId`** = `productId` + optional size.
- **`addItem`** validates size when product has sizes; **snackbar** feedback.
- **`removeLine`**, **`setLineQuantity`**, **`clearCart`**, **`subtotal`** via **`parseAmount`**.
- **`CartSidePanel`** — right drawer; quantity controls; **Save for later** → wishlist via **`cartLineToSearchProduct`**.

## Wishlist

**`WishlistContext`** (`shopyntra-wishlist` in **`localStorage`**):

- **`toggleWishlist`**, **`upsertWishlistProduct`**, **`removeFromWishlist`**, **`isInWishlist`**.
- Opening wishlist closes cart (and vice versa via nav).
- **`WishlistSidePanel`** — **Move to bag** with size picker when needed.

## Side panels

| Component | Side | z-index | Portal |
|-----------|------|---------|--------|
| **`LeftSidePanel`** | Left | 300–301 | `document.body` |
| **`CartSidePanel`** / **`WishlistSidePanel`** | Right | 300–301 | In-tree |

Left panels start below the nav (`top: 52px`). Backdrop click and **Escape** close panels.

## Navigation

**`AppNav`** — sticky brand + wishlist/bag icon buttons with count badges.

## Styling conventions

- CSS Modules per component.
- Global tokens in **`src/index.css`** (Myntra-inspired pink accent, neutrals, shadows).
- **`cn()`** for conditional class names.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + production bundle |
| `npm run lint` | ESLint |
| `npm run preview` | Preview production build |

## Extending the app

- **New product fields** — Add to **`ISearchProduct`** in **`src/features/search/api/types.ts`**, then use in **`ProductCard`** or normalizers in **`fetchSearchResults`** if needed.
- **New filters** — Extend **`FacetPanel`** / **`useProductSearch`** toggle logic; ensure **`stableFiltersKey`** covers new filter fields.
- **Site ID** — Parameterize **`SEARCH_SITE_ID`** in **`searchApi.ts`** (public JSON API only today).
- **Cart / wishlist** — Extend **`ICartLineItem`** / **`IWishlistEntry`** in **`src/context/types.ts`** and persistence normalizers in contexts.
