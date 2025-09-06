import { defineTable } from "convex/server";
import { v } from "convex/values";
import { Allergen, DietaryTag } from "../types/enums";
import { MenuItemOption, Money } from "../types/shared";

export const order_items = defineTable({
  order: v.id("orders"),
  menuItem: v.id("menu_items"),

  name: v.string(),
  quantity: v.number(),
  options: v.optional(v.array(MenuItemOption)),
  unitPrice: Money,
  allergens: v.optional(v.array(Allergen)),
  dietaryTags: v.optional(v.array(DietaryTag)),
});
