import { handler } from "../src/lambdas/eventProcessor";
import { SQSService } from "../src/services/sqsService";
import { EventBridgeService } from "../src/services/eventbridgeService";

jest.mock("../src/services/sqsService");
jest.mock("../src/services/eventbridgeService");

describe("Event Processor", () => {
  let mockSQSService: jest.Mocked<SQSService>;
  let mockEventBridgeService: jest.Mocked<EventBridgeService>;

  beforeEach(() => {
    mockSQSService = new SQSService() as jest.Mocked<SQSService>;
    mockEventBridgeService = new EventBridgeService() as jest.Mocked<EventBridgeService>;

    (SQSService as jest.Mock).mockImplementation(() => mockSQSService);
    (EventBridgeService as jest.Mock).mockImplementation(() => mockEventBridgeService);
  });

  it("should process SQS messages and send them to EventBridge", async () => {
    const event = {
      Records: [
        {
          body: JSON.stringify({ message: "test" }),
          messageId: "123",
          receiptHandle: "456",
        },
      ],
    };

    const callback = jest.fn();

    await handler(event as any, {} as any, callback);

    expect(mockEventBridgeService.putEvent).toHaveBeenCalledWith("MessageProcessed", { message: "test", processed: true });
    expect(mockSQSService.deleteMessage).toHaveBeenCalledWith("456");
    expect(callback).toHaveBeenCalledWith(null, "Processing complete");
  });

  it("should handle errors in processing", async () => {
    const event = {
      Records: [
        {
          body: JSON.stringify({ message: "test" }),
          messageId: "123",
          receiptHandle: "456",
        },
      ],
    };

    const callback = jest.fn();
    console.error = jest.fn();

    await handler(event as any, {} as any, callback);

    expect(console.error).toHaveBeenCalled();
    expect(mockEventBridgeService.putEvent).not.toHaveBeenCalled();
    expect(mockSQSService.deleteMessage).not.toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(null, "Processing complete");
  });
});