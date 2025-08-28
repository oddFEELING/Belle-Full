import { api, internal } from "../_generated/api";
import { httpAction } from "../_generated/server";

export const unipileMessagingWebhooks = httpAction(async (ctx, request) => {
  const body = await request.json();

  let threadId: string;

  console.log(body);

  if (body.is_group) {
    console.log("group message, returning early.");
    return new Response(null, { status: 200 });
  }

  const threads = await ctx.runQuery(
    api.components.agents.conversationAgent.getThread,
    { chatId: body.provider_chat_id },
  );

  if (threads.page.length > 0) {
    threadId = threads.page[0]._id;
  } else {
    threadId = await ctx.runAction(
      api.components.agents.conversationAgent.createThread,
      { userId: body.provider_chat_id },
    );
  }

  console.log(
    "recieved message\n",
    body.message,
    "is oddfeeling\n",
    body.sender.attendee_name.toLowerCase().includes("oddfeeling"),
    "from\n",
    body.chat_id,
    "by\n",
    body.sender.attendee_name,
  );

  // if (
  //   body.sender.attendee_name !== "447407747298@s.whatsapp.net" &&
  //   body.sender.attendee_name.toLowerCase().includes("oddfeeling")
  // ) {
  //   const response = await ctx.runAction(
  //     api.components.agents.conversationAgent.chat,
  //     { prompt: body.message, threadId },
  //   );
  //   console.log(response);

  //   await ctx.runAction(api.unipile.functions.sendMessageToUser, {
  //     response,
  //     chat_id: "Y55eIrTLVFacEED9WJXISA",
  //   });
  // }
  return new Response(null, { status: 200 });
});

// ~ =============================================>
// ~ ======= Unipile Accounts Webhooks
// ~ =============================================>
export const unipileAccountsWebhooks = httpAction(async (ctx, request) => {
  const body = await request.json();

  console.log(body.AccountStatus);

  const action: "CREATION_SUCCESS" | "SYNC_SUCCESS" | "DELETED" =
    body.AccountStatus.message;
  const agentId: string = body.AccountStatus.account_id;
  const accountType: "WHATSAPP" | "INSTAGRAM" = body.AccountStatus.account_type;

  // ~ ======= Connected action ======= ~
  if (action === "CREATION_SUCCESS") {
    await ctx.runMutation(
      internal.restaurants.agents.agent_access.updateAgentByUnipileId,
      { unipileId: agentId, updateData: { connection_status: "CONNECTED" } },
    );
  }

  // ~ ======= Disconnected action ======= ~
  if (action === "DELETED") {
    await ctx.runMutation(
      internal.restaurants.agents.agent_access.updateAgentByUnipileId,
      { unipileId: agentId, updateData: { connection_status: "DISCONNECTED" } },
    );
  }

  // ~ ======= Sync success actions ======= ~
  if (action === "SYNC_SUCCESS") {
    await ctx.runMutation(
      internal.restaurants.agents.agent_access.updateAgentByUnipileId,
      {
        unipileId: agentId,
        updateData: {
          lastSync: { status: "SUCCESS", timestamp: Date.now() },
        },
      },
    );
  }

  return new Response(null, { status: 200 });
});
