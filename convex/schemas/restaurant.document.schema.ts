import { defineTable } from "convex/server";
import { v } from "convex/values";
import {
  DocumentType,
  RestaurantLegalDocuments,
  ReviewableItemStatus,
} from "../types/enums";

export const restaurant_documents = defineTable({
  restaurant: v.id("restaurants"),
  uploadedBy: v.id("users"),

  name: v.string(),
  size: v.number(),
  key: v.string(),
  type: DocumentType,
  category: RestaurantLegalDocuments,
  status: ReviewableItemStatus,
}).index("by_restaurant", ["restaurant"]);
