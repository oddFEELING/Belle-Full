import { authenticatedMutation } from "../_custom/mutation";
import { authenticatedQuery } from "../_custom/query";
import { v } from "convex/values";
import type { Id } from "../_generated/dataModel";
import type { Doc } from "../_generated/dataModel";

// ~ =============================================>
// ~ ======= Get brand restaurants
// ~ =============================================>
export const getBrandRestaurants = authenticatedQuery({
  args: { brandId: v.id("brands") },
  handler: async (ctx, { brandId }): Promise<Doc<"restaurants">[]> => {
    return ctx.db
      .query("restaurants")
      .withIndex("by_brand", (q) => q.eq("brand", brandId))
      .collect();
  },
});

// ~ =============================================>
// ~ ======= Create a restaurant
// ~ =============================================>
export const create = authenticatedMutation({
  args: {
    brand: v.id("brands"),
    name: v.string(),
  },
  handler: async (ctx, args): Promise<Id<"restaurants">> => {
    const restaurant = await ctx.db.insert("restaurants", {
      ...args,
      status: "DRAFT",
    });
    return restaurant;
  },
});
