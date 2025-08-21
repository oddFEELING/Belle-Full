import { v } from "convex/values";
import { defineTable } from "convex/server";
import {
  DocumentType,
  RestaurantDocumentStatus,
  RestaurantLegalDocuments,
} from "../enums";

export const restaurant_documents = defineTable({
  restaurant: v.id("restaurants"),
  uploadedBy: v.id("users"),

  name: v.string(),
  size: v.number(),
  key: v.string(),
  type: DocumentType,
  category: RestaurantLegalDocuments,
  status: RestaurantDocumentStatus,
}).index("by_restaurant", ["restaurant"]);
