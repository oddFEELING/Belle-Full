import { getAuthSessionId } from "@convex-dev/auth/server";
import type { Doc } from "../_generated/dataModel";
import { query } from "../_generated/server";
import { v } from "convex/values";

export const getUserSession = query({
  args: {},
  handler: async (ctx): Promise<Doc<"users"> | null> => {
    const sessionId = await getAuthSessionId(ctx);
    if (!sessionId) return null;

    const session = await ctx.db.get(sessionId);
    if (!session) return null;

    return ctx.db.get(session.userId);
  },
});
