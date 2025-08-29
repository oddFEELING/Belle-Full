import { query } from "../../_generated/server";
import { v } from "convex/values";
import type { Doc } from "../../_generated/dataModel";

export const getRestaurant = query({
  args: { restaurant: v.id("restaurants") },
  handler: async (ctx, args): Promise<Doc<"restaurants"> | null> => {
    return await ctx.db.get(args.restaurant);
  },
});

export const getAgentMenuItemsByRestaurantId = query({
  args: {
    restaurantId: v.id("restaurants"),
  },
  handler: async (ctx, args): Promise<Doc<"menu_items">[]> => {
    const menuItems = await ctx.db
      .query("menu_items")
      .withIndex("by_restaurant", (q) => q.eq("restaurant", args.restaurantId))
      .order("desc")
      .collect();
    return menuItems as Doc<"menu_items">[];
  },
});

export const getAgentRestaurantById = query({
  args: {
    id: v.id("restaurants"),
  },
  handler: async (ctx, args): Promise<Doc<"restaurants"> | null> => {
    const restaurant = await ctx.db.get(args.id);
    return restaurant;
  },
});

export const getAgentGetAllFoodItems = query({
  args: {},
  handler: async (ctx, args): Promise<Doc<"menu_items">[]> => {
    const menuItems = await ctx.db.query("menu_items").order("desc").collect();
    return menuItems as Doc<"menu_items">[];
  },
});
