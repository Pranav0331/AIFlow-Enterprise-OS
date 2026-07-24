import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCallerTenantId, requireRole } from "./lib/tenant";

/** Departments belonging to the caller's own tenant only. */
export const listByTenant = query({
  args: {},
  handler: async (ctx) => {
    const tenantId = await getCallerTenantId(ctx);
    if (!tenantId) return [];

    return await ctx.db
      .query("departments")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();
  },
});

/** Admin/HR: creates a new department in the caller's tenant. */
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { name, description }) => {
    const caller = await requireRole(ctx, ["admin", "hr"]);

    return await ctx.db.insert("departments", {
      tenantId: caller.tenantId!,
      name,
      description,
    });
  },
});

/** Admin/HR: removes a same-tenant department and unassigns its members. */
export const remove = mutation({
  args: {
    departmentId: v.id("departments"),
  },
  handler: async (ctx, { departmentId }) => {
    const caller = await requireRole(ctx, ["admin", "hr"]);

    const department = await ctx.db.get(departmentId);
    if (!department || department.tenantId !== caller.tenantId) {
      throw new Error("Department not found in your company");
    }

    const members = await ctx.db
      .query("users")
      .withIndex("by_department", (q) => q.eq("departmentId", departmentId))
      .collect();

    for (const member of members) {
      await ctx.db.patch(member._id, { departmentId: undefined });
    }

    await ctx.db.delete(departmentId);
  },
});
