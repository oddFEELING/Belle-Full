import { v } from "convex/values";
import { defineTable } from "convex/server";
import { BrandRole } from "../types/enums";

export const users_x_brands = defineTable({
  user: v.id("users"),
  brand: v.id("brands"),
  role: BrandRole,
})
  .index("by_user", ["user"])
  .index("by_brand", ["brand"]);
