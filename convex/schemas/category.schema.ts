import { v } from "convex/values";
import { defineTable } from "convex/server";

export const categories = defineTable({
  name: v.string(),
  description: v.optional(v.string()),

  restaurant: v.id("restaurants"),
  brand: v.id("brands"),
})
  .index("by_restaurant", ["restaurant"])
  .index("by_brand", ["brand"]);
