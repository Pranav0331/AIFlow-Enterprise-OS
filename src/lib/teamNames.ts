/** Shared helper: builds a userId -> display name map from a team list. */
export function buildTeamNames(
  team: Array<{ _id: string; name?: string; email?: string }> | undefined
): Record<string, string> {
  return (
    team?.reduce<Record<string, string>>((acc, member) => {
      acc[member._id] = member.name ?? member.email ?? "Unknown";
      return acc;
    }, {}) ?? {}
  );
}
