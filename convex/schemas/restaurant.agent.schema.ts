import { defineTable } from "convex/server";
import { v } from "convex/values";
import { AgentConnectionStatus } from "../enums";

export const restaurant_agents = defineTable({
  restaurant: v.id("restaurants"),
  agent_id: v.string(),
  unipile_id: v.optional(v.string()),
  auth_code: v.optional(v.string()),
  connection_status: AgentConnectionStatus,
  supervisor_number: v.string(),
  exluded_contacts: v.array(v.string()),
  flagged_numbers: v.array(v.string()),
  lastSync: v.optional(
    v.object({
      status: v.union(v.literal("SUCCESS"), v.literal("FAILED")),
      timestamp: v.number(),
    }),
  ),
  type: v.union(v.literal("whatsapp"), v.literal("instagram")),

  // ~ ======= Character building ======= ~
  name: v.string(),
  persona: v.optional(v.string()),
  traits: v.optional(v.array(v.string())),
  goals: v.optional(v.string()),
})
  .index("by_restaurant", ["restaurant"])
  .index("by_agent_id", ["agent_id"])
  .index("by_name", ["name"])
  .index("by_unipile_id", ["unipile_id"]);
