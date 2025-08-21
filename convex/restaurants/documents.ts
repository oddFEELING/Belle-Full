import { v } from "convex/values";
import { r2 } from "../components/r2";
import { authenticatedMutation } from "../_custom/mutation";
import { DocumentType, RestaurantLegalDocuments } from "../enums";
import { Id } from "../_generated/dataModel";

const PREFIX = "rst_doc";

// ~ =============================================>
// ~ ======= Setup r2 functions
// ~ =============================================>
export const { syncMetadata } = r2.clientApi({
  checkUpload: async (ctx, bucket) => {},
  onUpload: async (ctx, bucket, key) => {},
});

// ~ =============================================>
// ~ ======= Generate custom key
// ~ =============================================>
export const generateUploadUrl = authenticatedMutation({
  args: {},
  handler: async (ctx) => {
    const key = `${PREFIX}_${crypto.randomUUID()}_${Date.now()}`;
    return r2.generateUploadUrl(key);
  },
});

// ~ =============================================>
// ~ ======= Create uploaded Document
// ~ =============================================>
export const createUploadedDocument = authenticatedMutation({
  args: {
    restaurant: v.id("restaurants"),
    name: v.string(),
    size: v.number(),
    key: v.string(),
    type: DocumentType,
    category: RestaurantLegalDocuments,
  },
  handler: async (ctx, args): Promise<Id<"restaurant_documents">> => {
    return ctx.db.insert("restaurant_documents", {
      ...args,
      uploadedBy: ctx.user.id,
    });
  },
});
