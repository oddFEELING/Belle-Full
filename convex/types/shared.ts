/*
!!! important !!!

This file can only import from the enums file.
This prevents circular dependencies.

🌹 Cheers.
*/

import { type Infer, v } from "convex/values";
import { Allergen, Currency, DietaryTag } from "./enums";

export const Money = v.object({
  currency: Currency,
  amount: v.number(),
});
export type Money = Infer<typeof Money>;

export const DeliveryZone = v.object({
  postcode: v.string(),
  deliveryFee: Money,
  minOrderSubTotal: Money,
});

export type DeliveryZone = Infer<typeof DeliveryZone>;

export const MenuItemOption = v.object({
  name: v.string(),
  description: v.string(),
  picks: v.array(
    v.object({
      name: v.string(),
      price: Money,
      calories: v.optional(v.number()),
      allergens: v.optional(v.array(Allergen)),
      dietaryTags: v.optional(v.array(DietaryTag)),
    })
  ),
  isAvailable: v.boolean(),
  position: v.number(),
});

export type MenuItemOption = Infer<typeof MenuItemOption>;

export const DateTime = v.object({
  ms: v.number(),
  timeText: v.string(),
  isoString: v.string(),
});
export type DateTime = Infer<typeof DateTime>;
