import { v } from "convex/values";
import type { Doc } from "@/_generated/dataModel";
import { internalMutation, internalQuery } from "../../_generated/server";

// ~ =============================================>
// ~ ======= Create an agent enquiry
// ~ =============================================>
export const agentCreateEnquiry = internalMutation({
  args: {
    threadId: v.string(),
    agentId: v.id("restaurant_agents"),
    restaurant: v.id("restaurants"),
    enquiry: v.string(),
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
// ~ ======= Get agent enquiry status
// ~ =============================================>
export const agentGetEnquiryStatus = internalQuery({
  args: { enquiryId: v.id("agent_enquiries") },
  handler: async (ctx, args): Promise<Doc<"agent_enquiries"> | null> => {
    return await ctx.db.get(args.enquiryId);
  },
});
