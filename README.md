# Serverless Event-Driven Architecture

This project demonstrates a serverless event-driven architecture using AWS Lambda, EventBridge, and SQS, with local development support via LocalStack.

## Features

- AWS Lambda function for event processing
- Event routing with AWS EventBridge
- Asynchronous processing using AWS SQS
- Local development environment with LocalStack
- Input validation middleware
- Custom logging solution
- Comprehensive unit tests

## Prerequisites

- Node.js (v14 or later)
- Docker and Docker Compose
- AWS CLI

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/serverless-event-driven-architecture.git
   cd serverless-event-driven-architecture
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the local development environment:
   ```
   npm run start:local
   ```

4. Build and deploy the Lambda function locally:
   ```
   npm run deploy:local
   ```

## Running Tests

To run the unit tests:

```
npm test
```

## Project Structure

- `src/lambdas`: Contains the Lambda function
- `src/services`: Contains the EventBridge and SQS services
- `src/middleware`: Contains the input validation middleware
- `src/utils`: Contains utility functions like the custom logger
- `test`: Contains unit tests for all components

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.