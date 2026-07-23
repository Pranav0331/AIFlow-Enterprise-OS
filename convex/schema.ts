import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * AIFlow Enterprise OS — Convex schema.
 *
 * Multi-tenant isolation rule: every table below (except `tenants` itself and
 * the auth tables) carries a `tenantId` field and a `by_tenant` index. All
 * queries/mutations must filter by the caller's own `tenantId` — never accept
 * a client-supplied tenantId — so one company's data can never be read by
 * another company.
 */
export default defineSchema({
  ...authTables,

  // Extend the auth-provided `users` table with tenant + role.
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    tenantId: v.optional(v.id("tenants")),
    role: v.optional(
      v.union(v.literal("admin"), v.literal("manager"), v.literal("employee"))
    ),
  })
    .index("email", ["email"])
    .index("phone", ["phone"])
    .index("by_tenant", ["tenantId"]),

  tenants: defineTable({
    name: v.string(),
    createdAt: v.number(),
  }),

  departments: defineTable({
    tenantId: v.id("tenants"),
    name: v.string(),
    description: v.optional(v.string()),
  }).index("by_tenant", ["tenantId"]),

  policies: defineTable({
    tenantId: v.id("tenants"),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("active"), v.literal("archived")),
  }).index("by_tenant", ["tenantId"]),

  budgets: defineTable({
    tenantId: v.id("tenants"),
    name: v.string(),
    amount: v.number(),
    departmentId: v.optional(v.id("departments")),
  }).index("by_tenant", ["tenantId"]),

  requests: defineTable({
    tenantId: v.id("tenants"),
    title: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ),
    requestedBy: v.id("users"),
  }).index("by_tenant", ["tenantId"]),

  agents: defineTable({
    tenantId: v.id("tenants"),
    name: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive")),
  }).index("by_tenant", ["tenantId"]),

  auditLogs: defineTable({
    tenantId: v.id("tenants"),
    action: v.string(),
    actorId: v.optional(v.id("users")),
    createdAt: v.number(),
  }).index("by_tenant", ["tenantId"]),
});
