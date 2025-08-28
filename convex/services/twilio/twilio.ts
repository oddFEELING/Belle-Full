"use node";

import { v } from "convex/values";
import { action } from "../../_generated/server";

export const sendMessage = action({
  args: { to: v.string(), body: v.string() },
  handler: async (ctx, args): Promise<{ success: boolean }> => {
    // Construct the Twilio API URL using the Account SID from environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const apiUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    
    const res = await fetch(apiUrl, {
      method: "POST",
      body: new URLSearchParams({
        To: args.to, // Use the provided recipient phone number
        Body: args.body, // Use the provided message body
        From: process.env.TWILIO_FROM_NUMBER || "whatsapp:+14155238886", // Use env var or fallback
      }),
      headers: {
        Authorization:
          "Basic " +
          btoa(
            `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`,
          ),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const result = await res.json();
    console.log("Twilio API response:", result);

    // Return more meaningful response based on API result
    return { success: res.ok };
  },
});
