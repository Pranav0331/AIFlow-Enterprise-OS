import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Provisions a brand-new isolated tenant workspace for the currently
 * authenticated user (created moments earlier via the Password signUp flow)
 * and promotes that user to Admin of the new tenant.
 */
export const createCompany = mutation({
  args: {
    companyName: v.string(),
  },
  handler: async (ctx, { companyName }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (user?.tenantId) {
      throw new Error("This account already belongs to a company");
    }

    const tenantId = await ctx.db.insert("tenants", {
      name: companyName,
      createdAt: Date.now(),
    });

    await ctx.db.patch(userId, {
      tenantId,
      role: "admin",
    });

    await ctx.db.insert("auditLogs", {
      tenantId,
      action: `Company "${companyName}" created`,
      actorId: userId,
      createdAt: Date.now(),
    });

    return tenantId;
  },
});
