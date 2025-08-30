import { components, internal } from "@/_generated/api";
import {
  createThread as createThreadAction,
  Agent,
  ToolCtx,
} from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";
import { v } from "convex/values";
import { query, action } from "@/_generated/server";
import type { Doc, Id } from "@/_generated/dataModel";
import { restaurantAgentPrompt } from "./prompt";
import { humanTone } from "../tone.prompt";
import schema from "@/schema";
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
      internal.features.restaurants.agent_access.getRestaurant,
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
    /**
     * The userId is the agentId from the db
     * The title is the senderId_x_agentId
     * The summary is just a text to persist the users username as at time of first message
     */
    return createThreadAction(ctx, components.agent, {
      title: `${args.senderId}_x_${args.agentId}`,
      summary: `Restaurant bot chat between ${args.senderName} and ${args.agentId}`,
      userId: args.agentId,
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
    const agentThreads = await ctx.runQuery(
      components.agent.threads.listThreadsByUserId,
      { userId: args.agentId },
    );

    return agentThreads.page.find((thread) =>
      thread.title?.toLocaleLowerCase().includes(args.userId),
    );
  },
});
