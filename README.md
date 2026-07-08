# Mini ERP Vite Frontend

React, React Router, TypeScript, Tailwind CSS, TanStack Query, and i18n frontend for the Mini ERP Inventory & Sales Management System.

*   **Production Deployment:** [https://minierp.gausalmunir.site](https://minierp.gausalmunir.site)

## Tech Stack

- React 19, TypeScript 5, Vite 8
- React Router 7
- TanStack React Query 5 (`src/apis/queries`, `src/apis/mutations`)
- Tailwind CSS 4 (`@tailwindcss/vite`, CSS-first config in `src/styles`)
- react-i18next (English + Bangla)
- Axios (`src/apis/configs.ts`)

## Prerequisites

- Node.js 20+
- pnpm
- The [minierp-backend](../minierp-backend) API running (defaults to `http://localhost:4000`)

## Setup

```bash
pnpm install
cp .env.example .env
pnpm dev   # starts the app on http://localhost:5173
```

## Environment Variables

| Variable | Description | Default |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Base URL of the backend API (must include `/api/v1`) | `http://localhost:4000/api/v1` |

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the Vite dev server |
| `pnpm build` | Type-check and build for production |
| `pnpm preview` | Preview the production build locally |
| `pnpm typecheck` | Run `tsc -b` project-wide type check |
| `pnpm lint` / `pnpm lint:fix` | Run ESLint |
| `pnpm format` / `pnpm format:check` | Run Prettier |

## Default Backend Credentials

Seeded by the backend's `pnpm seed` script (`src/scripts/seedUsers.ts`):

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@minierp.com | Password123! |
| Manager | manager@minierp.com | Password123! |
| Employee | employee@minierp.com | Password123! |

## Features

- JWT login, persisted session, and protected routes (`src/components/routing/ProtectedRoute.tsx`).
- Permission-aware sidebar and actions — admin/manager/employee see different nav items and buttons (`src/hooks/useAuth.tsx`, `src/utils/permissions.ts`).
- Dashboard with stat cards (total products, total sales) and a low-stock list linking into filtered product search.
- Product list with debounced search, category filter, sort, and URL-synced pagination.
- Product create/edit form with image upload (required on create, optional on update) and admin-only delete.
- Sale creation with multiple line items, per-item stock validation, and a live grand total.
- Centralized error handling (`src/apis/configs.ts`) surfaced via reusable `Alert`/`ErrorState` components.
- English and Bangla language switcher, with all UI copy routed through `react-i18next` keys.

## Source Structure

- `src/apis/configs.ts` — Axios instance, auth token interceptor, 401 auto-logout, API/asset base URLs.
- `src/apis/endpoints` — Reusable endpoint path constants.
- `src/apis/types` — API response, auth, dashboard, product, and sale types.
- `src/apis/queries` — TanStack Query read hooks.
- `src/apis/mutations` — TanStack Query write hooks.
- `src/components/ui` — Reusable shadcn-style primitives (button, input, card, alert, pagination, file-upload, confirm-dialog, state).
- `src/components/layout` — `AppLayout`, `PageHeader`, nav shell.
- `src/components/routing` — `ProtectedRoute` auth/permission guard.
- `src/pages` — `LoginPage`, `DashboardPage`, `ProductsPage`, `SalesPage`.
- `src/hooks` — `useAuth`, `useDebouncedValue`, `useInventoryApi`.
- `src/contexts` — Application and auth providers.
- `src/i18n` and `src/translation/{en,bn}/translation.json` — i18next setup and locale resources.
- `src/styles` — Global Tailwind CSS entry styles.
- `src/utils` — Reusable helpers for query strings, form data, dates, currency, and permissions.

## API Documentation

See the backend's Swagger UI at `http://localhost:4000/api-docs` (or `/api-docs.json` for the raw OpenAPI spec) for full request/response schemas of every endpoint this frontend consumes.
