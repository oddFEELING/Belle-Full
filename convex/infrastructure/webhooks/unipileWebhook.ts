import { api, internal } from "../../_generated/api";
import { httpAction } from "../../_generated/server";

export const unipileMessagingWebhooks = httpAction(async (ctx, request) => {
  const body = await request.json();

  console.log({
    event: "NEW_MESSAGE",
    data: {
      message: body.message,
      isGroup: Boolean(body.is_group),
      from: body.sender.attendee_provider_id,
      chatId: body.chat_id,
      agentId: body.account_id,
      userName: body.sender.attendee_name,
    },
  });

  // ~ ======= Check if message is from a group ======= ~
  if (body.is_group) {
    console.log({ event: "EARLY_RETURN", reason: "Group messages" });
    return new Response(null, { status: 200 });
  }

  // ~ ======= Check if message is from an agent ======= ~
  const isAgent = await ctx.runQuery(
    internal.features.agents.agent_access.getAgentByAgentId,
    { agentId: body.sender.attendee_provider_id }
  );
  if (isAgent) {
    console.log({ event: "EARLY_RETURN", reason: "Agent response" });
    return new Response(null, { status: 200 });
  }

  // ~ ======= Get targeted agent ======= ~
  const agent = await ctx.runQuery(
    internal.features.agents.agent_access.getAgentByUnipileId,
    { unipileId: body.account_id }
  );
  if (!agent) {
    console.log({ event: "EARLY_RETURN", reason: "Agent not found" });
    return new Response(null, { status: 200 });
  }

  // ~ ======= Get or create thread ======= ~
  let threadId: string;
  const thread = await ctx.runQuery(
    api.infrastructure.components.agents.restaurants.agent
      .getRestaurantAgentThread,
    { userId: body.sender.attendee_provider_id, agentId: agent._id }
  );
  if (thread) threadId = thread._id;
  else {
    threadId = await ctx.runAction(
      api.infrastructure.components.agents.restaurants.agent
        .createRestaurantAgentThread,
      {
        senderId: body.sender.attendee_provider_id,
        senderName: body.sender.attendee_name,
        agentId: agent._id,
      }
    );
  }

  if (
    body.sender.attendee_name !== "447407747298@s.whatsapp.net" &&
    body.sender.attendee_name.toLowerCase().includes("oddfeeling")
  ) {
    const response = await ctx.runAction(
      api.infrastructure.components.agents.restaurants.agent.chat,
      {
        prompt: `user: ${body.message}`,
        threadId,
        agentName: agent.name,
        personna: agent.persona || "",
        traits: agent.traits || [],
        restaurantId: agent.restaurant,
        goals: agent.goals || "",
        chatId: body.chat_id,
        agentId: agent._id,
      }
    );
    console.log(response);

    await ctx.runAction(
      api.infrastructure.services.unipile.functions.sendMessageToUser,
      {
        response,
        chat_id: body.chat_id,
      }
    );
  } else {
    console.log({ event: "EARLY_RETURN", reason: "Not allowed" });
    return new Response(null, { status: 200 });
  }
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
      internal.features.agents.agent_access.updateAgentByUnipileId,
      { unipileId: agentId, updateData: { connection_status: "CONNECTED" } }
    );
  }

  // ~ ======= Disconnected action ======= ~
  if (action === "DELETED") {
    await ctx.runMutation(
      internal.features.agents.agent_access.updateAgentByUnipileId,
      { unipileId: agentId, updateData: { connection_status: "DISCONNECTED" } }
    );
  }

  // ~ ======= Sync success actions ======= ~
  if (action === "SYNC_SUCCESS") {
    await ctx.runMutation(
      internal.features.agents.agent_access.updateAgentByUnipileId,
      {
        unipileId: agentId,
        updateData: {
          lastSync: { status: "SUCCESS", timestamp: Date.now() },
        },
      }
    );
  }

  return new Response(null, { status: 200 });
});
