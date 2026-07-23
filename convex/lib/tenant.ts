import { getAuthUserId } from "@convex-dev/auth/server";
import type { QueryCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";

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
