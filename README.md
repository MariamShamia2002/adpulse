# AdPulse

AdPulse is a marketing analytics dashboard for overview KPIs, spend/revenue charts, and campaign drill-down. The frontend talks to a read-only HTTP API; field names, units, and error shapes come from the API and are not reinvented in the UI.

## Stack

- React 19 + TypeScript + Vite
- React Router v7 (`react-router`)
- TanStack React Query v5 (server state)
- Zod 4 (API response validation)
- Tailwind CSS v4 + shadcn/ui (Base UI) + Recharts
- date-fns + Lucide icons

No Zustand, no form libraries, and no auth in scope. Shareable UI state lives in the URL; local React state is only for component-local toggles (e.g. donut Chart/Table).

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

Vite requires `VITE_API_URL`. Without it, `dev` / `build` fail at startup.

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run lint` | Oxlint |
| `npm run preview` | Preview the production build |

## Environment

```bash
# Deployed API (default in .env.example)
VITE_API_URL=https://adpulse-server-production.up.railway.app

# Local backend
# VITE_API_URL=http://localhost:3000
```

- `VITE_API_URL` is the **server root**, without `/api`
- Endpoint paths include `/api` (e.g. `/api/overview/summary`)
- Always use `https://` for the deployed host

Health check: `GET {VITE_API_URL}/api/health`

## Routes

| Path | Page |
| --- | --- |
| `/` | Overview |
| `/campaigns/:id` | Campaign detail |

Settings appears in the top nav as a link only (no page in scope). There is no `/campaigns` index route; campaign rows navigate to `/campaigns/:id`.

### URL state (planned / handover)

Overview: `from`, `to`, `platform`, `compare`, `sort`, `dir`, `page`, `q`  
Campaign detail: `from`, `to`, `compare`, `metric`, `tab`

- `from` / `to` are `YYYY-MM-DD` and always sent together
- Platform: `all` \| `meta` \| `google` \| `tiktok`
- `compare=true` only when the compare toggle is on (defaults on for a first visit)

## Architecture

```text
src/
├── api/                 # fetch client + ApiError helpers
├── app/                 # QueryClient
├── components/ui/       # shadcn primitives
├── features/
│   ├── overview/        # overview API, hooks, schemas, pages
│   └── campaigns/       # campaign detail feature
├── layout/              # AppShell
├── shared/              # EmptyState, ErrorState, CardSkeleton, formatters
├── router.tsx
└── index.css            # Tailwind + AdPulse design tokens
```

Conventions:

- Pages/layouts use default exports; everything else uses named exports
- Import order: external → `@/` → relative
- Charts receive shaped data via props; hooks own fetching + Zod validation
- Do not recalculate API-provided metrics/ratios
- Use design tokens (`bg-page`, `text-text-muted`, `border-border`, series colors, etc.) — no hard-coded hex in components
- Borders, not drop shadows; static loading skeletons (no shimmer)

### API client

- `src/api/client.ts` — `apiGet`, `getApiUrl` (CSV downloads)
- `src/api/errors.ts` — `ApiError`, `isApiError`, `isValidationError` (400), `getErrorMessage`
- Network failures throw `ApiError` with `status: 0`
- React Query retries transient errors (5xx / network); it does **not** retry 4xx

## Current status

Foundation is in place: shell, routing, API client, QueryClient, design tokens, shared loading/empty/error stubs, and placeholder Overview / Campaign Detail pages.

Dashboard charts, filters, tables, and campaign interactions are still to be implemented against the design handover and API contract.

## Design source of truth

When sources disagree, prefer this order:

1. **API** — fields, units, errors  
2. **Interactive prototype** — layout and interactions  
3. **Design handover** — data states, responsive rules, accessibility, formatting
