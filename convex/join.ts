import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Lets a freshly-registered, tenant-less user join an existing company by
 * redeeming one of its HR/Manager/Employee join codes. The tenantId and role
 * are always resolved server-side from the matched `joinCodes` row — never
 * accepted from the client — so a user can only ever join the company whose
 * exact code they were given.
 */
export const joinWithCode = mutation({
  args: {
    code: v.string(),
  },
  handler: async (ctx, { code }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (user?.tenantId) {
      throw new Error("This account already belongs to a company");
    }

    const normalized = code.trim().toUpperCase();
    const joinCode = await ctx.db
      .query("joinCodes")
      .withIndex("by_code", (q) => q.eq("code", normalized))
      .unique();

    if (!joinCode) {
      throw new Error("Invalid company code");
    }

    await ctx.db.patch(userId, {
      tenantId: joinCode.tenantId,
      role: joinCode.role,
      isActive: true,
    });

    await ctx.db.insert("auditLogs", {
      tenantId: joinCode.tenantId,
      action: `${user?.name ?? "A new user"} joined as ${joinCode.role}`,
      actorId: userId,
      createdAt: Date.now(),
    });

    return { role: joinCode.role };
  },
});
