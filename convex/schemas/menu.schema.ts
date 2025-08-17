import { v } from "convex/values";
import { defineTable } from "convex/server";

export const menus = defineTable({
  restaurant: v.id("restaurants"),
  brand: v.id("brands"),
  name: v.string(),
  description: v.string(),
})
  .index("by_restaurant", ["restaurant"])
  .index("by_brand", ["brand"]);
