import { type Infer, v } from "convex/values";
import { DeliveryZone, Money, RestaurantStatus } from "@/types";

export const agentRestaurantReturn = v.object({
  name: v.string(),
  address: v.optional(v.string()),
  description: v.optional(v.string()),
  status: RestaurantStatus,
  opensAt: v.optional(v.string()),
  closesAt: v.optional(v.string()),
  fhrsRating: v.optional(v.number()),
  fulfilment: v.optional(
    v.object({
      supportsDelivery: v.boolean(),
      supportsPickup: v.boolean(),
      defaultPrepMinutes: v.number(),
      avgCourierPickupSlackMins: v.optional(v.number()),
      minOrderSubTotal: Money,
    })
  ),

  deliveryZones: v.optional(v.array(DeliveryZone)),

  flaggedForShutdown: v.optional(v.boolean()),
});

export type AgentRestaurantReturn = Infer<typeof agentRestaurantReturn>;
