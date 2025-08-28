"use node";

import { v } from "convex/values";
import { action, internalAction } from "../_generated/server";
import { UnipileClient } from "unipile-node-sdk";
import { api } from "../_generated/api";

const unipileClient = new UnipileClient(
  `https://${process.env.UNIPILE_DSN}`,
  process.env.UNIPILE_ACCESS_TOKEN as string,
);

// ~ =============================================>
// ~ ======= Get chat messages
// ~ =============================================>
export const getChatMessages = action({
  args: { chat_id: v.string() },
  handler: async (ctx, args): Promise<string> => {
    console.log("Getting chat messages");
    const res = await unipileClient.messaging.getAllMessagesFromChat({
      chat_id: args.chat_id,
    });

    const items = res.items.map((item) => ({
      provider: item.provider_id,
      text: item.text,
      sender: item.sender_id,
      pushname: JSON.parse(item.original),
      created_at: item.timestamp,
    }));

    console.log("messages length: \n", items.length);

    return JSON.stringify(items, null, 2);
  },
});

// ~ =============================================>
// ~ ======= Send message to user
// ~ =============================================>
export const sendMessageToUser = action({
  args: { response: v.string(), chat_id: v.string() },
  handler: async (ctx, args): Promise<string> => {
    console.log("Sending message to user");
    await unipileClient.messaging.sendMessage({
      chat_id: "Y55eIrTLVFacEED9WJXISA",
      text: args.response,
    });

    return "Message sent";
  },
});

// ~ =============================================>
// ~ ======= Create whatsapp agent
// ~ =============================================>
export const createWhatsappAgent = action({
  args: {
    agent: v.id("restaurant_agents"),
    restaurant: v.id("restaurants"),
  },
  handler: async (ctx, args): Promise<{ code: string; account_id: string }> => {
    const { code, account_id } = await unipileClient.account.connectWhatsapp({
      extra_params: args,
    });

    return { code, account_id };
  },
});

// ~ =============================================>
// ~ ======= Disconnect Account
// ~ =============================================>
export const disconnectAccount = action({
  args: { agentId: v.id("restaurant_agents") },
  handler: async (ctx, args) => {
    const toDelete = await ctx.runQuery(
      api.restaurants.agents.functions.getSingleAgent,
      { agent: args.agentId },
    );

    if (!toDelete || !toDelete.unipile_id) {
      throw new Error("Agent not found");
    }

    const { object } = await unipileClient.account.delete(toDelete.unipile_id);

    return object;
  },
});
