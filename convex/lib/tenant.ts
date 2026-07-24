import { getAuthUserId } from "@convex-dev/auth/server";
import type { QueryCtx } from "../_generated/server";
import type { Doc, Id } from "../_generated/dataModel";

/**
 * Resolves the current caller's tenantId from their authenticated user
 * record. Returns null when unauthenticated or not yet assigned to a
 * company. Every tenant-scoped query must derive tenantId this way instead
 * of trusting a client-supplied value.
 */
export async function getCallerTenantId(
  ctx: QueryCtx
): Promise<Id<"tenants"> | null> {
  const userId = await getAuthUserId(ctx);
  if (!userId) return null;

  const caller = await ctx.db.get(userId);
  return caller?.tenantId ?? null;
}

/** Returns the authenticated caller's full user doc, or throws. */
export async function requireUser(ctx: QueryCtx): Promise<Doc<"users">> {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");

  const caller = await ctx.db.get(userId);
  if (!caller) throw new Error("Not authenticated");

  return caller;
}

/**
 * Returns the authenticated caller's full user doc, requiring both a tenant
 * assignment and that their role is one of `roles`. Throws otherwise. Use
 * this at the top of every tenant-scoped mutation/query that should only be
 * reachable by specific roles.
 */
export async function requireRole(
  ctx: QueryCtx,
  roles: Array<Doc<"users">["role"]>
): Promise<Doc<"users">> {
  const caller = await requireUser(ctx);
  if (!caller.tenantId) throw new Error("Not part of a company workspace");
  if (!caller.role || !roles.includes(caller.role)) {
    throw new Error("Not authorized");
  }
  return caller;
}
