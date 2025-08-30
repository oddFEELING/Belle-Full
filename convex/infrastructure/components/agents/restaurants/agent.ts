import { components, api } from "../../../../_generated/api";
import {
  createThread as createThreadAction,
  createTool,
  Agent,
  ToolCtx,
} from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { v } from "convex/values";
import { query, action } from "../../../../_generated/server";
import type { Doc, Id } from "../../../../_generated/dataModel";
import { restaurantAgentPrompt } from "./prompt";
import { humanTone } from "../tone.prompt";
import schema from "../../../../schema";
import { AgentRestaurantReturn } from "@/features/restaurants/interfaces/restaurants.dto";
import * as restaurantAgentTools from "./tools";

export type RestaurantAgentCtx = ToolCtx & {
  restaurantId: Id<"restaurants">;
  chatId: string;
  threadId: string;
  agentId: Id<"restaurant_agents">;
};

export const restaurantAgent = new Agent<{
  restaurantId: string;
  chatId: string;
}>(components.agent, {
  name: "Restaurant Agent",
  languageModel: openai.chat("gpt-4.1"),
  maxSteps: 20,

  tools: { ...restaurantAgentTools },
});

// ~ =============================================>
// ~ ======= Chat
// ~ =============================================>
export const chat = action({
  args: {
    prompt: v.string(),
    goals: v.string(),
    personna: v.string(),
    traits: v.array(v.string()),
    restaurantId: v.id("restaurants"),
    threadId: v.string(),
    agentName: v.string(),
    chatId: v.string(),
    agentId: v.id("restaurant_agents"),
  },
  handler: async (ctx, args): Promise<string> => {
    const agentCtx: RestaurantAgentCtx = {
      ...ctx,
      restaurantId: args.restaurantId,
      chatId: args.chatId,
      threadId: args.threadId,
      agentId: args.agentId,
    };
    const restaurant = await ctx.runQuery(
      api.features.restaurants.agent_access.getRestaurant,
      { restaurant: args.restaurantId },
    );

    const { thread } = await restaurantAgent.continueThread(agentCtx, {
      threadId: args.threadId,
    });
    const response = await thread.generateText({
      system: restaurantAgentPrompt({
        tone: humanTone(),
        goals: args.goals || "",
        personna: args.personna || "",
        traits: args.traits?.join(", ") || "",
        restaurantName: restaurant?.name || "",
        restaurantDetails: restaurant?.description || "",
        agentName: args.agentName,
      }),
      prompt: args.prompt,
      temperature: 0.5,
    });

    return response.text;
  },
});

// ~ =============================================>
// ~ ======= Create a thread =
// ~ =============================================>
export const createRestaurantAgentThread = action({
  args: {
    senderId: v.string(),
    senderName: v.string(),
    agentId: v.id("restaurant_agents"),
  },
  handler: async (ctx, args) => {
    return createThreadAction(ctx, components.agent, {
      title: `${args.senderName}'s chat`,
      summary: `Restaurant bot chat between ${args.senderId} and ${args.agentId}`,
      userId: `${args.senderId}_x_${args.agentId}`,
    });
  },
});

// ~ =============================================>
// ~ ======= Get a thread =
// ~ =============================================>
export const getRestaurantAgentThread = query({
  args: {
    userId: v.string(),
    agentId: v.id("restaurant_agents"),
  },
  handler: async (ctx, args) => {
    return ctx.runQuery(components.agent.threads.listThreadsByUserId, {
      userId: `${args.userId}_x_${args.agentId}`,
    });
  },
});
