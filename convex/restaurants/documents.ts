import { v } from "convex/values";
import { r2 } from "../components/r2";
import { authenticatedMutation } from "../_custom/mutation";
import { DocumentType, RestaurantLegalDocuments } from "../enums";
import { Id } from "../_generated/dataModel";
import { authenticatedQuery } from "../_custom/query";
import {
  getManyFrom,
  getOneFromOrThrow,
} from "convex-helpers/server/relationships";

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
export const listDocuments = authenticatedQuery({
  args: {
    restaurant: v.object({
      id: v.optional(v.id("restaurants")),
      slug: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { restaurant }) => {
    const { id, slug } = restaurant;
    let restaurantId = id;
    if (!id && slug) {
      restaurantId = (
        await getOneFromOrThrow(ctx.db, "restaurants", "by_slug", slug)
      )._id;
    }
    if (!restaurantId) return [];

    // ~ ======= Get documents ======= ~
    const documents = await getManyFrom(
      ctx.db,
      "restaurant_documents",
      "by_restaurant",
      restaurantId,
    );

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
