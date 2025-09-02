import { v } from "convex/values";
import { partial } from "convex-helpers/validators";
import { authenticatedAction } from "@/_custom/action";
import { authenticatedMutation } from "@/_custom/mutation";
import { authenticatedQuery } from "@/_custom/query";
import { api } from "@/_generated/api";
import type { Doc, Id } from "@/_generated/dataModel";
import { restaurantAgent } from "@/infrastructure/components/agents/restaurants/agent";
import { restaurantAgentPrompt } from "@/infrastructure/components/agents/restaurants/prompt";
import { humanTone } from "@/infrastructure/components/agents/tone.prompt";
import schema from "../../schema";

// ~ =============================================>
// ~ ======= Respond to an agent enquiry
// ~ =============================================>
export const updateAgentEnquiry = authenticatedMutation({
  args: {
    enquiryId: v.id("agent_enquiries"),
    updateData: partial(schema.tables.agent_enquiries.validator),
  },
  handler: async (ctx, args): Promise<Doc<"agent_enquiries"> | null> => {
    await ctx.db.patch(args.enquiryId, args.updateData);
    return await ctx.db.get(args.enquiryId);
  },
});

// ~ =============================================>
// ~ ======= Get all enquiries by restaurant
// ~ =============================================>
export const getAgentEnquiriesByRestaurant = authenticatedQuery({
  args: {
    restaurant: v.id("restaurants"),
  },
  handler: async (
    ctx,
    args
  ): Promise<
    (Doc<"agent_enquiries"> & {
      agent: Doc<"restaurant_agents"> | null;
    })[]
  > => {
    const enquiry = await ctx.db
      .query("agent_enquiries")
      .withIndex("by_restaurant", (q) => q.eq("restaurant", args.restaurant))
      .order("desc")
      .collect();

    const response = enquiry.map(async (singleEnquiry) => {
      return {
        ...singleEnquiry,
        agent: await ctx.db.get(singleEnquiry.agentId),
      };
    });

    return await Promise.all(response);
  },
});

// ~  ===========================================>
// ~  ====== Get enquiry by enquiryId
// ~ =============================================>
export const getAgentEnquiryById = authenticatedQuery({
  args: { enquiryId: v.id("agent_enquiries") },
  handler: async (ctx, args): Promise<Doc<"agent_enquiries"> | null> => {
    return await ctx.db.get(args.enquiryId);
  },
});

// ~ =============================================>
// ~ ======= R    pond to an agent enquiry
// ~   ============================================>
export const respondToAgentEnquiry = authenticatedAction({
  args: {
    enquiryId: v.id("agent_enquiries"),
    response: v.string(),
  },
  handler: async (ctx, args): Promise<Doc<"agent_enquiries"> | null> => {
    await ctx.runMutation(
      api.features.agent_enquiries.functions.updateAgentEnquiry,
      {
        enquiryId: args.enquiryId,
        updateData: { response: args.response, status: "RESOLVED" },
      }
    );
    const enquiry = await ctx.runQuery(
      api.features.agent_enquiries.functions.getAgentEnquiryById,
      { enquiryId: args.enquiryId }
    );
    if (!enquiry?.restaurant) {
      return null;
    }

    const { thread } = await restaurantAgent.continueThread(
      {
        ...ctx,
        restaurantId: enquiry?.restaurant,
        chatId: enquiry?.chatId as string,
      },

      { threadId: enquiry?.threadId as string }
    );

    const agent = await ctx.runQuery(
      api.features.agents.functions.getSingleAgent,
      { agent: enquiry?.agentId as Id<"restaurant_agents"> }
    );
    const restaurant = await ctx.runQuery(
      api.features.restaurants.functions.getRestaurant,
      { id: enquiry?.restaurant as Id<"restaurants"> }
    );

    const response = await thread.generateText({
      temperature: 0.5,
      system: restaurantAgentPrompt({
        tone: humanTone(),
        goals: agent?.goals || "",
        personna: agent?.persona || "",
        traits: agent?.traits?.join(", ") || "",
        restaurantName: restaurant?.name || "",
        restaurantDetails: restaurant?.description || "",
        agentName: agent?.name || "",
      }),
      prompt: `
        query: ${enquiry?.enquiry}
        restaurant-response: ${args.response}        
    `,
    });

    await ctx.runAction(
      api.infrastructure.services.unipile.functions.sendMessageToUser,
      {
        response: response.text,
        chat_id: enquiry?.chatId as string,
      }
    );

    return enquiry;
  },
});
