import { v } from "convex/values";
import { partial } from "convex-helpers/validators";
import type { Doc } from "../../_generated/dataModel";
import { internalMutation, internalQuery } from "../../_generated/server";
import schema from "../../schema";

const agentSchema = schema.tables.restaurant_agents.validator;

// ~ =============================================>
// ~ ======= Update agent by unipile id
// ~ =============================================>
export const updateAgentByUnipileId = internalMutation({
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
export const getAgentByUnipileId = internalQuery({
  args: { unipileId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("restaurant_agents")
      .withIndex("by_unipile_id", (q) => q.eq("unipile_id", args.unipileId))
      .first();
  },
});

// ~ =============================================>
// ~ ======= Create agent enquiry
// ~ =============================================>
export const agentCreateEnquiry = internalMutation({
  args: {
    threadId: v.string(),
    agentId: v.id("restaurant_agents"),
    enquiry: v.string(),
    restaurant: v.id("restaurants"),
    chatId: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean }> => {
    await ctx.db.insert("agent_enquiries", {
      ...args,
      status: "PENDING",
      chatId: args.chatId,
    });

    return { success: true };
  },
});

// ~ =============================================>
// ~ ======= get agent by agent_id
// ~ =============================================>
export const getAgentByAgentId = internalQuery({
  args: { agentId: v.string() },
  handler: async (ctx, args): Promise<Doc<"restaurant_agents"> | null> => {
    const agentId = args.agentId.split("@")[0];

    return await ctx.db
      .query("restaurant_agents")
      .withIndex("by_agent_id", (q) => q.eq("agent_id", `+${agentId}`))
      .first();
  },
});
