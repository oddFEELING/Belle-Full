import { v } from "convex/values";
import { authenticatedMutation } from "../../../_custom/mutation";
import { Doc, Id } from "../../../_generated/dataModel";
import { getManyFrom } from "convex-helpers/server/relationships";
import { authenticatedQuery } from "../../../_custom/query";

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
    return ctx.db.insert("categories", args);
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
    return getManyFrom(ctx.db, "categories", "by_restaurant", restaurant);
  },
});

// ~ =============================================>
// ~ ======= Delete Category
// ~ =============================================>
export const deleteCategory = authenticatedMutation({
  args: { id: v.id("categories") },
  handler: async (ctx, { id }): Promise<void> => {
    ctx.db.delete(id);
  },
});
