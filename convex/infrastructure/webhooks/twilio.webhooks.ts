import { api } from "../../_generated/api";
import { httpAction } from "../../_generated/server";

export default httpAction(async (ctx, request) => {
  const body = await request.text();

  const extracted = new URLSearchParams(body);
  const extractedObj = Object.fromEntries(extracted.entries());

  console.log(extractedObj);
  await ctx.runAction(api.infrastructure.services.twilio.twilio.sendMessage, {
    to: "whatsapp:+447407747298",
    body: "Your message has been received and processed.",
  });

  return new Response(null, { status: 200 });
});
