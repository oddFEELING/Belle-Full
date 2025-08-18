import { v } from "convex/values";
import { defineTable } from "convex/server";
import { CuisineTag, DietaryTag } from "../enums";

export const brands = defineTable({
  owner: v.id("users"),

  name: v.string(),
  slug: v.string(),
  description: v.string(),
  logo: v.optional(v.string()),
  website: v.string(),
  bellefullDomain: v.optional(v.string()),
  phone: v.string(),
  cuisines: v.optional(v.array(CuisineTag)),
  dietaryTags: v.optional(v.array(DietaryTag)),
  heroImage: v.optional(v.string()),
  supportEmail: v.optional(v.string()),
  supportPhone: v.optional(v.string()),
});
