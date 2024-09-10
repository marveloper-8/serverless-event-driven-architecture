import { EventBridge } from "@aws-sdk/client-eventbridge";
import dotenv from "dotenv";

dotenv.config();

export class EventBridgeService {
  private eventBridge: EventBridge;
  private eventBusName: string;

  constructor() {
    this.eventBridge = new EventBridge({ 
      region: process.env.AWS_REGION,
      endpoint: process.env.AWS_ENDPOINT || undefined,
    });
    this.eventBusName = process.env.EVENT_BUS_NAME || "default";
  }

  async putEvent(detailType: string, detail: Record<string, unknown>): Promise<void> {
    const params = {
      Entries: [
        {
          DetailType: detailType,
          Detail: JSON.stringify(detail),
          EventBusName: this.eventBusName,
          Source: "com.mycompany.myapp",
        },
      ],
    };

    try {
      const result = await this.eventBridge.putEvents(params);
      console.log("Event published successfully", result);
    } catch (err) {
      console.error("Error publishing event", err);
      throw err;
    }
  }
}