# AIFlow Enterprise OS — Foundation (Landing + Multi-Tenant Auth + Dashboard Shell)

## Context
Build the foundation for a multi-tenant "AI-Native Enterprise Operating System": a public
landing page, company signup that provisions an isolated tenant workspace, role-based auth
(Admin/Manager/Employee), and an empty Admin Dashboard shell with 8 placeholder sections.
AI agent logic (Gemini) and audit-log export (Notion) are explicitly out of scope for this
phase.

**Backend constraint (confirmed with user):** Convex is a hard hackathon requirement and must
remain the standalone system of record — it is NOT Enter Cloud/Postgres. Convex cannot be
provisioned from this sandbox (provisioning requires an interactive `npx convex login`), so:
- All Convex backend code (schema, auth config, queries/mutations) is written in this repo
  under `/convex`, ready to deploy.
- The frontend connects **directly** to Convex via `convex/react` + `@convex-dev/auth/react`
  (not proxied through Enter Cloud), so real-time subscriptions work natively.
- The user runs the actual `npx convex login` / `npx convex dev` / `convex deploy` commands
  themselves (exact commands given at the end of this plan) and pastes the resulting
  deployment URL into one config file.
- Enter Cloud/Postgres is not used for application data.

## Dependencies to add
- `convex` (client SDK + CLI, used for `npx convex dev`/`deploy` and `convex/react`)
- `@convex-dev/auth` (Convex Auth — Password provider for email/password signup & login)

## Convex backend (`/convex`, new directory)

- **`convex/schema.ts`** — merges Convex Auth's `authTables` with app tables. Every
  tenant-scoped table stores `tenantId` and has a `by_tenant` index:
  - `users` (extended authTables.users): adds `tenantId: optional(id("tenants"))`,
    `role: optional(union("admin","manager","employee"))`
  - `tenants`: `name`, `createdAt` (the tenant record itself — no tenantId)
  - `departments`, `policies`, `budgets`, `requests`, `agents`, `auditLogs`: each has
    `tenantId: id("tenants")` + minimal descriptive fields (name/title/status/amount as
    relevant), indexed `by_tenant`
- **`convex/auth.config.ts` + `convex/auth.ts`** — Convex Auth setup with the `Password`
  provider (email/password).
- **`convex/tenants.ts`** — `createCompany` mutation: reads the just-authenticated user
  (`getAuthUserId`), creates a `tenants` row, and patches that user with
  `tenantId` + `role: "admin"`. This is how "company signup" provisions an isolated workspace
  and makes the signer-upper an Admin automatically.
- **`convex/users.ts`** — `currentUser` query (returns the authed user's profile incl.
  tenantId/role, or null); `listByTenant` query scoped to the caller's own tenantId (used by
  Employees/Managers placeholder screens to prove isolation).
- **`convex/departments.ts`, `policies.ts`, `requests.ts`, `agents.ts`, `auditLogs.ts`** — one
  `listByTenant` query each, always scoped to `ctx.auth` → current user's `tenantId` (never a
  client-supplied tenantId), returning an empty list for now. This is the enforcement point for
  "one company's data can never be read by another company."

## Frontend

### Convex client wiring
- **`src/lib/convex.ts`** — exports `convexUrl` read from a local constant (see below) and a
  `convexClient` instance (or `null` if unconfigured), plus `isConvexConfigured` boolean.
  No `VITE_*` env vars (unsupported on Enter) — the URL lives in a plain committed constant the
  user edits once after deploying.
- **`src/config/convex.ts`** — `export const CONVEX_URL = "";` with a comment explaining to
  paste the deployment URL from `npx convex dev` / `convex deploy` here.
- **`src/main.tsx`** — wrap `<App />` with `ConvexAuthProvider` (from `@convex-dev/auth/react`)
  using the client from `src/lib/convex.ts`.
- **`src/components/system/ConvexSetupNotice.tsx`** — if `isConvexConfigured` is false, render
  this full-page notice (with the CLI steps) instead of the router, so the app fails gracefully
  before a real deployment exists.

