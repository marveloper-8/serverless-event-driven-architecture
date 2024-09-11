import { SQSService } from "../src/services/sqsService";
import { SQS } from '@aws-sdk/client-sqs'

jest.mock('@aws-sdk/client-sqs');

describe('SqsService', () => {
  let sqsService: SQSService;
  let mockSQS: jest.Mocked<SQS>;

  beforeEach(() => {
    mockSQS = new SQS() as jest.Mocked<SQS>;
    (SQS as jest.Mock).mockImplementation(() => mockSQS)
    sqsService = new SQSService();
  });

  it('should delete a message from a queue', async () => {
    const receiptHandle = 'testReceiptHandle';
    mockSQS.deleteMessage.mockResolvedValue({});
    await sqsService.deleteMessage(receiptHandle);
    expect(mockSQS.deleteMessage).toHaveBeenCalledWith({
      QueueUrl: 'testQueueUrl',
      ReceiptHandle: receiptHandle
    });
  });

  it('should send message to queue', async () => {
    const messageBody = 'testMessage';
    mockSQS.sendMessage.mockResolvedValue({ MessageId: '123' });
    await sqsService.sendMessage(messageBody);
    expect(mockSQS.sendMessage).toHaveBeenCalledWith({
      QueueUrl: 'testQueueUrl',
      MessageBody: messageBody
    });
  });

  it('should handle error when deleting message', async () => {
    const receiptHandle = 'testReceiptHandle';
    mockSQS.deleteMessage.mockRejectedValue(new Error('Failed to delete message'));
    await expect(sqsService.deleteMessage(receiptHandle)).rejects.toThrow('Failed to delete message');
  });

  it('should handle error when sending message', async () => {
    const messageBody = 'testMessage';
    mockSQS.sendMessage.mockRejectedValue(new Error('Failed to send message'));
    await expect(sqsService.sendMessage(messageBody)).rejects.toThrow('Failed to send message');
  });
});