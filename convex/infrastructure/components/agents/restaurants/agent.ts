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

type RestautantAgentCtx = ToolCtx & {
  restaurantId: Id<"restaurants">;
  chatId: string;
};

export const restaurantAgent = new Agent<{
  restaurantId: string;
  chatId: string;
}>(components.agent, {
  name: "Restaurant Agent",
  languageModel: openai.chat("gpt-4.1"),
  maxSteps: 20,

  tools: {
    // ~ ======= Get a list of restaurants ======= ~
    getRestaurant: createTool({
      description: "Get the restaurant details.",
      args: z.object({
        restaurantId: z
          .string()
          .describe("The id of your restaurnat to ghet info"),
      }),
      handler: async (ctx, args): Promise<Doc<"restaurants"> | "NotFound"> => {
        const restaurant = await ctx.runQuery(
          api.restaurants.agent_access.getRestaurant,
          { restaurant: args.restaurantId as Id<"restaurants"> },
        );

        if (!restaurant) return "NotFound";

        return restaurant;
      },
    }),

    // ~ ======= Get a list of food items from a restaurant ======= ~
    getRestaurantFoodItems: createTool({
      description:
        "Get a list of food items that a user can order from a restaurant using the restaurant _id and not the name",
      args: z.object({}),
      handler: async (
        ctx: RestautantAgentCtx,
      ): Promise<Doc<"menu_items">[]> => {
        return await ctx.runQuery(
          api.restaurants.agent_access.getAgentMenuItemsByRestaurantId,
          { restaurantId: ctx.restaurantId },
        );
      },
    }),

    // ~ ======= Say something to the user ======= ~
    saySomething: createTool({
      description:
        "Say something to the user to give them insight into what you are doing",
      args: z.object({ message: z.string() }),
      handler: async (ctx: RestautantAgentCtx, args) => {
        await ctx.runAction(api.services.unipile.functions.sendMessageToUser, {
          response: args.message,
          chat_id: ctx.chatId,
        });

        return "Message sent";
      },
    }),

    // ~ ======= Ask restaurant question ======= ~
    askRestaurantQuestion: createTool({
      description:
        "escalate a question to the restaurant if you are not sure about the answer",
      args: z.object({ question: z.string() }),
      handler: async (ctx: RestautantAgentCtx, args) => {
        await ctx.runAction(api.services.unipile.functions.sendMessageToUser, {
          response: args.question,
          chat_id: ctx.chatId,
        });

        return "Question escalated";
      },
    }),
  },
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
  },
  handler: async (ctx, args): Promise<string> => {
    const restaurant = await ctx.runQuery(
      api.restaurants.agent_access.getRestaurant,
      { restaurant: args.restaurantId },
    );

    const response = await restaurantAgent.generateText(
      { ...ctx, restaurantId: args.restaurantId, chatId: args.chatId },
      { threadId: args.threadId },
      {
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
      },
    );

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
