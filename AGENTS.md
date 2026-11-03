# AdPulse – Project Rules

## Stack

- React 19 + TypeScript, built with Vite
- Tailwind CSS v4 (via `@tailwindcss/vite`), shadcn/ui on Base UI primitives (`@base-ui/react`), `lucide-react` icons
- TanStack React Query v5 for server state
- React Router v7 (import from `react-router`, not `react-router-dom`)
- Zod 4 for API response validation (infer types with `z.infer`)
- Recharts via the shadcn chart wrapper (`ChartContainer`, `ChartConfig`)
- date-fns for dates; `Intl.NumberFormat('en-US')` for numbers

**Do not install or use:** Zustand, Redux, react-hook-form, `@hookform/resolvers`, or auth libraries. AdPulse has no login and no form-post flows.

## Sources of truth (in order)

1. **API** — field names, units, response shapes, errors. Base URL from `VITE_API_URL` (no `/api` suffix); paths include `/api`.
2. **Interactive prototype** — layout and interactions.
3. **Design handover** — data states, responsive rules, accessibility, formatting.

Do not invent endpoints, response fields, metrics, or business rules.

## Folder Structure

- `src/api/` — shared HTTP client (`client.ts`), error helpers (`errors.ts`), API types (`types.ts`)
- `src/components/ui/` — shadcn UI primitives (add with `npx shadcn@latest add <component>`; don't hand-edit unless needed)
- `src/shared/components/` — app-wide UI (`EmptyState`, `ErrorState`, `CardSkeleton`)
- `src/shared/utils/` — shared helpers (`formatters.ts`)
- `src/layout/` — app shell (`AppShell.tsx`)
- `src/lib/utils.ts` — `cn()` helper (from shadcn / `cn` package)
- `src/app/queryClient.ts` — shared `QueryClient`
- `src/router.tsx` — route definitions (`createBrowserRouter`)
- `src/features/<feature>/` — feature code (`overview`, `campaigns`), using only the subfolders it needs:
  - `api/` — API functions
  - `components/`, `pages/`, `hooks/`
  - `schemas/` — Zod schemas for API responses
  - `types/` — inferred or shared feature types
  - `lib/` — feature-specific helpers (labels, constants)

## Domain

- Read-only marketing analytics dashboard: overview KPIs/charts/table and campaign drill-down
- Routes only: `/` (Overview), `/campaigns/:id` (Campaign detail). No `/campaigns` index. Settings is a nav link only — no Settings page
- Shareable filter/sort/pagination/tab state lives in **URL search params**; React Query keys must include every param that affects the response
- Overview params: `from`, `to`, `platform`, `compare`, `sort`, `dir`, `page`, `q`
- Campaign detail params: `from`, `to`, `compare`, `metric`, `tab`
- `from` / `to` are `YYYY-MM-DD` and always sent together; platform: `all` | `meta` | `google` | `tiktok`; `compare=true` only when the toggle is on
- Cards own their own loading / error / empty / ready states; one failed request must not blank the page
- Charts receive already-shaped data via props and fetch nothing; hooks fetch + validate
- Never recalculate API-provided metrics or ratios; keep API field names and units unchanged
- Format currency, counts, ratios (`×`), percents, deltas, and dates via `src/shared/utils/formatters.ts`

## TypeScript

- All new files in TypeScript with strict typing (`strict: true` in root `tsconfig.json`)
- Prefer `interface` for object shapes; put shared types in the feature's `types/` folder
- Infer types from Zod schemas (`z.infer<typeof schema>`) instead of duplicating them
- Name component props `<ComponentName>Props`
- No `any`; use `unknown` and narrow

## Components

- Functional components with hooks
- Pages, layouts, and route components use `export default`; everything else uses named exports
- Order inside a component: hooks, derived values, handlers, early returns, JSX
- Move reusable logic into custom hooks
- Base UI composition uses the `render` prop, not `asChild`. A `Button` rendering a link: `<Button nativeButton={false} render={<Link to="/" />}>`

## Styling

- Tailwind classes only; `src/index.css` is the single global stylesheet (Tailwind + shadcn tokens + AdPulse design tokens)
- Use `cn()` for conditional classes
- Prefer AdPulse / theme tokens (`bg-page`, `bg-surface`, `text-text`, `text-text-muted`, `border-border`, series/status colors) over hard-coded hex
- Borders, not drop shadows
- Build on existing `src/components/ui/` components before creating new ones
- Every Recharts chart uses `ChartContainer` + `ChartConfig`; chart containers need `role="img"` and a meaningful `aria-label`
- Loading skeletons: static blocks matching content layout (no shimmer)

## Data Fetching

- All HTTP requests go through `src/api/client.ts` (`apiGet`, `getApiUrl` for CSV). Base URL from `VITE_API_URL` (required; enforced in `vite.config.ts`)
- Wrap API functions in React Query hooks in the feature's `hooks/` folder
- Use stable, structured query keys that include every filter/param affecting the data
- Handle loading, error, and empty states per card/section
- Client throws `ApiError` (with `status` and `body`); network failures use `status: 0`
- Global `QueryClient` does not retry 4xx; it retries transient 5xx / network errors
- Use helpers from `src/api/errors.ts`: `isApiError`, `isValidationError` (400), `getErrorMessage`
- Do not invent error shapes; follow the API contract. No auth helpers (`isUnauthorized`) and no field-error maps (no POST forms)

## State management

- URL search params are the source of truth for shareable dashboard state
- React Query owns server state
- Local React state only for handover-local UI (e.g. donut Chart/Table toggle)
- Do not duplicate URL state in React state
- Do not add a global client store

## Routing

- Define routes in `src/router.tsx` as children of `AppShell`
- Only `/` and `/campaigns/:id`
- Campaign table rows navigate to `/campaigns/:id`, preserving relevant `from` / `to` / `compare` params when implementing that feature

## Imports

Order imports as follows:

1. External libraries
2. Internal absolute imports using `@/`
3. Relative imports

## Naming

- Components: PascalCase (`KpiTile.tsx`)
- Hooks: camelCase with `use` prefix (`useOverviewSummary.ts`)
- Utilities / API files: camelCase (`overviewApi.ts`)
- Types files: `<name>.types.ts` or colocated inferred types
- Constants: UPPER_SNAKE_CASE

## Accessibility

- Semantic HTML, proper labels and ARIA attributes
- Sortable headers expose `aria-sort`; search inputs have accessible labels
- Keyboard navigation must work for controls, tabs, and tooltips (hover + focus)
- Do not convey status or series identity by color alone; pair with text, legend, or table
- Preserve visible focus rings; touch targets ≥ 44×44px below 768px

## Quality

- Code must pass `npm run lint` and `npm run build` with no errors
- Keep functions small and avoid deep JSX nesting
- Never commit secrets; configuration comes from `VITE_*` env variables (e.g. `VITE_API_URL`); document new ones in `.env.example`

## Commits

Use this pattern by default:

```text
type(scope): short summary

- Point of change
- Point of change
```

- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Scope is a short area name (e.g. `layout`, `api`, `overview`)
- Summary is imperative and concise
- Body is a bullet list (`-`) of the concrete changes

## Change scope

- Do not modify more than 5 files per request. If a task requires changes to more than 5 files, split it into smaller, logically complete steps and explain the proposed split before proceeding. Prioritize the smallest set of files needed to complete each change.
- Keep each file focused on its responsibility. Make only necessary changes as we work through each file, and avoid unrelated refactoring or adding excessive logic just to reduce the number of changed files.
- Stop after 5 file changes and wait until I ask you to keep going to the next step.

## Formatting

- Prefer Prettier-compatible style: 2 spaces, single quotes, no semicolons, trailing commas, 120-character line width.
- Match surrounding file style when editing generated shadcn UI under `src/components/ui/`.
