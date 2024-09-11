#! /bin/bash

# Start LocalStack
docker compose up -d

# Wait for LocalStack to be ready
echo "Waiting for LocalStack to be ready..."
while ! docker-compose exec localstack awslocal sqs list-queue 2>/dev/null; do
  sleep 1
done

echo "Creating SQS queue..."
awslocal sqs create-queue --queue-name my-queue

echo "Creating EventBridge rule..."
awslocal events create-queue -queue-name my-queue

echo "Deploying Lambda function..."
zip -j function.zip ./dist/lambdas/eventProcessor.js
awslocal lambda create-function \
  --function-name my-function \
  --runtime nodejs18.x \
  --role arn:aws:iam::000000000000:role/lambda-role \
  --handler index.handler \
  --zip-file fileb://function.zip

echo "LocalStack setup complete!"