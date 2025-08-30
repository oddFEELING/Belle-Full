import { z } from "zod";
import { internal } from "@/_generated/api";
import { createTool } from "@convex-dev/agent";
import { RestaurantAgentCtx } from "../agent";
import type { Doc } from "@/_generated/dataModel";

export const getRestaurantFoodItems = createTool({
  description:
    "Get a list of food items that a user can order from a restaurant using the restaurant _id and not the name",
  args: z.object({}),
  handler: async (ctx: RestaurantAgentCtx): Promise<Doc<"menu_items">[]> => {
    return await ctx.runQuery(
      internal.features.restaurants.agent_access
        .getAgentMenuItemsByRestaurantId,
      { restaurantId: ctx.restaurantId },
    );
  },
});
