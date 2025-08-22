import { v } from "convex/values";
import { authenticatedMutation } from "../../_custom/mutation";
import { Allergen } from "../../enums";
import { MenuItemOption, Money } from "../../shared";
import { authenticatedQuery } from "../../_custom/query";
import { getManyFrom } from "convex-helpers/server/relationships";
import type { Doc } from "../../_generated/dataModel";

// ~ =============================================>
// ~ ======= Create Menu Item
// ~ =============================================>
export const create = authenticatedMutation({
  args: {
    menu: v.id("menus"),
    brand: v.id("brands"),
    restaurant: v.id("restaurants"),
    name: v.string(),
    description: v.string(),
    image: v.optional(v.string()),
    mayContain: v.optional(v.array(Allergen)),
    calories: v.optional(v.number()),
    isAvailable: v.boolean(),
    options: v.optional(v.array(MenuItemOption)),
    basePrice: Money,
  },
  handler: async (ctx, args) => {
    return {};
  },
});

// ~ =============================================>
// ~ ======= Get restaurant menu items
// ~ =============================================>
export const getMenuItemsByRestaurant = authenticatedQuery({
  args: { restaurant: v.id("restaurants") },
  handler: async (ctx, args): Promise<Doc<"menu_items">[]> => {
    return getManyFrom(ctx.db, "menu_items", "by_restaurant", args.restaurant);
  },
});
