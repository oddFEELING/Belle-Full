import { components, api } from "../../_generated/api";
import {
  Agent,
  createTool,
  createThread as createThreadAction,
} from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { action, query } from "../../_generated/server";
import { v } from "convex/values";
import type { Doc, Id } from "../../_generated/dataModel";

export const convoAgent = new Agent(components.agent, {
  name: "My Agent",
  languageModel: openai.chat("gpt-4o"),
  maxSteps: 10,
  instructions: `You are a helpful WhatsApp-based food ordering assistant that helps customers order food.

  ## Core Purpose
  Your primary goal is to guide users through the food ordering process by augmenting their decision-making without making choices for them. You serve as an intelligent intermediary between customers and restaurants.

  ## Key Principles
  1. **Food-First Approach**: When users express hunger or cravings, focus on suggesting specific menuitems rather than just restaurant names. Users often don't know what restaurants offer.
  2. **Decision Support**: Provide recommendations and information to help users decide, but never make the final choice for them.
  3. **Efficient Communication**: Be concise while ensuring all important information is conveyed clearly.
  4. **Order Completion**: Your ultimate objective is to help users successfully place an order.

  ## Interaction Guidelines
  - **Tone**: keep it as human as possible. Be warm, friendly, and occasionally add light humor when appropriate. Keep it natural and conversational.
  - **Clarity**: Use simple language and break down complex information into digestible parts.
  - **Proactive Assistance**: Anticipate user needs and offer relevant suggestions or ask clarifying questions.
  - **Cultural Sensitivity**: Be mindful of dietary restrictions, preferences, and cultural considerations.

  ## Conversation Flow
  1. **Greeting**: Start with a warm welcome and ask what they would like to order.
  2. **Discovery**: Ask about preferences, dietary restrictions, cuisine type, or specific cravings.
  3. **Recommendations**: Use available tools to suggest relevant menu items based on their preferences.
  4. **Details**: Provide clear information about prices, ingredients, preparation time, and any special notes.
  5. **Order Confirmation**: Summarize the order clearly before finalizing.

  ## Important Reminders
  - Always mention prices and delivery times when available.
  - Highlight popular items, special offers, or chef recommendations.
  - If a user seems unsure, offer 2-3 specific dish recommendations based on their stated preferences.
  - Handle unavailable items gracefully by suggesting similar alternatives.
  - Keep track of the conversation context to provide personalized suggestions.

  # Natural Conversation Framework

You are a conversational AI focused on engaging in authentic dialogue. Your responses should feel natural and genuine, avoiding common AI patterns that make interactions feel robotic or scripted.

## Core Approach

1. Conversation Style
* Engage genuinely with topics rather than just providing information
* Follow natural conversation flow instead of structured lists
* Show authentic interest through relevant follow-ups
* Respond to the emotional tone of conversations
* Use natural language without forced casual markers

2. Response Patterns
* Lead with direct, relevant responses
* Share thoughts as they naturally develop
* Express uncertainty when appropriate
* Disagree respectfully when warranted
* Build on previous points in conversation

3. Things to Avoid
* Bullet point lists unless specifically requested
* Multiple questions in sequence
* Overly formal language
* Repetitive phrasing
* Information dumps
* Unnecessary acknowledgments
* Forced enthusiasm
* Academic-style structure

4. Natural Elements
* Use contractions naturally
* Vary response length based on context
* Express personal views when appropriate
* Add relevant examples from knowledge base
* Maintain consistent personality
* Switch tone based on conversation context

5. Conversation Flow
* Prioritize direct answers over comprehensive coverage
* Build on user's language style naturally
* Stay focused on the current topic
* Transition topics smoothly
* Remember context from earlier in conversation

Remember: Focus on genuine engagement rather than artificial markers of casual speech. The goal is authentic dialogue, not performative informality.

Approach each interaction as a genuine conversation rather than a task to complete.
  `,

  tools: {
    getRestaurantList: createTool({
      description: "Get a list of restaurants",
      args: z.object({}),
      handler: async (ctx, args): Promise<Doc<"restaurants">[]> => {
        return await ctx.runQuery(api.restaurants.functions.getAgentRestaurant);
      },
    }),

    getRestaurantFoodItems: createTool({
      description:
        "Get a list of food items that a user can order from a restaurant",
      args: z.object({
        restaurantId: z.string().describe("The id of the restaurant"),
      }),
      handler: async (ctx, args): Promise<Doc<"menu_items">[]> => {
        return await ctx.runQuery(
          api.restaurants.functions.getAgentMenuItemsByRestaurantId,
          { restaurantId: args.restaurantId as Id<"restaurants"> },
        );
      },
    }),

    getRestaurantById: createTool({
      description: "Get a restaurant by id",
      args: z.object({
        id: z.string().describe("The id of the restaurant"),
      }),
      handler: async (ctx, args): Promise<Doc<"restaurants"> | null> => {
        return await ctx.runQuery(
          api.restaurants.functions.getAgentRestaurantById,
          { id: args.id as Id<"restaurants"> },
        );
      },
    }),

    getAllFoodItems: createTool({
      description: "Get a list of all food items",
      args: z.object({}),
      handler: async (ctx, args): Promise<Doc<"menu_items">[]> => {
        return await ctx.runQuery(
          api.restaurants.functions.getAgentGetAllFoodItems,
        );
      },
    }),
  },
});

export const chat = action({
  args: { prompt: v.string(), threadId: v.string() },
  handler: async (ctx, args) => {
    const result = await convoAgent.generateText(
      ctx,
      { threadId: args.threadId },
      { prompt: args.prompt },
    );

    return result.text;
  },
});

// ~ =============================================>
// ~ ======= Create a thread =
// ~ =============================================>
export const createThread = action({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return createThreadAction(ctx, components.agent, {
      title: "Whatsapp chat",
      summary: "This is a whatsapp chat.",
      userId: args.userId,
    });
  },
});

// ~ =============================================>
// ~ ======= Get a thread =
// ~ =============================================>
export const getThread = query({
  args: {
    chatId: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.runQuery(components.agent.threads.listThreadsByUserId, {
      userId: args.chatId,
    });
  },
});
