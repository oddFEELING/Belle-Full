import { customQuery } from "convex-helpers/server/customFunctions";
import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "../_generated/server";

export const authenticatedQuery = customQuery(query, {
  args: {},
  input: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");

    return {
      ctx: { user: { ...userIdentity, id: userId } },
      args,
    };
  },
});
