import { authenticatedMutation } from "../_custom/mutation";
import { authenticatedQuery } from "../_custom/query";
import { v } from "convex/values";
import type { Doc, Id } from "../_generated/dataModel";
import { getManyFrom } from "convex-helpers/server/relationships";

// ~ =============================================>
// ~ ======= Create Menu
// ~ =============================================>
export const create = authenticatedMutation({
  args: {
    restaurant: v.id("restaurants"),
    brand: v.id("brands"),
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<Id<"menus">> => {
    return ctx.db.insert("menus", {
      ...args,
      isActive: false,
      approvalStatus: "IN_REVIEW",
    });
  },
});

// ~ =============================================>
// ~ ======= Delete Menu
// ~ =============================================>
export const deleteMenu = authenticatedMutation({
  args: { id: v.id("menus") },
  handler: async (ctx, args): Promise<{ success: boolean }> => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// ~ =============================================>
// ~ ======= Get Restaurant menus
// ~ =============================================>
export const getMenuByRestaurant = authenticatedQuery({
  args: { restaurant: v.id("restaurants") },
  handler: async (ctx, args): Promise<Doc<"menus">[]> => {
    return getManyFrom(ctx.db, "menus", "by_restaurant", args.restaurant);
  },
});

// ~ =============================================>
// ~ ======= Get Menu Analytics
// ~ =============================================>
export const menuAnalytics = authenticatedQuery({
  args: { restaurant: v.id("restaurants") },
  handler: async (
    ctx,
    args,
  ): Promise<{ menuCount: number; menuItemCount: number }> => {
    const menus = await getManyFrom(
      ctx.db,
      "menus",
      "by_restaurant",
      args.restaurant,
    );
    const menuItems = await getManyFrom(
      ctx.db,
      "menu_items",
      "by_restaurant",
      args.restaurant,
    );

    return { menuCount: menus.length, menuItemCount: menuItems.length };
  },
});
