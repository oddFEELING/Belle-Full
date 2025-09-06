import { getAuthUserId } from "@convex-dev/auth/server";
import type { Doc } from "@/_generated/dataModel";
import { query } from "@/_generated/server";

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
