import { anyApi } from "convex/server";

/**
 * Untyped Convex function references.
 *
 * The typed `api` object normally comes from `convex/_generated/api.ts`,
 * which the Convex CLI generates the first time you run `npx convex dev`.
 * That file doesn't exist in this checkout yet (it requires an interactive
 * CLI login), so we reference functions by name via `anyApi` instead —
 * `anyApi.moduleName.functionName` resolves to any module/function path in
 * `/convex` without needing generated types.
 *
 * Once you've run `npx convex dev` locally, switch call sites to
 * `import { api } from "../../convex/_generated/api"` for full type-safety.
 */
export const api = anyApi;
