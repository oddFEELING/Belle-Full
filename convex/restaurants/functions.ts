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
  },
  handler: async (ctx, args): Promise<Id<"restaurants">> => {
    // TODO: proper slug gen
    const slug = args.name.toLowerCase().replace(/ /g, "-");
    const restaurant = await ctx.db.insert("restaurants", {
      ...args,
      status: "DRAFT",
      slug,
    });
    return restaurant;
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
