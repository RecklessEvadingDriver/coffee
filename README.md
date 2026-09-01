# CINDER — Small-Batch Coffee Roasters

A specialty-coffee e-commerce demo with a working storefront and a staff-side back
office. Add coffees in the admin console and watch them land on the shelf in real
time; check out and watch the stock drain. All data persists in the browser — there
is no server.

## Features

### Storefront
- **Product shelf** rendered as a menu ledger — numbered rows, dotted leaders,
  roast-level meters, per-250 g pricing, badge stamps, sold-out and low-stock states
- **Search & filters** — live search across name, origin, region, process, producer
  and tasting notes; category filters (Single Origin, Blends, Decaf, Microlot) with
  counts; sorting by price or roast
- **Product details** — origin, altitude, varietal, producer, process, roast level,
  tasting notes, a per-method brew guide, and 250 g / 1 kg bag sizes
- **Cart drawer** — quantity steppers capped at real stock, line removal, free-
  shipping progress meter ($45 threshold), live totals
- **Simulated checkout** — validated form (email, shipping, card), animated
  processing stages, stamped confirmation with order number; completing an order
  decrements actual stock, so items can genuinely sell out
- **Roast log** — the week's roasting ledger dated relative to today, plus a
  house dial-in recipe card

### Back office (`Staff entrance` in the footer, or the gear icon in the header)
- Passcode gate — demo code **`2210`**
- Inventory dashboard — lots on shelf, bags in stock, stockroom retail value,
  sold-out count, low-stock callout
- Product ledger — search + category filter, color-coded stock pills, inline
  delete with confirm, edit in place
- Add / edit form — full product model with validation, roast-level slider,
  tasting-note parsing, label-accent picker, and bag photography via file upload
  (≤ 4 MB), URL, or the built-in sample gallery
- Reset-to-demo button restores the original six-coffee lineup

## Tech stack

- **React 18 + TypeScript + Vite**
- **Tailwind CSS v4** (theme tokens, keyframes and component classes in `src/index.css`)
- Custom SVG icon set (`src/components/icons.tsx`) — no icon library
- `useSyncExternalStore`-backed client store with `localStorage` persistence
- Type: Fraunces (display) + Manrope (body) via Google Fonts

## Getting started

```bash
npm install
npm run dev        # local dev server
npm run build      # production build → dist/
npm run typecheck  # tsc --noEmit
```

No environment variables, no API keys, no backend.

## Demo walkthrough

1. **Shop** — add a few coffees to the bag. The toast confirms; the header badge
   pops. Try the search box and the category rail.
2. **Details** — click any row for the full modal; pick 1 kg bags or multiple
   quantities.
3. **Checkout** — the form only validates shape, not truth; any well-formed email
   and 16-digit card number will pass. Watch stock drop afterward.
4. **Back office** — open the staff entrance, enter `2210`, add a coffee (the
   sample gallery makes it easy), then switch back to the storefront — it's
   already on the shelf.
5. **Persistence** — reload the page; everything you added and every stock change
   survives. Open the site in two tabs and edit in one — the other updates
   instantly. Reset data from the back office to start over.

## Data & persistence

Products live under the `localStorage` key `cinder:products:v2`. On load, stored
data is validated and coerced (types, roast range 1–5, category whitelist,
non-negative price/stock) — corrupt or hand-edited entries fall back safely to the
demo catalog. Checkout decrements stock through the same store that powers the
storefront and the admin table, so all three views stay consistent.

### Product model (`src/data/products.ts`)

| Field       | Description                                            |
| ----------- | ------------------------------------------------------ |
| `name`      | Display name of the lot                                |
| `origin` / `region` | Country and growing region                     |
| `category`  | `Single Origin` · `Blends` · `Decaf` · `Microlot`      |
| `process` / `varietal` / `altitude` / `producer` | Traceability details |
| `roast`     | 1 (light) – 5 (dark)                                   |
| `notes`     | Tasting notes shown on the card and in search          |
| `price`     | Per 250 g bag; 1 kg bags are priced at 3.4×            |
| `stock`     | Bags on hand; 0 renders the lot as sold out            |
| `accent`    | Label color used for chips and category text           |
| `brewGuide` | Three method/ratio/temperature/time rows               |

## Project structure

```
src/
├── App.tsx                    # state, cart math, view switching, toasts
├── index.css                  # Tailwind v4 theme, keyframes, component classes
├── data/products.ts           # product model + six seeded coffees
├── lib/
│   ├── store.ts               # useSyncExternalStore + localStorage persistence
│   └── useBodyLock.ts         # iOS-safe modal scroll lock
└── components/
    ├── Header.tsx · Hero.tsx · ShopSection.tsx
    ├── RoastLog.tsx · ProductModal.tsx · CartDrawer.tsx · CheckoutModal.tsx
    ├── icons.tsx · ui.tsx     # custom SVG icons, steppers, meters, reveals
    └── admin/
        ├── AdminDashboard.tsx   # gate, stats, product ledger
        └── ProductFormModal.tsx # add/edit form with image handling
```

## Notes & limitations

- **This is a front-end demo.** Checkout simulates payment; nothing is charged or
  transmitted.
- **The admin passcode is client-side only** — a UI gate, not security. A real
  deployment would need server-side auth.
- Cart state is per-session (in-memory); product data and stock persist across
  reloads.
- All imagery is bundled or referenced from the seeded catalog; uploads are stored
  as data URLs and capped at 4 MB to stay within browser storage limits.
