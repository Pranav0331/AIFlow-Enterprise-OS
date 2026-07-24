# Role-Based Company Access & Separate Dashboards

## Context
AIFlow currently has one flow: Admin signs up, creates a company (tenant), and sees one `/dashboard` with mostly-placeholder sections. There is no way for anyone else to join that company. We need a secure company-join-code system (HR/Manager/Employee codes), server-side tenant/role resolution, and four separate dashboards (`/admin`, `/hr`, `/manager`, `/employee`) with real (non-placeholder) data for the sections the user listed. AI Agents, Analytics and Audit Trail stay as placeholders (explicitly out of scope).

Existing patterns to reuse:
- `convex/lib/tenant.ts` → `getCallerTenantId(ctx)` pattern (never trust client tenantId) — will extend with `requireRole`.
- `convex/tenants.ts` → `createCompany` mutation pattern (signIn client-side, then a reactive `useEffect` on `isAuthenticated` calls a Convex mutation) — reused for the new "Join Company" flow.
- `src/components/dashboard/DashboardLayout.tsx` + `dashboardNav.ts` + `PlaceholderSection.tsx` — generalized into one shared layout used by all 4 role dashboards.
- `src/components/auth/ProtectedRoute.tsx` — extended with a role check.

## Schema changes — `convex/schema.ts`
- `users`: add `"hr"` to the `role` union; add `departmentId: v.optional(v.id("departments"))`, `managerId: v.optional(v.id("users"))`, `isActive: v.optional(v.boolean())`; add indexes `by_manager` and `by_department`.
- New table `joinCodes`: `{ tenantId: v.id("tenants"), role: v.union("hr","manager","employee"), code: v.string() }`, indexes `by_tenant_and_role` (`["tenantId","role"]`) and `by_code` (`["code"]`, used for O(1) lookup on join).
- `requests`: add `category: v.union("leave","expense","equipment","other")`, `description: v.optional(v.string())`, `reviewedBy: v.optional(v.id("users"))`, `reviewedAt: v.optional(v.number())`; add index `by_requester` (`["requestedBy"]`). Use existing `_creationTime` for ordering (no new field needed).

## Convex security core — `convex/lib/tenant.ts`
Add `requireUser(ctx)` (throws if unauthenticated) and `requireRole(ctx, roles: Role[])` (throws if no tenant or role not allowed; returns the full caller user doc). Every new/changed query and mutation below uses one of these — tenantId is always read from the caller's own user record, never from client args. Any mutation that receives a foreign id (departmentId, managerId, requestId, target userId) must re-fetch that doc and verify its `tenantId` equals the caller's `tenantId` before using it.

## Convex — join codes
- `convex/lib/codes.ts` (new): `generateUniqueCode(ctx, role)` — builds `HR-XXXXXX` / `MGR-XXXXXX` / `EMP-XXXXXX` (6 random uppercase alphanumeric chars) and retries on collision using the `by_code` index.
- `convex/tenants.ts`: `createCompany` also inserts the 3 `joinCodes` rows (hr/manager/employee) for the new tenant. Add `listJoinCodes` query (admin-only, returns `[]` otherwise) and `regenerateJoinCode` mutation (admin-only, args `{ role }`, patches that tenant+role code to a new unique value).
- `convex/join.ts` (new): `joinWithCode` mutation, args `{ code }`. Requires an authenticated user with no `tenantId` yet, looks up `joinCodes` by normalized code via `by_code`, throws `"Invalid company code"` if none, else patches the user with the resolved `tenantId`/`role` and returns `{ role }`.

