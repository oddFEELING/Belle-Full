import { defineTable } from "convex/server";
import { v } from "convex/values";
import { Allergen, DietaryTag } from "../types/enums";
import { MenuItemOption, Money } from "../types/shared";

export const menu_items = defineTable({
  brand: v.id("brands"),
  restaurant: v.id("restaurants"),

  name: v.string(),
  description: v.string(),
  image: v.optional(v.string()),
  allergens: v.array(Allergen),
  mayContain: v.array(Allergen),
  dietaryTags: v.array(DietaryTag),
  calories: v.optional(v.number()),
  isAvailable: v.boolean(),
  options: v.array(MenuItemOption),

  basePrice: Money,
  promotionalPrice: Money,
})
  .index("by_brand", ["brand"])
  .index("by_name", ["name"])
  .index("by_restaurant", ["restaurant"])
  .index("by_calories", ["calories"]);
