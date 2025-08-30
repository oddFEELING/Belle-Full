import { v } from "convex/values";
import { r2 } from "../../infrastructure/components/r2";
import type { Id } from "../../_generated/dataModel";
import { authenticatedMutation } from "../../_custom/mutation";
import { query } from "../../_generated/server";

const PREFIX = "mnu_itm";

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
export const createUploadedImage = authenticatedMutation({
  args: {
    menuItem: v.id("menu_items"),
    key: v.string(),
  },
  handler: async (ctx, args): Promise<void> => {
    return ctx.db.patch(args.menuItem, { image: args.key });
  },
});