### Auth
- **`src/components/auth/ProtectedRoute.tsx`** — uses `useConvexAuth()`; redirects to `/login`
  when unauthenticated, shows a spinner while loading.
- **`src/pages/signup/index.tsx`** — "Create Company" form (company name, your name, email,
  password). Calls `useAuthActions().signIn("password", { flow: "signUp", ... })` then the
  `createCompany` mutation; redirects to `/dashboard`.
- **`src/pages/login/index.tsx`** — email/password sign-in via `signIn("password", { flow:
  "signIn", ... })`; redirects to `/dashboard`.

### Landing page (replaces current `src/pages/Index.tsx`)
- Move to **`src/pages/landing/`** (`index.tsx` + `Hero.tsx`, `FeatureGrid.tsx`,
  `CtaSection.tsx`, `LandingNavbar.tsx`) since it now has multiple sections.
- Content: nav with "Log in" / "Create Company"; hero "AI-Native Enterprise Operating System —
  Automate. Collaborate. Accelerate."; feature grid (Multi-Tenant Workspaces, Role-Based
  Access, AI Agents, Policies & Budgets, Audit Trail, Real-Time Collaboration); final CTA
  section with "Create Company" button.

### Admin Dashboard shell
- **`src/components/dashboard/DashboardLayout.tsx`** — reuses existing shadcn `Sidebar`
  primitives (`src/components/ui/sidebar.tsx`) for nav; top bar shows company name, role badge,
  logout (`useAuthActions().signOut()`).
- **`src/components/dashboard/dashboardNav.ts`** — the 8-item nav config (Employees, Managers,
  Departments, Policies, Requests, AI Agents, Analytics, Audit Trail) with `lucide-react` icons
  and routes.
- **`src/components/dashboard/PlaceholderSection.tsx`** — one reusable "coming soon" component
  (title, icon, description, optional live tenant-scoped count via the matching `listByTenant`
  query) used by all 8 section routes instead of 8 near-duplicate files.
- **`src/pages/dashboard/index.tsx`** — overview with welcome message + 8 cards linking into
  each section.
- Section routes render `<PlaceholderSection />` with different props per nav item.

### Routing (`src/router.tsx`)
- `/` → landing
- `/signup`, `/login` → auth pages
- `/dashboard` (wrapped in `ProtectedRoute`) → `DashboardLayout` with children: index +
  `employees`, `managers`, `departments`, `policies`, `requests`, `agents`, `analytics`,
  `audit-trail`
- `*` → existing `NotFound`

### Design tokens (`src/index.css`, `tailwind.config.ts`)
Introduce an enterprise SaaS palette on top of the existing shadcn token structure: an
indigo/violet `--primary`, a deep slate `--sidebar-background` for the dashboard sidebar, and a
subtle `--gradient-primary` used on the landing hero/CTA. All new components use semantic
tokens only (no raw `text-white`/`bg-black`).

### Housekeeping
- Update `CodeGuideline.md` to document the new `convex/` directory and the new
  `pages/landing`, `pages/signup`, `pages/login`, `pages/dashboard` structure, per the
  project's own convention of keeping that doc current.

## After implementation — commands the user runs locally
Convex cannot be logged into from this sandbox. Once the code is in place, share:
```
npx convex login
npx convex dev          # scaffolds/links the Convex project, prints the deployment URL
npx @convex-dev/auth    # one-time setup: generates auth keys on the Convex deployment
```
Then paste the printed deployment URL into `src/config/convex.ts` (`CONVEX_URL`). For
production: `npx convex deploy`, then update the constant to the prod URL before publishing on
Enterpro.

## Verification
- Without a configured `CONVEX_URL`, the app shows `ConvexSetupNotice` instead of crashing.
- Landing page renders at `/` with hero, features, and both CTAs.
- `/signup` creates a tenant + admin user and lands on `/dashboard` (requires a live Convex
  deployment to actually verify end-to-end; reviewed by code inspection here).
- `/dashboard` is unreachable without auth (`ProtectedRoute` redirects to `/login`).
- All 8 dashboard sections render as reusable placeholders with correct titles/icons/routes.
- `pnpm lint` passes.
