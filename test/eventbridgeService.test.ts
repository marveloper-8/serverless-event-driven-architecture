import { EventBridgeService } from "../src/services/eventbridgeService";
import { EventBridge } from "@aws-sdk/client-eventbridge";

jest.mock("@aws-sdk/client-eventbridge");

describe("EventBridgeService", () => {
  let eventBridgeService: EventBridgeService;
  let mockEventBridge: jest.Mocked<EventBridge>;

  beforeEach(() => {
    eventBridgeService = new EventBridgeService();
    mockEventBridge = new EventBridge({}) as jest.Mocked<EventBridge>;
    (EventBridge as jest.Mock).mockImplementation(() => mockEventBridge);
  });

  it("should put an event to EventBridge", async () => {
    const detailType = "TestEvent";
    const detail = { data: "test" };

    mockEventBridge.putEvents.mockResolvedValue({
      FailedEntryCount: 0
    });

    await eventBridgeService.putEvent(detailType, detail);

    expect(mockEventBridge.putEvents).toHaveBeenCalledWith({
      Entries: [
        expect.objectContaining({
          DetailType: detailType,
          Detail: JSON.stringify(detail),
        }),
      ],
    });

    it("should throw an error if the event fails to be put", async () => {
      const detailType = "TestEvent";
      const detail = { data: "test" };

      mockEventBridge.putEvents.mockRejectedValue(new Error("Test error"));

      await expect(eventBridgeService.putEvent(detailType, detail)).rejects.toThrow("Failed to put event");
    });
  });
});
