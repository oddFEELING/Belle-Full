import { defineTable } from "convex/server";
import { v } from "convex/values";
import { CuisineTag, DietaryTag } from "../types/enums";

export const brands = defineTable({
  primaryOwner: v.id("users"),
  secondaryOwners: v.optional(v.array(v.id("users"))),

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
})
  .index("by_slug", ["slug"])
  .index("by_cuisines", ["cuisines"])
  .index("by_dietary_tags", ["dietaryTags"])
  .index("by_primary_owner", ["primaryOwner"])
  .index("by_secondary_owners", ["secondaryOwners"])
  .index("by_bellefull_domain", ["bellefullDomain"]);
