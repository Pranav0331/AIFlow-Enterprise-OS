import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { generateUniqueCode } from "./lib/codes";
import { requireRole } from "./lib/tenant";

const JOIN_ROLES = ["hr", "manager", "employee"] as const;

/**
 * Provisions a brand-new isolated tenant workspace for the currently
 * authenticated user (created moments earlier via the Password signUp flow),
 * promotes that user to Admin of the new tenant, and mints one join code per
 * role (HR/Manager/Employee) so teammates can self-provision into it.
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
      isActive: true,
    });

    for (const role of JOIN_ROLES) {
      const code = await generateUniqueCode(ctx, role);
      await ctx.db.insert("joinCodes", { tenantId, role, code });
    }

    await ctx.db.insert("auditLogs", {
      tenantId,
      action: `Company "${companyName}" created`,
      actorId: userId,
      createdAt: Date.now(),
    });

    return tenantId;
  },
});

/** Admin-only: the tenant's 3 join codes (HR/Manager/Employee). */
export const listJoinCodes = query({
  args: {},
  handler: async (ctx) => {
    const caller = await requireRole(ctx, ["admin"]).catch(() => null);
    if (!caller?.tenantId) return [];

    return await ctx.db
      .query("joinCodes")
      .withIndex("by_tenant_and_role", (q) => q.eq("tenantId", caller.tenantId!))
      .collect();
  },
});

/** Admin-only: regenerates the join code for a single role. */
export const regenerateJoinCode = mutation({
  args: {
    role: v.union(v.literal("hr"), v.literal("manager"), v.literal("employee")),
  },
  handler: async (ctx, { role }) => {
    const caller = await requireRole(ctx, ["admin"]);

    const existing = await ctx.db
      .query("joinCodes")
      .withIndex("by_tenant_and_role", (q) =>
        q.eq("tenantId", caller.tenantId!).eq("role", role)
      )
      .unique();

    const code = await generateUniqueCode(ctx, role);

    if (existing) {
      await ctx.db.patch(existing._id, { code });
    } else {
      await ctx.db.insert("joinCodes", { tenantId: caller.tenantId!, role, code });
    }

    return code;
  },
});
