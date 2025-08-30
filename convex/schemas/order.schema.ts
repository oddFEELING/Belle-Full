import { v } from "convex/values";
import { defineTable } from "convex/server";
import { FulfilmentType, OrderStatus } from "../types/enums";
import { DateTime, Money } from "../types/shared";

export const orders = defineTable({
  customer: v.id("users"),
  restaurant: v.id("restaurants"),
  brand: v.id("brands"),

  status: OrderStatus,
  FulfilmentType: FulfilmentType,
  itemsSubtotal: Money,
  scheduledFor: DateTime,
  deliveryAddress: v.id("addresses"),
  deliveryInstructions: v.optional(v.string()),
  deliveryFee: Money,

  serviceFee: Money,
  smallOrderFee: v.optional(Money),
});
