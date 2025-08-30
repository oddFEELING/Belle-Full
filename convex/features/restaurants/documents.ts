import { v } from "convex/values";
import { r2 } from "../../infrastructure/components/r2";
import { authenticatedMutation } from "../../_custom/mutation";
import { DocumentType, RestaurantLegalDocuments } from "../../types/enums";
import type { Doc, Id } from "../../_generated/dataModel";
import { authenticatedQuery } from "../../_custom/query";
import {
  getManyFrom,
  getOneFromOrThrow,
} from "convex-helpers/server/relationships";
import { query } from "../../_generated/server";

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
      status: "IN_REVIEW",
      uploadedBy: ctx.user.id,
    });
  },
});

// ~ =============================================>
// ~ ======= List restaurant Documents
// ~ =============================================>
export const listDocuments = query({
  args: {
    restaurant: v.object({
      id: v.optional(v.id("restaurants")),
      slug: v.optional(v.string()),
    }),
  },
  handler: async (
    ctx,
    { restaurant },
  ): Promise<Doc<"restaurant_documents">[]> => {
    const { id, slug } = restaurant;
    let restaurantId = id;
    if (!id && slug) {
      const rest = await ctx.db
        .query("restaurants")
        .withIndex("by_slug", (q: any) => q.eq("slug", slug))
        .first();
      if (!rest) return [];
      restaurantId = rest._id as Id<"restaurants">;
    }

    // ~ ======= Get documents ======= ~
    const documents = await ctx.db
      .query("restaurant_documents")
      .withIndex("by_restaurant", (q) => q.eq("restaurant", restaurantId!))
      .collect();

    if (!documents) return [];

    return Promise.all(
      documents.map(async (doc) => ({
        ...doc,
        documentUrl: await r2.getUrl(doc.key),
        expiresIn: 60 * 60 * 24, // 1 day
      })),
    );
  },
});

// ~ =============================================>
// ~ ======= Delete restaurant Document
// ~ =============================================>
export const deleteDocument = authenticatedMutation({
  args: { document: v.id("restaurant_documents") },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.document);
    if (!doc) throw new Error("Document not found");

    // ~ ======= Delete from r2 ======= ~
    await r2.deleteObject(ctx, doc.key);

    // ~ ======= Delete from db ======= ~
    await ctx.db.delete(args.document);

    return { success: true };
  },
});
