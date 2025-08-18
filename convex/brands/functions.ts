import { query, mutation } from "../_generated/server";
import { authenticatedMutation } from "../_custom/mutation";
import { createBrandDto } from "./brands.dto";
import { Id } from "../_generated/dataModel";

export const createBrand = authenticatedMutation({
  args: createBrandDto,
  handler: async (ctx, args): Promise<Id<"brands">> => {
    const brand = await ctx.db.insert("brands", {
      ...args,
      owner: ctx.user.id,
    });
    return brand;
  },
});
