import { httpRouter } from "convex/server";
import { auth } from "./auth";
import twilioWebhooks from "./webhookActions/twilio.webhooks";
import {
  unipileAccountsWebhooks,
  unipileMessagingWebhooks,
} from "./webhookActions/unipileWebhook";

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
  path: "/webhooks-twilio",
  method: "POST",
  handler: twilioWebhooks,
});

http.route({
  path: "/webhooks-unipile-messaging",
  method: "POST",
  handler: unipileMessagingWebhooks,
});

http.route({
  path: "/webhooks-unipile-accounts",
  method: "POST",
  handler: unipileAccountsWebhooks,
});

export default http;
