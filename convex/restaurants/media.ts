import { authenticatedMutation } from "../_custom/mutation";
import { r2 } from "../components/r2";

const PREFIX = "rst_med";

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
export const generateCustomFileKey = authenticatedMutation({
  args: {},
  handler: async (ctx) => {
    const key = `${PREFIX}_${crypto.randomUUID()}`;
    return r2.generateUploadUrl(key);
  },
});
