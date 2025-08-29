import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "../../../_generated/server";
import { partial } from "convex-helpers/validators";
import schema from "../../../schema";
import type { Doc } from "../../../_generated/dataModel";

const agentSchema = schema.tables.restaurant_agents.validator;

// ~ =============================================>
// ~ ======= Update agent by unipile id
// ~ =============================================>
export const updateAgentByUnipileId = mutation({
  args: {
    unipileId: v.string(),
    updateData: partial(agentSchema),
  },
  handler: async (ctx, args): Promise<Doc<"restaurant_agents"> | null> => {
    const agent = await ctx.db
      .query("restaurant_agents")
      .withIndex("by_unipile_id", (q) => q.eq("unipile_id", args.unipileId))
      .first();

    if (!agent) {
      throw new Error("Agent not found");
    }

    await ctx.db.patch(agent._id, args.updateData);
    return ctx.db.get(agent._id);
  },
});

// ~ =============================================>
// ~ ======= Get agent by unipile id
// ~ =============================================>
export const getAgentByUnipileId = query({
  args: { unipileId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("restaurant_agents")
      .withIndex("by_unipile_id", (q) => q.eq("unipile_id", args.unipileId))
      .first();
  },
});
