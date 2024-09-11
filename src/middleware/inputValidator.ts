import Joi from "joi";
import { SQSRecord } from "aws-lambda";
import logger from "../utils/logger";

export interface ValidatedSQSRecord extends SQSRecord {
  validatedBody: {
    id: string;
    data: string;
    timestamp: Date;
  };
}

const messageSchema = Joi.object({
  id: Joi.string().required(),
  data: Joi.string().required(),
  timestamp: Joi.date().iso().required(),
});

export function validateInput(record: SQSRecord): ValidatedSQSRecord {
  const { error, value } = messageSchema.validate(JSON.parse(record.body), { stripUnknown: true });
  if (error) {
    logger.error(`Invalid message: ${error.message}`);
    throw new Error(`Invalid message: ${error.message}`);
  }
  return {
    ...record,
    validatedBody: value,
  };
}