# Mini ERP Vite Frontend

React, React Router, TypeScript, Tailwind CSS, TanStack Query, and i18n frontend for the Mini ERP Inventory & Sales Management System.

## Setup

```bash
pnpm install
cp .env.example .env
pnpm dev
```

The backend API should run at `VITE_API_BASE_URL`, defaulting to:

```bash
http://localhost:5000/api/v1
```

## Default Backend Credentials

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@minierp.local | Admin123! |
| Manager | manager@minierp.local | Manager123! |
| Employee | employee@minierp.local | Employee123! |

## Features

- JWT login and protected routes.
- Role-aware sidebar and actions.
- Dashboard statistics and low-stock list.
- Product CRUD with image upload, search, and pagination.
- Sale creation with multiple products and automatic total calculation.
- TanStack Query hooks for reusable queries and mutations.
- English and Bangla language switcher.

## Source Structure

- `src/apis/configs.ts` - Axios base client, token interceptor, API and asset base URLs.
- `src/apis/endpoints` - Reusable endpoint constants.
- `src/apis/types` - API response, auth, dashboard, product, and sale types.
- `src/apis/queries` - TanStack Query read hooks.
- `src/apis/mutations` - TanStack Query write hooks.
- `src/contexts` - Application and auth providers.
- `src/translation/en/translation.json` and `src/translation/bn/translation.json` - locale resources.
- `src/i18n` - i18next initialization and settings.
- `src/styles` - global Tailwind CSS entry styles.
- `src/utils` - reusable helpers for query strings, form data, dates, currency, and permissions.
