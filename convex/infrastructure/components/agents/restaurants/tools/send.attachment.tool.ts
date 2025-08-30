import { z } from "zod";
import { api } from "@/_generated/api";
import { createTool } from "@convex-dev/agent";
import { RestaurantAgentCtx } from "../agent";

export const sendAttachment = createTool({
  description: "Send an attachment to the user",
  args: z.object({
    fileKey: z.string().describe("File key of the attachment in R2"),
    fileName: z
      .string()
      .describe("File name of the attachment witrh extension"),
    caption: z.string().describe("Caption for the attachment"),
  }),
  handler: async (ctx: RestaurantAgentCtx, args) => {
    await ctx.runAction(
      api.infrastructure.services.unipile.functions.sendAttachment,
      {
        fileKey: args.fileKey,
        caption: args.caption,
        chat_id: ctx.chatId,
        filename: args.fileName,
      },
    );

    return "Message sent";
  },
});
