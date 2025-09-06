import { v } from "convex/values";
import { authenticatedMutation } from "../../_custom/mutation";
import { r2 } from "../../infrastructure/components/r2";

const PREFIX = "mnu_itm";

export const { syncMetadata } = r2.clientApi({
  checkUpload: (ctx, bucket) => {
    // Do nothing
  },
  onUpload: (ctx, bucket, key) => {},
});

// ~ =============================================>
// ~ ======= Generate custom key
// ~ =============================================>
export const generateUploadUrl = authenticatedMutation({
  args: {},
  handler: (ctx) => {
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
  handler: (ctx, args): Promise<void> => {
    return ctx.db.patch(args.menuItem, { image: args.key });
  },
});
