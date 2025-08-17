/*
!!! important !!!

This file can only import from the enums file.
This prevents circular dependencies.

🌹 Cheers.
*/

import { v } from "convex/values";
import { Allergen, Currency, DietaryTag } from "./enums";

export const Money = v.object({
  currency: Currency,
  amount: v.number(),
});

export const DeliveryZone = v.object({
  postcode: v.string(),
  deliveryFee: Money,
  minOrderSubTotal: Money,
});

export const MenuItemOption = v.object({
  name: v.string(),
  price: Money,
  calories: v.optional(v.number()),
  allergens: v.optional(v.array(Allergen)),
  dietaryTags: v.optional(v.array(DietaryTag)),
  description: v.string(),
  picks: v.array(v.object({ name: v.string(), price: Money })),
  isAvailable: v.boolean(),
});

export const DateTime = v.object({
  ms: v.number(),
  timeText: v.string(),
  isoString: v.string(),
});