## Convex — feature mutations/queries
- `convex/users.ts`: add `updateRole` (admin-only; target must be same tenant; role ∈ hr/manager/employee), `updateEmployee` (admin/hr; same-tenant target; patches name/departmentId/managerId/isActive, validating departmentId/managerId belong to caller's tenant and managerId user has role "manager"), `listManagers` (admin/hr), `listMyTeam` (manager-only; users where `managerId == caller._id`).
- `convex/departments.ts`: add `create` and `remove` (admin/hr; remove also clears `departmentId` on affected users via `by_department`).
- `convex/policies.ts`: add `create` and `update` (admin/hr; same-tenant check on update).
- `convex/requests.ts`: add `create` (any authenticated tenant member; category/title/description, status defaults `"pending"`), `listMine` (own requests via `by_requester`), `listForManagerTeam` (manager-only; requests from users whose `managerId == caller._id`), `setStatus` (admin/hr/manager; manager may only act on their own team's requests — verified by loading the requester and checking `managerId`).

## Frontend — auth & routing
- `src/pages/join/index.tsx` (new): "Join Company" form (Company Code, Name, Email, Password) → `signIn("password", {..., flow:"signUp"})`, then on `isAuthenticated` call `joinWithCode`, then `navigate(`/${role}`)` (mirrors `Signup`'s reactive pattern).
- `src/pages/login/index.tsx`: after `signIn`, `navigate("/redirect")` instead of `/dashboard`.
- `src/pages/signup/index.tsx`: after `createCompany` resolves, `navigate("/admin")` instead of `/dashboard`; add a link to `/join` ("Joining a team? Use your company code").
- `src/components/auth/RoleRedirect.tsx` (new, mounted at `/redirect`): reads `api.users.currentUser`, redirects to `/admin`, `/hr`, `/manager`, `/employee` based on role (or `/signup` if authenticated with no tenant yet, or `/login` if unauthenticated).
- `src/components/auth/RoleProtectedRoute.tsx` (new): wraps the existing auth check (reuses `ProtectedRoute`'s loading/redirect logic) and additionally verifies `currentUser.role` is in an allowed list, redirecting to `/redirect` on mismatch.
- `src/router.tsx`: remove the `/dashboard` tree; add `/redirect`, `/join`, and four role trees `/admin`, `/hr`, `/manager`, `/employee`, each `<RoleProtectedRoute allowed={[...]}><DashboardLayout navItems={...} homePath="/x" /></RoleProtectedRoute>` with an `<Outlet/>`-based index + children.

## Frontend — shared dashboard components (`src/components/dashboard/`)
- `DashboardLayout.tsx`: generalized to accept `navItems` + `homePath` props (currently hardcoded to the admin set) — reused by all 4 role dashboards.
- `dashboardNav.ts`: split into `adminNavItems`, `hrNavItems`, `managerNavItems`, `employeeNavItems`.
- `EmployeeManagementTable.tsx` (new, shared by Admin & HR "Employees" pages): table of tenant users with inline edit (name, department select, manager select, active toggle) calling `users.updateEmployee`.
- `DepartmentsManager.tsx` (new, shared by Admin & HR "Departments" pages): list + create + delete department, calling `departments.create`/`remove`.
- `PoliciesManager.tsx` (new, shared by Admin & HR "Policies" pages): list + create + edit status, calling `policies.create`/`update`.
- `RequestsTable.tsx` (new, generic): renders a list of requests with optional Approve/Reject actions — reused by Admin Requests (read-only), HR Employee Requests (approve/reject), Manager Team Requests/Pending Approvals/History, Employee My Requests/Request Status.
- `RoleManagementTable.tsx` (new, Admin-only "HR" page): lists tenant users (excluding self) with a role `<Select>` (hr/manager/employee) calling `users.updateRole`.

## Frontend — pages
Reuse/rename existing placeholder pages via `rename_file` where content is unchanged (Agents, Analytics, Audit Trail move from `dashboard/*` to `admin/*` verbatim).

- `src/pages/admin/`: `index.tsx` (overview cards), `company-access/index.tsx` (3 codes + regenerate, via `listJoinCodes`/`regenerateJoinCode`), `employees/index.tsx`, `hr/index.tsx` (RoleManagementTable), `managers/index.tsx` (manager list + team size via `listManagers`+`listMyTeam`-style count), `departments/index.tsx`, `policies/index.tsx`, `requests/index.tsx` (tenant-wide, read-only), `agents/`, `analytics/`, `audit-trail/` (moved, untouched).
- `src/pages/hr/`: `index.tsx`, `employees/index.tsx`, `departments/index.tsx`, `requests/index.tsx` (approve/reject), `policies/index.tsx`.
- `src/pages/manager/`: `index.tsx` ("My Team", via `listMyTeam`), `team-requests/index.tsx`, `pending-approvals/index.tsx` (approve/reject), `request-history/index.tsx`.
- `src/pages/employee/`: `index.tsx` (overview/counts), `new-request/index.tsx` (category+title+description form), `my-requests/index.tsx`, `request-status/index.tsx` (grouped by status), `my-profile/index.tsx` (read-only).

Delete the old `src/pages/dashboard/` directory and old dashboard-only files once content is migrated.

## Implementation checklist
- [ ] `convex/schema.ts`: add `hr` role, `departmentId`/`managerId`/`isActive` on users + indexes; new `joinCodes` table; extend `requests` with category/description/reviewedBy/reviewedAt + `by_requester` index.
- [ ] `convex/lib/tenant.ts`: add `requireUser`/`requireRole`.
- [ ] `convex/lib/codes.ts`: add `generateUniqueCode`.
- [ ] `convex/tenants.ts`: generate join codes on `createCompany`; add `listJoinCodes`, `regenerateJoinCode`.
- [ ] `convex/join.ts`: add `joinWithCode` mutation resolving tenantId/role server-side only.
- [ ] `convex/users.ts`: add `updateRole`, `updateEmployee`, `listManagers`, `listMyTeam`, each tenant/role-checked.
- [ ] `convex/departments.ts`: add `create`, `remove`.
- [ ] `convex/policies.ts`: add `create`, `update`.
- [ ] `convex/requests.ts`: add `create`, `listMine`, `listForManagerTeam`, `setStatus`, each tenant/role-checked; manager restricted to own team.
- [ ] `src/pages/join/index.tsx`: new Join Company form + reactive `joinWithCode` call + role-based redirect.
- [ ] `src/pages/login/index.tsx` and `src/pages/signup/index.tsx`: update post-auth redirects and add cross-links.
- [ ] `src/components/auth/RoleRedirect.tsx` and `RoleProtectedRoute.tsx`: new.
- [ ] `src/router.tsx`: replace `/dashboard` tree with `/redirect`, `/join`, `/admin`, `/hr`, `/manager`, `/employee`.
- [ ] `src/components/dashboard/DashboardLayout.tsx` + `dashboardNav.ts`: generalize for 4 role nav sets.
- [ ] New shared components: `EmployeeManagementTable`, `DepartmentsManager`, `PoliciesManager`, `RequestsTable`, `RoleManagementTable`.
- [ ] Build all Admin/HR/Manager/Employee pages listed above with real Convex data (no mock data, no localStorage).
- [ ] Move Agents/Analytics/Audit Trail pages under `src/pages/admin/` unchanged; delete `src/pages/dashboard/`.
- [ ] Confirm no query/mutation accepts `tenantId`/`companyId` as a client arg anywhere.

## Verification checklist
- [ ] Admin signs up → lands on `/admin`, sees Company Access page with 3 distinct codes (`HR-...`, `MGR-...`, `EMP-...`); regenerating one changes only that code.
- [ ] New user joins with the `EMP-...` code → account created, auto-connected only to that tenant, redirected to `/employee`; repeat with `HR-...`/`MGR-...` codes landing on `/hr`/`/manager`.
- [ ] Joining with an invalid/garbage code shows an error and does not create a tenant link.
- [ ] Existing user logs in → redirected to the dashboard matching their stored role, not `/dashboard`.
- [ ] Employee A from Company 1 cannot see Company 2's employees/requests/policies/departments even by manually calling the same queries (tenant mismatch → empty/forbidden).
- [ ] Manager only sees/approves requests from users whose `managerId` is them; acting on another manager's team member's request is rejected server-side.
- [ ] Employee "New Request" creates a request visible in their "My Requests"/"Request Status", and in HR's "Employee Requests" and Admin's "Requests" (same tenant only).
- [ ] `pnpm lint` passes and the app builds with no TypeScript errors; manually click through all 4 dashboards in the preview.
