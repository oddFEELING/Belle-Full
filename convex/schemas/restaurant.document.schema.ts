import { v } from "convex/values";
import { defineTable } from "convex/server";
import { ReastaurantDocumentType, RestaurantLegalDocuments } from "../enums";

export const restaurant_documents = defineTable({
  restaurant: v.id("restaurants"),
  uploadedBy: v.id("users"),

  name: v.string(),
  key: v.string(),
  type: ReastaurantDocumentType,
  category: RestaurantLegalDocuments,
}).index("by_restaurant", ["restaurant"]);
