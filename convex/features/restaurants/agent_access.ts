import { v } from "convex/values";
import { parse } from "convex-helpers/validators";
import type { Doc } from "../../_generated/dataModel";
import { internalQuery } from "../../_generated/server";
import {
  type AgentRestaurantReturn,
  agentRestaurantReturn,
} from "./interfaces/restaurants.dto";

// ~ =============================================>
// ~ ======= Get restaurant by id
// ~ =============================================>
export const getRestaurant = internalQuery({
  args: { restaurant: v.id("restaurants") },
  handler: async (ctx, args): Promise<AgentRestaurantReturn | null> => {
    const restaurant = await ctx.db.get(args.restaurant);

    return parse(agentRestaurantReturn, restaurant);
  },
});

export const getAgentMenuItemsByRestaurantId = internalQuery({
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

// ~ =============================================>
// ~ ======= Get all ffood items from the platform
// ~ =============================================>
export const getAgentGetAllFoodItems = internalQuery({
  args: {},
  handler: async (ctx, args): Promise<Doc<"menu_items">[]> => {
    const menuItems = await ctx.db.query("menu_items").order("desc").collect();
    return menuItems as Doc<"menu_items">[];
  },
});

// ~ =============================================>
// ~ ======= Get all food items for a restaurant
// ~ =============================================>
export const agentGetRestaurantMenuItems = internalQuery({
  args: { restaurant: v.id("restaurants") },
  handler: async (ctx, args): Promise<Doc<"menu_items">[]> => {
    return await ctx.db
      .query("menu_items")
      .withIndex("by_restaurant", (q) => q.eq("restaurant", args.restaurant))
      .order("desc")
      .collect();
  },
});
