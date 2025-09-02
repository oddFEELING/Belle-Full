import { type Infer, v } from "convex/values";

export const createBrandDto = v.object({
  name: v.string(),
  slug: v.string(),
  description: v.string(),
  website: v.string(),
  phone: v.string(),
});

export type CreateBrandDto = Infer<typeof createBrandDto>;
