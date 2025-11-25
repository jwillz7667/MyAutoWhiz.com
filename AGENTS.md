# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router routes, layouts, and server actions (e.g., `app/dashboard`, `app/actions`).
- `components/`: Reusable UI (`components/ui`) and feature blocks (`components/analysis`, `components/dashboard`).
- `lib/`: Clients and helpers (`lib/api`, `lib/supabase`, `lib/utils`).
- `database/`: Canonical schema in `schema.sql`; update before regenerating types.
- `types/`: Generated artifacts such as `types/database.ts`.
- `public/`: Static assets; integration notes live in `docs/API_REFERENCE.md`.

## Build, Test, and Development Commands
- `npm run dev`: Start the Next.js dev server at `localhost:3000`.
- `npm run build`: Production build; surfaces type/lint issues.
- `npm run start`: Serve the built app after `npm run build`.
- `npm run lint` / `npm run lint:fix`: ESLint (Next core-web-vitals) with autofix.
- `npm run type-check`: Strict TypeScript check.
- `npm run format`: Prettier with Tailwind class sorting across `*.{ts,tsx,js,json,md}`.
- Supabase: `npm run db:types` (requires `SUPABASE_PROJECT_ID`), `npm run db:push`, `npm run db:reset` for schema management.

## Coding Style & Naming Conventions
- TypeScript with `strict` mode and path aliases (`@/...`). Prefer `const` and avoid default exports for components/hooks.
- Components in PascalCase; route folders and files in kebab-case; hooks in `useX` form.
- Prettier controls formatting (2-space indent, 80-char print width); Tailwind classes auto-sorted.
- ESLint rules: console limited to `warn`/`error`, unused vars must be prefixed with `_`, React escaping checks loosened for intentional strings.

## Testing Guidelines
- Jest is available via `npm run test` / `npm run test:watch`; add `jest.config.(js|ts)` with `next/jest` before landing new suites.
- Colocate tests as `*.test.ts(x)` near the code or under `__tests__/`. Mock Supabase, Stripe, and external APIs to keep runs offline.
- Prioritize server actions, API routes in `app/api`, and logic-heavy components; snapshot only for stable shells.

## Commit & Pull Request Guidelines
- Prefer Conventional Commits (`feat:`, `fix:`, `chore:`) with concise, imperative subjects and scoped areas (e.g., `feat(dashboard): valuation chart`).
- PRs should include a brief summary, linked issue/ticket, and screenshots for UI changes. Note schema or env var updates.
- Run `npm run lint`, `npm run type-check`, and relevant tests before submission; flag any flaky or pending suites.

## Security & Configuration Tips
- Copy `.env.example` to `.env.local`; keep credentials (Supabase, Stripe, OpenAI, Resend, etc.) out of commits. Rotate keys used in tests.
- Supabase CLI is required for `db:*` scripts; keep `database/schema.sql` aligned with generated `types/database.ts`.
- Middleware is currently disabled (`middleware.ts`); re-enable only after verifying compatibility with the current Next.js version.
