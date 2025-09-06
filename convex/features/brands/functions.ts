import { v } from "convex/values";
import { getAll, getManyFrom } from "convex-helpers/server/relationships";
import { authenticatedMutation } from "../../_custom/mutation";
import { authenticatedQuery } from "../../_custom/query";
import type { Doc, Id } from "../../_generated/dataModel";
import { mutation } from "../../_generated/server";
import { createBrandDto } from "./brands.dto";

// ~ =============================================>
// ~ ======= Create a brand
// ~ =============================================>
export const createBrand = authenticatedMutation({
  args: createBrandDto,
  handler: async (ctx, args): Promise<Id<"brands">> => {
    const brand = await ctx.db.insert("brands", {
      ...args,
      primaryOwner: ctx.user.id,
    });
    ctx.db.patch(ctx.user.id, { hasBrand: true });
    ctx.db.insert("users_x_brands", {
      user: ctx.user.id,
      brand,
      role: "PRIMARY_OWNER",
    });
    return brand;
  },
});

// ~ =============================================>
// ~ ======= Generate brand slug
// ~ =============================================>
export const generateBrandSlug = mutation({
  args: { brandName: v.string(), currentSlug: v.optional(v.string()) },
  handler: async (
    ctx,
    { brandName }
  ): Promise<{ data?: string; error?: string }> => {
    if (brandName.length < 3) return { error: "Name too short." };

    const threeLetterCode = brandName.substring(0, 3).toLowerCase();

    // ~ ======= Set pin boundaries ======= ~
    const min = 10_000;
    const max = 99_999;

    let isUnique = false;
    let slug = "";

    // ~ ======= Check if slug is unique ======= ~
    while (!isUnique) {
      const randomPin = Math.floor(Math.random() * (max - min + 1)) + min;
      slug = `brd_${threeLetterCode}_${randomPin}`;
      const exists = await ctx.db
        .query("brands")
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
// ~ ======= Get a brand by id or slug
// ~ =============================================>
export const getBrand = authenticatedQuery({
  args: { id: v.optional(v.id("brands")), slug: v.optional(v.string()) },
  handler: async (ctx, { id, slug }): Promise<Doc<"brands"> | null> => {
    if (!(id || slug)) throw new Error("Either id or slug is required");
    let brand: Doc<"brands"> | null = null;

    if (id) brand = await ctx.db.get(id);
    if (slug)
      brand = await ctx.db
        .query("brands")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .first();

    return brand;
  },
});

// ~ =============================================>
// ~ ======= Get users brands
// ~ =============================================>
export const getUserBrands = authenticatedQuery({
  args: {},
  handler: async (ctx): Promise<(Doc<"brands"> | null)[]> => {
    if (!ctx.user?.id) return [];
    const brandAffiliations = await getManyFrom(
      ctx.db,
      "users_x_brands",
      "by_user",
      ctx.user?.id
    );

    const brands = await getAll(
      ctx.db,
      brandAffiliations.map((affiliation) => affiliation.brand)
    );

    return brands;
  },
});
