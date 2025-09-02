import { Doc } from "@/_generated/dataModel";
import { internalQuery, internalMutation } from "../../_generated/server";
import { v } from "convex/values";

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
    ctx.db.insert("agent_enquiries", {
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
