# Deployment Guide

## Environment Configuration

This project supports two environments: **dev** and **prod**.

### Local Development (Dev)

For local development, use the default `samconfig.toml`:

```bash
# Build the application
sam build

# Deploy to dev environment
sam deploy

# Or with explicit config file
sam deploy --config-file samconfig.toml
```

This will:

- Deploy to stack: `ecoviz-serverless-dev`
- Use environment: `dev`
- Enable CORS for localhost and dev domains

### Production Deployment

For production deployment, use the `samconfig.prod.toml`:

```bash
# Build the application
sam build

# Deploy to prod environment
sam deploy --config-file samconfig.prod.toml
```

This will:

- Deploy to stack: `ecoviz-serverless-prod`
- Use environment: `prod`
- Enable CORS only for production domain

### CI/CD Deployment

For CI/CD pipelines, you can deploy both environments:

#### Deploy Dev

```bash
sam build
sam deploy --config-file samconfig.toml --no-confirm-changeset
```

#### Deploy Prod

```bash
sam build
sam deploy --config-file samconfig.prod.toml --no-confirm-changeset
```

### Environment-Specific Configuration

The template now includes:

- **Environment Parameter**: Controls which environment is deployed
- **Conditional CORS Origins**:
  - `prod`: Only production domain
  - `dev`: Localhost and dev domains
- **Dynamic Stage Names**: API Gateway stage matches environment
- **Separate Stacks**: Each environment has its own CloudFormation stack

### Parameters

When deploying, you can override parameters:

```bash
sam deploy --parameter-overrides \
  Environment=prod \
  OpenAIAPIKey=your-api-key
```

### API Endpoints

After deployment, the API Gateway endpoint will be:

- **Dev**: `https://{api-id}.execute-api.us-west-1.amazonaws.com/dev`
- **Prod**: `https://{api-id}.execute-api.us-west-1.amazonaws.com/prod`

Check the CloudFormation outputs for the exact URL:

```bash
aws cloudformation describe-stacks \
  --stack-name ecoviz-serverless-dev \
  --query 'Stacks[0].Outputs'
```
