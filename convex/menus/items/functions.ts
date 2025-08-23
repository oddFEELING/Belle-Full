import { v } from "convex/values";
import { authenticatedMutation } from "../../_custom/mutation";
import { Allergen, DietaryTag } from "../../enums";
import { MenuItemOption, Money } from "../../shared";
import { authenticatedQuery } from "../../_custom/query";
import { getManyFrom } from "convex-helpers/server/relationships";
import type { Doc } from "../../_generated/dataModel";

// ~ =============================================>
// ~ ======= Create Menu Item
// ~ =============================================>
export const create = authenticatedMutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("menu_items", args);
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
