import { v } from "convex/values";
import { defineTable } from "convex/server";
import { MenuItemOption, Money } from "../shared";
import { Allergen } from "../enums";

export const menu_items = defineTable({
  menu: v.id("menus"),
  brand: v.id("brands"),
  restaurant: v.id("restaurants"),

  name: v.string(),
  description: v.string(),
  image: v.string(),
  allergens: v.optional(v.array(Allergen)),
  mayContain: v.optional(v.array(Allergen)),
  calories: v.optional(v.number()),
  isAvailable: v.boolean(),
  options: v.array(MenuItemOption),

  basePrice: Money,
  promotionalPrice: Money,
})
  .index("by_menu", ["menu"])
  .index("by_brand", ["brand"])
  .index("by_name", ["name"])
  .index("by_restaurant", ["restaurant"])
  .index("by_calories", ["calories"]);
