import { z } from "zod";
import { api } from "@/_generated/api";
import { createTool } from "@convex-dev/agent";
import { RestaurantAgentCtx } from "../agent";

export const saySomething = createTool({
  description:
    "Say something to the user to give them insight into what you are doing",
  args: z.object({ message: z.string() }),
  handler: async (ctx: RestaurantAgentCtx, args) => {
    await ctx.runAction(
      api.infrastructure.services.unipile.functions.sendMessageToUser,
      {
        response: args.message,
        chat_id: ctx.chatId,
      },
    );

    return "Message sent";
  },
});
