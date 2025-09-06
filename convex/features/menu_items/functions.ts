import { v } from "convex/values";
import { getManyFrom } from "convex-helpers/server/relationships";
import { authenticatedMutation } from "../../_custom/mutation";
import { authenticatedQuery } from "../../_custom/query";
import type { Doc } from "../../_generated/dataModel";
import { r2 } from "../../infrastructure/components/r2";
import { Allergen, DietaryTag } from "../../types/enums";
import { MenuItemOption, Money } from "../../types/shared";

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
    const menuItems = await getManyFrom(
      ctx.db,
      "menu_items",
      "by_restaurant",
      args.restaurant
    );

    const response = menuItems.map(async (item) => ({
      ...item,
      image: item.image ? await r2.getUrl(item.image) : undefined,
    }));

    return await Promise.all(response);
  },
});
