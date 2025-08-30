import { defineTable } from "convex/server";
import { v } from "convex/values";

export const agent_enquiries = defineTable({
  threadId: v.string(),
  restaurant: v.id("restaurants"),
  agentId: v.id("restaurant_agents"),
  enquiry: v.string(),
  status: v.union(
    v.literal("PENDING"),
    v.literal("RESOLVED"),
    v.literal("CLOSED"),
  ),
  resolvedBy: v.optional(v.id("users")),
  resolvedAt: v.optional(v.number()),
  response: v.optional(v.string()),
})
  .index("by_restaurant", ["restaurant"])
  .index("by_agent", ["agentId"]);
