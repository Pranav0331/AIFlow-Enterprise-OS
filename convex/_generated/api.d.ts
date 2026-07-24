/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as agents from "../agents.js";
import type * as auditLogs from "../auditLogs.js";
import type * as auth from "../auth.js";
import type * as departments from "../departments.js";
import type * as http from "../http.js";
import type * as join from "../join.js";
import type * as lib_codes from "../lib/codes.js";
import type * as lib_tenant from "../lib/tenant.js";
import type * as policies from "../policies.js";
import type * as requests from "../requests.js";
import type * as tenants from "../tenants.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  agents: typeof agents;
  auditLogs: typeof auditLogs;
  auth: typeof auth;
  departments: typeof departments;
  http: typeof http;
  join: typeof join;
  "lib/codes": typeof lib_codes;
  "lib/tenant": typeof lib_tenant;
  policies: typeof policies;
  requests: typeof requests;
  tenants: typeof tenants;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
