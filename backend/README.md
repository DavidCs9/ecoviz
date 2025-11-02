# EcoViz Carbon Footprint Calculator

A serverless application for calculating and analyzing carbon footprints with AI-powered insights and email reporting capabilities.

## Overview

EcoViz is a comprehensive carbon footprint calculator that helps users understand their environmental impact across four key areas:

- **Housing**: Energy consumption (electricity, natural gas, heating oil)
- **Transportation**: Car usage, public transit, and flights
- **Food**: Diet type and food waste levels
- **Consumption**: Shopping habits and recycling practices

The application provides:

- Detailed carbon footprint calculations
- AI-powered analysis and personalized recommendations
- Email reports with visual breakdowns
- Comparison with global and US averages

## Architecture

This project contains source code and supporting files for a serverless application deployed with the SAM CLI. It includes:

- **calculate/** - Lambda function for carbon footprint calculations and AI analysis
- **mailer/** - Lambda function for sending email reports
- **events/** - Test events for local development and testing
- **template.yaml** - SAM template defining AWS resources

## AWS Resources

The application uses several AWS resources defined in `template.yaml`:

- **API Gateway** - REST API endpoints for calculations and email sending
- **Lambda Functions** - Serverless compute for calculations and email processing
- **Application Insights** - Monitoring and observability
- **Resource Groups** - Resource organization and management

## API Endpoints

### POST /calculate

Calculates carbon footprint and provides AI analysis.

**Request Body:**

```json
{
  "userId": "string",
  "data": {
    "housing": {
      "type": "apartment|house|condo",
      "size": 2,
      "energy": {
        "electricity": 5000,
        "naturalGas": 200,
        "heatingOil": 0
      }
    },
    "transportation": {
      "car": {
        "milesDriven": 12000,
        "fuelEfficiency": 25
      },
      "publicTransit": {
        "busMiles": 1000,
        "trainMiles": 500
      },
      "flights": {
        "shortHaul": 2,
        "longHaul": 1
      }
    },
    "food": {
      "dietType": "meat-heavy|average|vegetarian|vegan",
      "wasteLevel": "low|average|high"
    },
    "consumption": {
      "shoppingHabits": "minimal|average|frequent",
      "recyclingHabits": "none|some|most|all"
    }
  }
}
```

**Response:**

```json
{
  "userId": "string",
  "calculationId": "string",
  "carbonFootprint": 8500.5,
  "aiAnalysis": "Personalized recommendations...",
  "averages": {
    "global": 4000,
    "us": 16000
  }
}
```

### POST /send-mail

Sends carbon footprint results via email.

**Request Body:**

```json
{
  "email": "user@example.com",
  "results": {
    "carbonFootprint": 8500.5,
    "housing": 2500.2,
    "transportation": 3200.8,
    "food": 1800.3,
    "consumption": 999.2
  }
}
```

## Environment Variables

Before deployment, configure these environment variables:

- **OPENAI_API_KEY** - OpenAI API key for AI analysis (in calculate function)
- **EMAIL_PASS** - Email password for SMTP authentication (in mailer function)

## Prerequisites

To use the SAM CLI, you need the following tools:

- **SAM CLI** - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- **Node.js** - [Install Node.js 22](https://nodejs.org/en/), including the NPM package management tool
- **Docker** - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)

## Deployment

### First-time deployment

```bash
sam build
sam deploy --guided
```

The guided deployment will prompt for:

- **Stack Name**: Unique name for your CloudFormation stack
- **AWS Region**: Target AWS region
- **Confirm changes before deploy**: Review changes before execution
- **Allow SAM CLI IAM role creation**: Required for Lambda function permissions
- **Save arguments to samconfig.toml**: Save configuration for future deployments

### Subsequent deployments

```bash
sam build
sam deploy
```

## Local Development

### Build the application

```bash
sam build
```

### Test functions locally

```bash
# Test calculate function
sam local invoke CalculateFunction --event events/calculate.json

# Test mailer function
sam local invoke MailerFunction --event events/mailer.json
```

### Run API locally

```bash
sam local start-api
```

Then test the endpoints:

```bash
# Test calculate endpoint
curl -X POST http://localhost:3000/calculate \
  -H "Content-Type: application/json" \
  -d @events/calculate.json

# Test mailer endpoint
curl -X POST http://localhost:3000/send-mail \
  -H "Content-Type: application/json" \
  -d @events/mailer.json
```

## Monitoring and Logs

### View Lambda function logs

```bash
# Calculate function logs
sam logs -n CalculateFunction --stack-name ecoviz-serverless --tail

# Mailer function logs
sam logs -n MailerFunction --stack-name ecoviz-serverless --tail
```

### Application Insights

The application includes AWS Application Insights for monitoring and observability, automatically configured for the deployed stack.

## Cleanup

To delete the application and all associated resources:

```bash
sam delete --stack-name ecoviz-serverless
```

## Development Tools

If you prefer to use an integrated development environment (IDE) to build and test your application, you can use the AWS Toolkit:

- [VS Code](https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/welcome.html)
- [IntelliJ](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
- [Visual Studio](https://docs.aws.amazon.com/toolkit-for-visual-studio/latest/user-guide/welcome.html)

## Resources

- [AWS SAM Developer Guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html)
- [AWS Serverless Application Repository](https://aws.amazon.com/serverless/serverlessrepo/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
