import { v } from "convex/values";
import { defineTable } from "convex/server";
import { RestaurantStatus } from "../enums";
import { DeliveryZone, Money } from "../shared";

export const restaurants = defineTable({
  brand: v.id("brands"),

  name: v.string(),
  address: v.optional(v.id("addresses")),
  code: v.optional(v.string()),
  status: RestaurantStatus,
  phone: v.optional(v.string()),
  opensAt: v.optional(v.string()),
  closesAt: v.optional(v.string()),
  activeMenu: v.optional(v.id("menus")),
  fhrsRating: v.optional(v.number()),
  fhrsAuthority: v.optional(v.string()),

  fulfilment: v.optional(
    v.object({
      supportsDelivery: v.boolean(),
      supportsPickup: v.boolean(),
      defaultPrepMinutes: v.number(),
      avgCourierPickupSlackMins: v.optional(v.number()),
      minOrderSubTotal: Money,
    }),
  ),

  deliveryZones: v.optional(v.array(DeliveryZone)),
})
  .index("by_brand", ["brand"])
  .index("by_code", ["code"])
  .index("by_status", ["status"]);
