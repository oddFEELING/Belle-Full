import { v } from "convex/values";
import { getManyFrom } from "convex-helpers/server/relationships";
import { authenticatedMutation } from "../../_custom/mutation";
import { authenticatedQuery } from "../../_custom/query";
import type { Doc, Id } from "../../_generated/dataModel";

// ~ =============================================>
// ~ ======= Create Category
// ~ =============================================>
export const create = authenticatedMutation({
  args: {
    restaurant: v.id("restaurants"),
    brand: v.id("brands"),
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<Id<"categories">> => {
    return await ctx.db.insert("categories", args);
  },
});

// ~ =============================================>
// ~ ======= Get restaurant categories
// ~ =============================================>
export const getByRestaurant = authenticatedQuery({
  args: {
    restaurant: v.id("restaurants"),
  },
  handler: async (ctx, { restaurant }): Promise<Doc<"categories">[]> => {
    return await getManyFrom(ctx.db, "categories", "by_restaurant", restaurant);
  },
});

// ~ =============================================>
// ~ ======= Delete Category
// ~ =============================================>
export const deleteCategory = authenticatedMutation({
  args: { id: v.id("categories") },
  handler: async (ctx, { id }): Promise<void> => {
    await ctx.db.delete(id);
  },
});
