import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

/** Returns the authed user's own profile (incl. tenantId/role), or null. */
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db.get(userId);
  },
});

/**
 * Lists users belonging to the caller's own tenant only. The tenantId is
 * always derived from the authenticated user — never accepted from the
 * client — enforcing multi-tenant isolation.
 */
export const listByTenant = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const caller = await ctx.db.get(userId);
    if (!caller?.tenantId) return [];

    return await ctx.db
      .query("users")
      .withIndex("by_tenant", (q) => q.eq("tenantId", caller.tenantId))
      .collect();
  },
});
