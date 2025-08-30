import { authenticatedAction } from "../../_custom/action";
import { authenticatedMutation } from "../../_custom/mutation";
import { authenticatedQuery } from "../../_custom/query";
import { api } from "../../_generated/api";
import {
  createAgentDto,
  createDBAgentDto,
} from "./interfaces/restaurant.agents.dto";
import { v } from "convex/values";
import { partial } from "convex-helpers/validators";
import schema, { vv } from "../../schema";
import { action } from "../../_generated/server";
import type { Doc } from "../../_generated/dataModel";

const agentSchema = schema.tables.restaurant_agents.validator;

// ~ =============================================>
// ~ ======= Create DB Agent
// ~ =============================================>
export const createDBAgent = authenticatedMutation({
  args: createDBAgentDto,
  handler: async (ctx, args) => {
    return await ctx.db.insert("restaurant_agents", {
      ...args,
      connection_status: "PENDING",
      exluded_contacts: [],
      flagged_numbers: [],
    });
  },
});

// ~ =============================================>
// ~ ======= Get restaurant agents
// ~ =============================================>
export const getRestaurantAgents = authenticatedQuery({
  args: { restaurant: v.id("restaurants") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("restaurant_agents")
      .withIndex("by_restaurant", (q) => q.eq("restaurant", args.restaurant))
      .order("desc")
      .collect();
  },
});

// ~ =============================================>
// ~ ======= update agent
// ~ =============================================>
export const updateAgent = authenticatedMutation({
  args: {
    agent: v.id("restaurant_agents"),
    updateData: partial(agentSchema),
  },
  handler: async (ctx, args) => {
    console.log("update agent", args.updateData);
    await ctx.db.patch(args.agent, args.updateData);
  },
});

// ~ =============================================>
// ~ ======= Get single agent by id
// ~ =============================================>
export const getSingleAgent = authenticatedQuery({
  args: { agent: v.id("restaurant_agents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.agent);
  },
});

// ~ =============================================>
// ~ ======= Disconnect agent
// ~ =============================================>
export const disconnectAgent = action({
  args: { agent: v.id("restaurant_agents") },
  handler: async (ctx, args): Promise<{ success: boolean }> => {
    await ctx.runAction(
      api.infrastructure.services.unipile.functions.disconnectAccount,
      {
        agentId: args.agent,
      },
    );

    return { success: true };
  },
});

// ~ =============================================>
// ~ ======= Connect Whatsapp Agent
// ~ =============================================>
export const generateWhatsappAgentCode = authenticatedAction({
  args: { agent: v.id("restaurant_agents"), restaurant: v.id("restaurants") },
  handler: async (ctx, args): Promise<{ success: boolean }> => {
    const data = await ctx.runAction(
      api.infrastructure.services.unipile.functions.createWhatsappAgent,
      { agent: args.agent, restaurant: args.restaurant },
    );

    await ctx.runMutation(api.features.agents.functions.updateAgent, {
      agent: args.agent,
      updateData: {
        auth_code: data.code,
        unipile_id: data.account_id,
      },
    });

    return { success: true };
  },
});

// ~ =============================================>
// ~ ======= Update a restaurant agent
// ~ =============================================>
export const updateRestaurantAgent = authenticatedMutation({
  args: { agent: v.id("restaurant_agents"), updateData: partial(agentSchema) },
  handler: async (ctx, args): Promise<Doc<"restaurant_agents"> | null> => {
    await ctx.db.patch(args.agent, args.updateData);

    return await ctx.db.get(args.agent);
  },
});
