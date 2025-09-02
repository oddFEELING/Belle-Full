import { z } from "zod";
import { internal } from "@/_generated/api";
import { createTool } from "@convex-dev/agent";
import { RestaurantAgentCtx } from "../agent";

export const askRestaurantQuestion = createTool({
  description:
    "Escalate a question to the restaurant if you are not sure about the answer or you need more information",
  args: z.object({
    question: z
      .string()
      .describe("Well detailed question to be sent to the restaurant"),
  }),
  handler: async (ctx: RestaurantAgentCtx, args): Promise<string> => {
    ctx.runMutation(internal.features.agents.agent_access.agentCreateEnquiry, {
      threadId: ctx.threadId,
      agentId: ctx.agentId,
      restaurant: ctx.restaurantId,
      enquiry: args.question,
      chatId: ctx.chatId,
    });

    return "Enquiry sent";
  },
});
