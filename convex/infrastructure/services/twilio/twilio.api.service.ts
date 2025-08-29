"use node";

import Twilio from "twilio";
import type { TwilioDTO } from "./interfaces/twilio.dto";

export class TwilioAPiService {
  private client: Twilio.Twilio;

  constructor() {
    this.client = Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async sendMessage(data: TwilioDTO.SendMessageRequest) {
    return this.client.messages.create({
      from: "whatsapp:+14155238886",
      ...data,
    });
  }
}
