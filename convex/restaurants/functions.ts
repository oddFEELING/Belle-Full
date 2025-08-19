import { authenticatedMutation } from "../_custom/mutation";
import { authenticatedQuery } from "../_custom/query";
import { v } from "convex/values";
import type { Id } from "../_generated/dataModel";
import { mutation } from "../_generated/server";
import type { Doc } from "../_generated/dataModel";
import { api } from "../_generated/api";

// ~ =============================================>
// ~ ======= Get brand restaurants
// ~ =============================================>
export const getBrandRestaurants = authenticatedQuery({
  args: { brandId: v.id("brands") },
  handler: async (ctx, { brandId }): Promise<Doc<"restaurants">[]> => {
    return ctx.db
      .query("restaurants")
      .withIndex("by_brand_name", (q) => q.eq("brand", brandId))
      .order("asc")
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
    description: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<Id<"restaurants">> => {
    const slug = await ctx.runMutation(
      api.restaurants.functions.generateRestaurantSlug,
      { restaurantName: args.name },
    );
    const restaurant = await ctx.db.insert("restaurants", {
      ...args,
      status: "DRAFT",
      slug: slug.data,
    });
    return restaurant;
  },
});

// ~ =============================================>
// ~ ======= Generate restaurant slug
// ~ =============================================>
export const generateRestaurantSlug = mutation({
  args: { restaurantName: v.string() },
  handler: async (ctx, { restaurantName }): Promise<{ data: string }> => {
    const threeLetterCode = restaurantName.substring(0, 3).toLowerCase();

    // ~ ======= Set pin boundaries ======= ~
    const min = 10000;
    const max = 99999;

    let isUnique = false;
    let slug = "";

    // ~ ======= Check if slug is unique ======= ~
    while (!isUnique) {
      const randomPin = Math.floor(Math.random() * (max - min + 1)) + min;
      slug = `rst_${threeLetterCode}_${randomPin}`;
      const exists = await ctx.db
        .query("restaurants")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .first();

      if (!exists) {
        isUnique = true;
      }
    }

    return { data: slug };
  },
});

// ~ =============================================>
// ~ ======= Get a restaurant
// ~ =============================================>
export const getRestaurant = authenticatedQuery({
  args: {
    id: v.optional(v.id("restaurants")),
    slug: v.optional(v.string()),
  },
  handler: async (ctx, { id, slug }): Promise<Doc<"restaurants"> | null> => {
    let restaurant: Doc<"restaurants"> | null = null;

    if (id) restaurant = await ctx.db.get(id);
    if (slug)
      restaurant = await ctx.db
        .query("restaurants")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .first();

    return restaurant;
  },
});
