import { getAuthUserId } from "@convex-dev/auth/server";
import type { UserIdentity } from "convex/server";
import { customQuery } from "convex-helpers/server/customFunctions";
import type { Id } from "../_generated/dataModel";
import { query } from "../_generated/server";

export const authenticatedQuery = customQuery(query, {
  args: {},
  input: async (
    ctx,
    args
  ): Promise<{
    ctx: { user: (Partial<UserIdentity> & { id: Id<"users"> }) | null };
    args: {};
  }> => {
    const userIdentity = await ctx.auth.getUserIdentity();
    const userId = await getAuthUserId(ctx);
    if (!userId) return { ctx: { user: null }, args };

    return {
      ctx: { user: { ...userIdentity, id: userId } },
      args,
    };
  },
});
