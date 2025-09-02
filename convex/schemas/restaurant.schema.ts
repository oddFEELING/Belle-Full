import { defineTable } from "convex/server";
import { v } from "convex/values";
import { RestaurantStatus } from "../types/enums";
import { DeliveryZone, Money } from "../types/shared";

export const restaurants = defineTable({
  brand: v.id("brands"),
  slug: v.string(),

  name: v.string(),
  description: v.optional(v.string()),
  address: v.optional(v.id("addresses")),
  code: v.optional(v.string()),
  status: RestaurantStatus,
  phone: v.optional(v.string()),
  opensAt: v.optional(v.string()),
  closesAt: v.optional(v.string()),
  activeMenu: v.optional(v.id("menus")),
  fhrsRating: v.optional(v.number()),
  fhrsAuthority: v.optional(v.string()),
})
  .index("by_brand", ["brand"])
  .index("by_brand_name", ["brand", "name"])
  .index("by_code", ["code"])
  .index("by_status", ["status"])
  .index("by_slug", ["slug"]);
