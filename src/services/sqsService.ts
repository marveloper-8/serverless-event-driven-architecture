import { SQS } from "@aws-sdk/client-sqs";
import dotenv from "dotenv";

dotenv.config();

export class SqsService {
  private sqs: SQS;
  private queueUrl: string;

  constructor() {
    this.sqs = new SQS({
      region: process.env.AWS_REGION,
      endpoint: process.env.AWS_ENDPOINT || undefined,
    });
    this.queueUrl = process.env.SQS_QUEUE_URL || "";
  }

  async deleteMessage(receiptHandle: string): Promise<void> {
    const params = {
      QueueUrl: this.queueUrl,
      ReceiptHandle: receiptHandle,
    };

    try {
      const result = await this.sqs.deleteMessage(params);
      console.log("Message deleted successfully", result);
    } catch (err) {
      console.error("Error deleting message", err);
      throw err;
    }
  }

  async sendMessage(messageBody: string): Promise<void> {
    const params = {
      MessageBody: messageBody,
      QueueUrl: this.queueUrl,
    };

    try {
      const result = await this.sqs.sendMessage(params);
      console.log("Message sent successfully", result.MessageId);
    } catch (err) {
      console.error("Error sending message", err);
      throw err;
    }
  }
}