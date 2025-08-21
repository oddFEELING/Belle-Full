import { getAuthSessionId, getAuthUserId } from "@convex-dev/auth/server";
import type { Doc } from "../_generated/dataModel";
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { authenticatedMutation } from "../_custom/mutation";

// ~ =============================================>
// ~ ======= Get current user session
// ~ =============================================>
export const getUserSession = query({
  args: {},
  handler: async (ctx): Promise<Doc<"users"> | null> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return ctx.db.get(userId);
  },
});
