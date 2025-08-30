import { query } from "../../_generated/server";
import { Infer, v } from "convex/values";
import type { Doc } from "../../_generated/dataModel";
import { parse } from "convex-helpers/validators";
import {
  type AgentRestaurantReturn,
  agentRestaurantReturn,
} from "./interfaces/restaurants.dto";

// ~ =============================================>
// ~ ======= Get restaurant by id
// ~ =============================================>
export const getRestaurant = query({
  args: { restaurant: v.id("restaurants") },
  handler: async (ctx, args): Promise<AgentRestaurantReturn | null> => {
    const restaurant = await ctx.db.get(args.restaurant);

    return parse(agentRestaurantReturn, restaurant);
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

// ~ =============================================>
// ~ ======= Get all ffood items from the platform
// ~ =============================================>
export const getAgentGetAllFoodItems = query({
  args: {},
  handler: async (ctx, args): Promise<Doc<"menu_items">[]> => {
    const menuItems = await ctx.db.query("menu_items").order("desc").collect();
    return menuItems as Doc<"menu_items">[];
  },
});

// ~ =============================================>
// ~ ======= Get all food items for a restaurant
// ~ =============================================>
export const agentGetRestaurantMenuItems = query({
  args: { restaurant: v.id("restaurants") },
  handler: async (ctx, args): Promise<Doc<"menu_items">[]> => {
    return ctx.db
      .query("menu_items")
      .withIndex("by_restaurant", (q) => q.eq("restaurant", args.restaurant))
      .order("desc")
      .collect();
  },
});
