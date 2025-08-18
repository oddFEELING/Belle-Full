import { customMutation } from "convex-helpers/server/customFunctions";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "../_generated/server";

export const authenticatedMutation = customMutation(mutation, {
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
