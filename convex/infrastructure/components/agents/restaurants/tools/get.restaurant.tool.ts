import { z } from "zod";
import { api } from "@/_generated/api";
import { createTool } from "@convex-dev/agent";
import { RestaurantAgentCtx } from "../agent";
import { AgentRestaurantReturn } from "@/features/restaurants/interfaces/restaurants.dto";

export const getRestaurant = createTool({
  description: "Get the restaurant details.",
  args: z.object({}),
  handler: async (
    ctx: RestaurantAgentCtx,
  ): Promise<AgentRestaurantReturn | "NotFound"> => {
    const restaurant = await ctx.runQuery(
      api.features.restaurants.agent_access.getRestaurant,
      { restaurant: ctx.restaurantId },
    );

    if (!restaurant) return "NotFound";

    return restaurant;
  },
});
