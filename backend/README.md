# EcoViz Backend - Carbon Footprint Calculator API

> Serverless backend API for calculating carbon footprints with AI-powered insights using AWS Lambda and OpenAI.

[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)
[![AWS SAM](https://img.shields.io/badge/AWS-SAM-orange)](https://aws.amazon.com/serverless/sam/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Configuration](#configuration)
- [Monitoring](#monitoring)

## 🌍 Overview

The EcoViz backend is a serverless API built on AWS Lambda that calculates carbon footprints across four key lifestyle categories and provides AI-powered recommendations for reducing environmental impact. The application leverages modern TypeScript, AWS SAM, and LangChain for scalable, cost-effective carbon footprint analysis.

### Key Capabilities

- **Comprehensive Carbon Calculations**: Analyze emissions from housing, transportation, food, and consumption
- **AI-Powered Insights**: Generate personalized recommendations using OpenAI GPT-4 via LangChain
- **Scalable Architecture**: Serverless design that scales automatically with demand
- **Type-Safe Validation**: Zod-based schema validation for all inputs and outputs
- **Production-Ready**: Full observability with CloudWatch, X-Ray tracing, and structured logging

## ✨ Features

### Core Functionality

- 🏠 **Housing Emissions**: Calculate emissions from electricity, natural gas, and heating oil
- 🚗 **Transportation Analysis**: Track car usage, public transit, and flight emissions
- 🍽️ **Food Impact Assessment**: Evaluate diet type and food waste levels
- 🛍️ **Consumption Tracking**: Analyze shopping and recycling habits
- 🤖 **AI Recommendations**: LangChain-powered personalized sustainability suggestions
- 📊 **Comparative Analysis**: Compare results against global and US averages
- ✅ **Input Validation**: Comprehensive Zod schema validation

### Technical Features

- **Serverless**: Pay-per-use Lambda functions with automatic scaling
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Modular Design**: Service-oriented architecture with clear separation of concerns
- **API Gateway**: RESTful API with CORS support and OPTIONS handling
- **Observability**: CloudWatch Logs, X-Ray tracing, and JSON-formatted logging
- **Environment Management**: Separate dev and prod configurations

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────┐
│   API Gateway   │
│   (REST API)    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│      Lambda Function (Node.js)      │
│  ┌──────────────────────────────┐  │
│  │    Calculator Orchestrator    │  │
│  └────────────┬─────────────────┘  │
│               │                     │
│    ┌──────────┴──────────┐        │
│    │                     │        │
│    ▼                     ▼        │
│  ┌─────────────┐  ┌──────────────┐│
│  │   Input     │  │   Emission   ││
│  │ Transformer │  │  Calculator  ││
│  └─────────────┘  └──────────────┘│
│                     │               │
│                     ▼               │
│              ┌──────────────┐      │
│              │ AI Analysis  │      │
│              │   Service    │      │
│              └──────┬───────┘      │
└─────────────────────┼──────────────┘
                      │
                      ▼
              ┌──────────────┐
              │   OpenAI     │
              │   GPT-4      │
              └──────────────┘
```

### Service Architecture

The backend follows a service-oriented architecture with clear responsibilities:

1. **InputTransformer**: Converts raw user input into structured calculation data
2. **EmissionCalculator**: Performs carbon footprint calculations using emission factors
3. **AIAnalysisService**: Generates personalized recommendations using LangChain + OpenAI
4. **Calculator**: Orchestrates the entire workflow and assembles results

## 📁 Project Structure

```
backend/
├── calculate/                    # Lambda function directory
│   ├── app.ts                   # Lambda handler entry point
│   ├── Calculator.ts            # Main orchestrator class
│   ├── types.ts                 # TypeScript type definitions
│   │
│   ├── config/                  # Configuration and constants
│   │   ├── index.ts            # Config exports
│   │   ├── EmissionFactors.ts  # CO2 emission factors
│   │   ├── EnergyRates.ts      # Energy conversion rates
│   │   ├── InputMappings.ts    # Input value mappings
│   │   └── VehicleData.ts      # Vehicle emission data
│   │
│   ├── schema/                  # Zod validation schemas
│   │   └── schema.ts           # Input/output schemas
│   │
│   └── services/                # Business logic services
│       ├── index.ts            # Service exports
│       ├── InputTransformer.ts # Input transformation
│       ├── EmissionCalculator.ts # Carbon calculations
│       └── AIAnalysisService.ts # AI-powered analysis
│
├── events/                      # Test events
│   └── calculate.json          # Sample calculation request
│
├── template.yaml                # SAM infrastructure template
├── samconfig.toml              # SAM config (dev)
├── samconfig.prod.toml         # SAM config (prod)
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
├── DEVELOPMENT.md              # Development guide
├── DEPLOYMENT.md               # Deployment guide
└── README.md                   # This file
```

## 🛠️ Technology Stack

### Core Technologies

- **Runtime**: Node.js 22.x
- **Language**: TypeScript 5.8.3
- **Build Tool**: esbuild (via SAM)
- **Infrastructure**: AWS SAM (Serverless Application Model)

### Key Dependencies

- **LangChain** (`@langchain/core`, `@langchain/openai`): AI framework for OpenAI integration
- **Zod**: Schema validation and type inference
- **AWS Lambda**: Serverless compute platform

### AWS Services

- **AWS Lambda**: Function compute
- **API Gateway**: RESTful API endpoints
- **CloudWatch**: Logging and monitoring
- **X-Ray**: Distributed tracing
- **IAM**: Security and access control

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- AWS CLI configured with appropriate credentials
- AWS SAM CLI installed ([Installation Guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html))
- OpenAI API Key

### Installation

1. **Navigate to backend directory**:

   ```bash
   cd backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   Create a `.env` file:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Build the project**:

   ```bash
   npm run build
   ```

## 📚 API Documentation

### Base URL

- **Local**: `http://localhost:3001`
- **Dev**: `https://your-api-id.execute-api.region.amazonaws.com/dev`
- **Prod**: `https://your-api-id.execute-api.region.amazonaws.com/prod`

### Endpoints

#### POST /calculate

Calculates carbon footprint and provides AI-powered analysis.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**

```json
{
  "userId": "user-123",
  "data": {
    "housing": {
      "type": "apartment",
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
      "dietType": "average",
      "wasteLevel": "average"
    },
    "consumption": {
      "shoppingHabits": "average",
      "recyclingHabits": "some"
    }
  }
}
```

**Response (200 OK):**

```json
{
  "userId": "user-123",
  "calculationId": "user-123-1699000000000",
  "carbonFootprint": 8547.32,
  "emissionsByCategory": {
    "housing": 3200.5,
    "transportation": 3500.2,
    "food": 1200.0,
    "consumption": 646.62
  },
  "aiAnalysis": "Based on your carbon footprint of 8,547 kg CO2/year...",
  "averages": {
    "global": 4000,
    "us": 16000
  }
}
```

**Error Responses:**

- **400 Bad Request**: Invalid input data
- **500 Internal Server Error**: Server error during calculation

### Input Validation

All inputs are validated using Zod schemas. Key validation rules:

- **Housing Type**: Must be "apartment", "house", or "condo"
- **Diet Type**: Must be "meat-heavy", "average", "vegetarian", or "vegan"
- **Energy Values**: Must be non-negative numbers
- **Miles Driven**: Must be non-negative numbers

## 💻 Development

### Local Development Setup

1. **Build TypeScript code**:

   ```bash
   npm run build
   ```

2. **Start local API server**:

   ```bash
   npm run local:api
   ```

   This starts API Gateway locally on port 3001. The API will be available at:
   - `http://localhost:3001/calculate`

3. **Test with sample event**:

   ```bash
   npm run local:invoke
   ```

   This invokes the Lambda function with the test event from `events/calculate.json`.

### Development Workflow

1. Make changes to TypeScript files in `calculate/`
2. Run `npm run build` to compile
3. Test locally using `npm run local:api` or `npm run local:invoke`
4. Use Postman collection in `postman/` for API testing

### Code Quality

Run linting and formatting:

```bash
# Check code quality
npm run check

# Auto-fix issues
npm run check:fix

# Format code
npm run format:fix

# Lint code
npm run lint:fix
```

### Adding New Services

To add a new service to the calculator:

1. Create new service file in `calculate/services/`
2. Export from `calculate/services/index.ts`
3. Import and use in `Calculator.ts`
4. Update types in `calculate/types.ts` if needed
5. Add tests in `events/` directory

### Emission Factors

Emission factors are stored in `calculate/config/EmissionFactors.ts`. To update:

1. Research authoritative sources (EPA, IPCC, etc.)
2. Update constants in `EmissionFactors.ts`
3. Document sources in code comments
4. Test calculations with new factors

## 🧪 Testing

### Local Testing

**Test with SAM Local**:

```bash
# Invoke function with test event
sam local invoke CalculateFunction --event events/calculate.json

# Start API locally
sam local start-api --port 3001
```

**Test with curl**:

```bash
curl -X POST http://localhost:3001/calculate \
  -H "Content-Type: application/json" \
  -d @events/calculate.json
```

### Postman Collection

Import the Postman collection from `postman/Ecoviz Backend.postman_collection.json` for comprehensive API testing.

### Unit Testing

Unit tests will be added using Vitest (see TODO.md):

```bash
# Run tests (coming soon)
npm test
```

## 🚢 Deployment

### Environment Configuration

The backend supports two environments:

- **dev**: Development environment with relaxed CORS and debug logging
- **prod**: Production environment with strict CORS and optimized settings

### Deploy to Development

```bash
# Build and deploy
sam build
sam deploy

# Or with explicit config
sam deploy --config-file samconfig.toml
```

This deploys to stack `ecoviz-serverless-dev`.

### Deploy to Production

```bash
# Build and deploy
sam build
sam deploy --config-file samconfig.prod.toml
```

This deploys to stack `ecoviz-serverless-prod`.

### Deployment with Environment Variables

```bash
# Deploy with OpenAI API key
npm run deploy
```

This script:
1. Builds TypeScript code
2. Loads environment variables from `.env`
3. Deploys using SAM with parameter overrides

### CI/CD Integration

For automated deployments, use GitHub Actions or similar:

```yaml
# Example GitHub Actions workflow
- name: Deploy to AWS
  run: |
    sam build
    sam deploy --config-file samconfig.${{ env.ENVIRONMENT }}.toml \
      --parameter-overrides ParameterKey=OpenAIAPIKey,ParameterValue=${{ secrets.OPENAI_API_KEY }}
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## ⚙️ Configuration

### SAM Configuration Files

- **samconfig.toml**: Development environment configuration
- **samconfig.prod.toml**: Production environment configuration

Key configuration parameters:

```toml
[default.deploy.parameters]
stack_name = "ecoviz-serverless-dev"
region = "us-east-1"
capabilities = "CAPABILITY_IAM"
parameter_overrides = "Environment=dev"
```

### Environment Variables

Lambda function environment variables:

- **OPENAI_API_KEY**: OpenAI API key for AI analysis (required)
- **Environment**: Deployment environment (dev/prod)

### CORS Configuration

CORS is configured in `template.yaml`:

- **Allowed Methods**: POST, OPTIONS
- **Allowed Headers**: Content-Type, Authorization, X-Requested-With
- **Allowed Origins**: * (configurable per environment)
- **Max Age**: 86400 seconds (24 hours)

## 📊 Monitoring

### CloudWatch Logs

Lambda function logs are sent to CloudWatch with JSON formatting:

```bash
# View logs
sam logs -n CalculateFunction --stack-name ecoviz-serverless-dev --tail

# View logs for specific time
sam logs -n CalculateFunction --stack-name ecoviz-serverless-dev --start-time '10min ago'
```

### X-Ray Tracing

X-Ray tracing is enabled for performance monitoring:

1. Navigate to AWS X-Ray console
2. Select your API Gateway
3. View service map and traces

### CloudWatch Metrics

Monitor key metrics:

- **Invocations**: Number of function invocations
- **Duration**: Average execution time
- **Errors**: Error count and rate
- **Throttles**: Throttling events

### Alarms

Set up CloudWatch alarms for:

- Error rate > 5%
- Duration > 10 seconds
- Throttle rate > 1%

## 🔐 Security

### API Security

- CORS configured per environment
- API Gateway throttling enabled
- Lambda function timeout: 30 seconds
- CloudWatch logging for audit trail

### Secrets Management

- OpenAI API key passed via SAM parameters
- Consider AWS Secrets Manager for production
- Never commit secrets to version control

### IAM Permissions

Lambda execution role has minimal permissions:

- CloudWatch Logs write access
- X-Ray daemon write access

## 📈 Performance

### Optimization Strategies

- **Cold Start**: ~1-2 seconds with esbuild minification
- **Warm Execution**: ~2-4 seconds average
- **Memory**: 128 MB default (adjust based on load)
- **Timeout**: 30 seconds (sufficient for AI calls)

### Best Practices

1. Keep dependencies minimal
2. Use esbuild for bundling
3. Enable X-Ray for performance insights
4. Monitor CloudWatch metrics
5. Set appropriate memory allocation

## 🤝 Contributing

Contributions are welcome! Please:

1. Follow the existing code structure
2. Add JSDoc comments to functions
3. Update schemas when changing data structures
4. Test locally before deploying
5. Update documentation

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [LangChain](https://www.langchain.com/) for AI integration framework
- [AWS SAM](https://aws.amazon.com/serverless/sam/) for serverless infrastructure
- [Zod](https://zod.dev/) for schema validation
- EPA and IPCC for emission factor data

## 📧 Support

For issues and questions:

- Create an issue in the GitHub repository
- Check [DEVELOPMENT.md](DEVELOPMENT.md) for development questions
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment questions

---

**Built with 💚 for a sustainable future**

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
