import { v } from "convex/values";

export const createAgentDto = {
  name: v.string(),
  type: v.union(v.literal("whatsapp"), v.literal("instagram")),
  agent_id: v.string(),
  supervisor_number: v.string(),
  restaurant: v.id("restaurants"),
};

export const createDBAgentDto = {
  name: v.string(),
  type: v.union(v.literal("whatsapp"), v.literal("instagram")),
  agent_id: v.string(),
  supervisor_number: v.string(),
  restaurant: v.id("restaurants"),
};
