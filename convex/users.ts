import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query, type MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { requireRole } from "./lib/tenant";

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

async function assertSameTenantUser(
  ctx: MutationCtx,
  tenantId: Id<"tenants">,
  targetUserId: Id<"users">
) {
  const target = await ctx.db.get(targetUserId);
  if (!target || target.tenantId !== tenantId) {
    throw new Error("User not found in your company");
  }
  return target;
}

/** Admin-only: promotes/demotes a same-tenant user between hr/manager/employee. */
export const updateRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("hr"), v.literal("manager"), v.literal("employee")),
  },
  handler: async (ctx, { userId, role }) => {
    const caller = await requireRole(ctx, ["admin"]);
    if (userId === caller._id) {
      throw new Error("You cannot change your own role");
    }
    await assertSameTenantUser(ctx, caller.tenantId!, userId);

    await ctx.db.patch(userId, { role });

    await ctx.db.insert("auditLogs", {
      tenantId: caller.tenantId!,
      action: `Role updated to ${role}`,
      actorId: caller._id,
      createdAt: Date.now(),
    });
  },
});

/**
 * Admin/HR: updates a same-tenant employee's profile fields. Validates that
 * departmentId/managerId (when provided) belong to the caller's own tenant
 * and that managerId points to an actual manager.
 */
export const updateEmployee = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    departmentId: v.optional(v.union(v.id("departments"), v.null())),
    managerId: v.optional(v.union(v.id("users"), v.null())),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, { userId, name, departmentId, managerId, isActive }) => {
    const caller = await requireRole(ctx, ["admin", "hr"]);
    await assertSameTenantUser(ctx, caller.tenantId!, userId);

    const patch: Record<string, unknown> = {};
    if (name !== undefined) patch.name = name;
    if (isActive !== undefined) patch.isActive = isActive;

    if (departmentId !== undefined) {
      if (departmentId === null) {
        patch.departmentId = undefined;
      } else {
        const dept = await ctx.db.get(departmentId);
        if (!dept || dept.tenantId !== caller.tenantId) {
          throw new Error("Department not found in your company");
        }
        patch.departmentId = departmentId;
      }
    }

    if (managerId !== undefined) {
      if (managerId === null) {
        patch.managerId = undefined;
      } else {
        const manager = await assertSameTenantUser(ctx, caller.tenantId!, managerId);
        if (manager.role !== "manager") {
          throw new Error("Selected user is not a manager");
        }
        patch.managerId = managerId;
      }
    }

    await ctx.db.patch(userId, patch);
  },
});

/** Admin/HR: lists tenant users with the "manager" role. */
export const listManagers = query({
  args: {},
  handler: async (ctx) => {
    const caller = await requireRole(ctx, ["admin", "hr"]).catch(() => null);
    if (!caller?.tenantId) return [];

    const users = await ctx.db
      .query("users")
      .withIndex("by_tenant", (q) => q.eq("tenantId", caller.tenantId!))
      .collect();

    return users.filter((u) => u.role === "manager");
  },
});

/** Manager-only: lists users who report directly to the caller. */
export const listMyTeam = query({
  args: {},
  handler: async (ctx) => {
    const caller = await requireRole(ctx, ["manager"]).catch(() => null);
    if (!caller) return [];

    return await ctx.db
      .query("users")
      .withIndex("by_manager", (q) => q.eq("managerId", caller._id))
      .collect();
  },
});
