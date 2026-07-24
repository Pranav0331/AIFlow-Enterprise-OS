import type { QueryCtx } from "../_generated/server";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars

function randomSuffix(length = 6): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return result;
}

const PREFIX: Record<"hr" | "manager" | "employee", string> = {
  hr: "HR",
  manager: "MGR",
  employee: "EMP",
};

/**
 * Generates a join code like "HR-4F7QX2" that is guaranteed unique across
 * the `joinCodes` table (checked via the `by_code` index, retrying on the
 * rare collision).
 */
export async function generateUniqueCode(
  ctx: QueryCtx,
  role: "hr" | "manager" | "employee"
): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const candidate = `${PREFIX[role]}-${randomSuffix()}`;
    const existing = await ctx.db
      .query("joinCodes")
      .withIndex("by_code", (q) => q.eq("code", candidate))
      .unique();
    if (!existing) return candidate;
  }
  throw new Error("Could not generate a unique join code, please retry");
}
