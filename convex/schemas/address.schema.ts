import { v } from "convex/values";
import { defineTable } from "convex/server";
import { AddressType } from "../enums";

export const addresses = defineTable({
  line1: v.string(),
  line2: v.string(),
  city: v.string(),
  postcode: v.string(),
  country: v.string(),
  geoData: v.id("points"),
  type: AddressType,
})
  .index("by_city", ["city"])
  .index("by_postcode", ["postcode"]);
