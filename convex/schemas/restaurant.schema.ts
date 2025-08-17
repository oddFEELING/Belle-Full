import { v } from "convex/values";
import { defineTable } from "convex/server";
import { RestaurantStatus } from "../enums";
import { DeliveryZone, Money } from "../shared";

export const restaurants = defineTable({
  brand: v.id("brands"),

  name: v.string(),
  address: v.id("addresses"),
  code: v.string(),
  status: RestaurantStatus,
  phone: v.optional(v.string()),
  opensAt: v.string(),
  closesAt: v.string(),
  activeMenu: v.optional(v.id("menus")),
  fhrsRating: v.number(),
  fhrsAuthority: v.string(),

  fulfilment: v.object({
    supportsDelivery: v.boolean(),
    supportsPickup: v.boolean(),
    defaultPrepMinutes: v.number(),
    avgCourierPickupSlackMins: v.optional(v.number()),
    minOrderSubTotal: Money,
  }),

  deliveryZones: v.optional(v.array(DeliveryZone)),
});
