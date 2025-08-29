import { v } from "convex/values";
import { defineTable } from "convex/server";
import { ReviewableItemStatus } from "../types/enums";

export const menus = defineTable({
  restaurant: v.id("restaurants"),
  brand: v.id("brands"),
  name: v.string(),
  isActive: v.boolean(),
  description: v.optional(v.string()),
  approvalStatus: ReviewableItemStatus,
})
  .index("by_restaurant", ["restaurant"])
  .index("by_brand", ["brand"]);
