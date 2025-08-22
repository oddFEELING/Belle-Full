import { v } from "convex/values";
import { defineTable } from "convex/server";

export const menu_x_category = defineTable({
  menu: v.id("menus"),
  category: v.id("categories"),
  position: v.number(),
}).index("by_menu", ["menu"]);
