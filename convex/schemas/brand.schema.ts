import { v } from "convex/values";
import { defineTable } from "convex/server";
import { CuisineTag, DietaryTag } from "../enums";

export const brands = defineTable({
  name: v.string(),
  slug: v.string(),
  description: v.string(),
  logo: v.string(),
  website: v.string(),
  bellefullDomain: v.optional(v.string()),
  phone: v.string(),
  cuisines: v.array(CuisineTag),
  dietaryTags: v.optional(v.array(DietaryTag)),
  heroImage: v.string(),
  supportEmail: v.string(),
  supportPhone: v.string(),
});
