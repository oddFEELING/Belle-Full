import { getAuthSessionId, getAuthUserId } from "@convex-dev/auth/server";
import type { Doc } from "../_generated/dataModel";
import { query } from "../_generated/server";
import { v } from "convex/values";

// ~ =============================================>
// ~ ======= Get current user session
// ~ =============================================>
export const getUserSession = query({
  args: {},
  handler: async (
    ctx,
  ): Promise<{
    user: Doc<"users"> | null;
    session: Doc<"authSessions"> | null;
  } | null> => {
    const sessionId = await getAuthSessionId(ctx);
    if (!sessionId) return null;

    const session = await ctx.db.get(sessionId);
    if (!session) return null;

    const user = await ctx.db.get(session.userId);

    return { user, session };
  },
});
