import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCallerTenantId, requireRole, requireUser } from "./lib/tenant";

/** Requests belonging to the caller's own tenant only (admin/HR tenant-wide view). */
export const listByTenant = query({
  args: {},
  handler: async (ctx) => {
    const tenantId = await getCallerTenantId(ctx);
    if (!tenantId) return [];

    return await ctx.db
      .query("requests")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .order("desc")
      .collect();
  },
});

/** Any authenticated tenant member: creates a new request for themselves. */
export const create = mutation({
  args: {
    title: v.string(),
    category: v.union(
      v.literal("leave"),
      v.literal("expense"),
      v.literal("equipment"),
      v.literal("other")
    ),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { title, category, description }) => {
    const caller = await requireUser(ctx);
    if (!caller.tenantId) throw new Error("Not part of a company workspace");

    return await ctx.db.insert("requests", {
      tenantId: caller.tenantId,
      title,
      category,
      description,
      status: "pending",
      requestedBy: caller._id,
    });
  },
});

/** The caller's own requests, most recent first. */
export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const caller = await requireUser(ctx).catch(() => null);
    if (!caller) return [];

    return await ctx.db
      .query("requests")
      .withIndex("by_requester", (q) => q.eq("requestedBy", caller._id))
      .order("desc")
      .collect();
  },
});

/** Manager-only: requests raised by users who report directly to the caller. */
export const listForManagerTeam = query({
  args: {},
  handler: async (ctx) => {
    const caller = await requireRole(ctx, ["manager"]).catch(() => null);
    if (!caller) return [];

    const team = await ctx.db
      .query("users")
      .withIndex("by_manager", (q) => q.eq("managerId", caller._id))
      .collect();
    const teamIds = new Set(team.map((u) => u._id));

    const tenantRequests = await ctx.db
      .query("requests")
      .withIndex("by_tenant", (q) => q.eq("tenantId", caller.tenantId!))
      .order("desc")
      .collect();

    return tenantRequests.filter((r) => teamIds.has(r.requestedBy));
  },
});

/**
 * Admin/HR/Manager: approves or rejects a request. Managers may only act on
 * requests raised by their own direct reports — verified server-side by
 * loading the requester and checking `managerId`, never trusting the client.
 */
export const setStatus = mutation({
  args: {
    requestId: v.id("requests"),
    status: v.union(v.literal("approved"), v.literal("rejected")),
  },
  handler: async (ctx, { requestId, status }) => {
    const caller = await requireRole(ctx, ["admin", "hr", "manager"]);

    const request = await ctx.db.get(requestId);
    if (!request || request.tenantId !== caller.tenantId) {
      throw new Error("Request not found in your company");
    }

    if (caller.role === "manager") {
      const requester = await ctx.db.get(request.requestedBy);
      if (!requester || requester.managerId !== caller._id) {
        throw new Error("You can only act on your own team's requests");
      }
    }

    await ctx.db.patch(requestId, {
      status,
      reviewedBy: caller._id,
      reviewedAt: Date.now(),
    });
  },
});
