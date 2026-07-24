import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCallerTenantId, requireRole } from "./lib/tenant";

/** Policies belonging to the caller's own tenant only. */
export const listByTenant = query({
  args: {},
  handler: async (ctx) => {
    const tenantId = await getCallerTenantId(ctx);
    if (!tenantId) return [];

    return await ctx.db
      .query("policies")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();
  },
});

/** Admin/HR: creates a new policy in the caller's tenant. */
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("active"), v.literal("archived")),
  },
  handler: async (ctx, { title, description, status }) => {
    const caller = await requireRole(ctx, ["admin", "hr"]);

    return await ctx.db.insert("policies", {
      tenantId: caller.tenantId!,
      title,
      description,
      status,
    });
  },
});

/** Admin/HR: updates a same-tenant policy. */
export const update = mutation({
  args: {
    policyId: v.id("policies"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal("draft"), v.literal("active"), v.literal("archived"))
    ),
  },
  handler: async (ctx, { policyId, title, description, status }) => {
    const caller = await requireRole(ctx, ["admin", "hr"]);

    const policy = await ctx.db.get(policyId);
    if (!policy || policy.tenantId !== caller.tenantId) {
      throw new Error("Policy not found in your company");
    }

    const patch: Record<string, unknown> = {};
    if (title !== undefined) patch.title = title;
    if (description !== undefined) patch.description = description;
    if (status !== undefined) patch.status = status;

    await ctx.db.patch(policyId, patch);
  },
});
