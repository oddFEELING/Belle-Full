import { defineTable } from "convex/server";
import { v } from "convex/values";

export const menu_x_item = defineTable({
  menu: v.id("menus"),
  item: v.id("menu_items"),
  position: v.number(),
  category: v.optional(v.id("categories")),
})
  .index("by_menu", ["menu"])
  .index("by_item", ["item"])
  .index("by_category", ["category"]);
