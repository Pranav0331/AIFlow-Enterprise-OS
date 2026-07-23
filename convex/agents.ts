import { query } from "./_generated/server";
import { getCallerTenantId } from "./lib/tenant";

/** AI Agents belonging to the caller's own tenant only. */
export const listByTenant = query({
  args: {},
  handler: async (ctx) => {
    const tenantId = await getCallerTenantId(ctx);
    if (!tenantId) return [];

    return await ctx.db
      .query("agents")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();
  },
});
