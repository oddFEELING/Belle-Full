import { v } from "convex/values";
import { Infer } from "convex/values";

export const createBrandDto = v.object({
  name: v.string(),
  slug: v.string(),
  description: v.string(),
  website: v.string(),
  phone: v.string(),
});

export type CreateBrandDto = Infer<typeof createBrandDto>;
