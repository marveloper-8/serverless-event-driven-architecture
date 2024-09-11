import { SQSEvent, SQSRecord } from "aws-lambda";
import { SQSService } from "../services/sqsService";
import { EventBridgeService } from "../services/eventbridgeService";
import { validateInput } from "../middleware/inputValidator";
import logger from "../utils/logger";

export const handler = async (event: SQSEvent): Promise<void> => {
  const sqsService = new SQSService();
  const eventBridgeService = new EventBridgeService();
  
  for (const record of event.Records) {
    try {
      const validatedRecord = validateInput(record);
      await processRecord(validatedRecord, sqsService, eventBridgeService);
    } catch (error) {
      logger.error(`Error processing record ${record.messageId}`, error);
    }
  }
};

async function processRecord(
  record: SQSRecord,
  sqsService: SQSService,
  eventBridgeService: EventBridgeService
): Promise<void> {
  const message = JSON.parse(record.body);
  logger.info(`Processing message: ${JSON.stringify(message)}`);
  const processedMessage = { ...message, processed: true };
  await eventBridgeService.putEvent("MessageProcessed", processedMessage);
  await sqsService.deleteMessage(record.receiptHandle);
}