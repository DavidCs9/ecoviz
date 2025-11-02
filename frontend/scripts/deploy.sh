#!/bin/bash

# Frontend Deployment Script for EcoViz
# Usage: ./scripts/deploy.sh [dev|prod]

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default environment
ENV="${1:-dev}"

# Validate environment
if [[ ! "$ENV" =~ ^(dev|prod)$ ]]; then
    echo -e "${RED}❌ Error: Environment must be 'dev' or 'prod'${NC}"
    echo "Usage: ./scripts/deploy.sh [dev|prod]"
    exit 1
fi

echo -e "${BLUE}🚀 Starting EcoViz Frontend Deployment${NC}"
echo -e "${BLUE}Environment: ${ENV}${NC}"
echo ""

# Check required tools
echo -e "${YELLOW}Checking required tools...${NC}"
command -v node >/dev/null 2>&1 || { echo -e "${RED}❌ Node.js is required but not installed.${NC}" >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo -e "${RED}❌ npm is required but not installed.${NC}" >&2; exit 1; }
command -v aws >/dev/null 2>&1 || { echo -e "${RED}❌ AWS CLI is required but not installed.${NC}" >&2; exit 1; }
command -v sam >/dev/null 2>&1 || { echo -e "${RED}❌ SAM CLI is required but not installed.${NC}" >&2; exit 1; }
echo -e "${GREEN}✅ All required tools are installed${NC}"
echo ""

# Confirm production deployment
if [ "$ENV" = "prod" ]; then
    echo -e "${YELLOW}⚠️  You are about to deploy to PRODUCTION!${NC}"
    read -p "Are you sure you want to continue? (yes/no): " -r
    echo
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        echo -e "${RED}Deployment cancelled${NC}"
        exit 1
    fi
fi

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
FRONTEND_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"
ROOT_DIR="$( cd "$FRONTEND_DIR/.." && pwd )"

# Move to frontend directory
cd "$FRONTEND_DIR"

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
cd "$ROOT_DIR"
npm ci --ignore-scripts
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Run linter
echo -e "${YELLOW}🔍 Running linter...${NC}"
npm run lint
echo -e "${GREEN}✅ Linting passed${NC}"
echo ""

# Build the application
echo -e "${YELLOW}🔨 Building application...${NC}"
npm run build
echo -e "${GREEN}✅ Build completed${NC}"
echo ""

# Deploy infrastructure
echo -e "${YELLOW}☁️  Deploying infrastructure to AWS...${NC}"
if [ "$ENV" = "prod" ]; then
    sam deploy --config-env prod --no-confirm-changeset
else
    sam deploy --no-confirm-changeset
fi
echo -e "${GREEN}✅ Infrastructure deployed${NC}"
echo ""

# Get stack outputs
STACK_NAME="ecoviz-frontend-${ENV}"
AWS_REGION="us-west-1"

echo -e "${YELLOW}📋 Retrieving stack information...${NC}"

BUCKET_NAME=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --query 'Stacks[0].Outputs[?OutputKey==`WebsiteBucketName`].OutputValue' \
    --output text \
    --region "$AWS_REGION")

DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
    --output text \
    --region "$AWS_REGION")

if [ -z "$BUCKET_NAME" ] || [ -z "$DISTRIBUTION_ID" ]; then
    echo -e "${RED}❌ Error: Could not retrieve stack outputs${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Stack information retrieved${NC}"
echo -e "   S3 Bucket: ${BUCKET_NAME}"
echo -e "   CloudFront Distribution: ${DISTRIBUTION_ID}"
echo ""

# Sync files to S3
echo -e "${YELLOW}📤 Uploading files to S3...${NC}"

# Upload static assets with long cache
aws s3 sync dist/ "s3://${BUCKET_NAME}/" \
    --delete \
    --cache-control "public, max-age=31536000, immutable" \
    --exclude "*.html" \
    --region "$AWS_REGION"

# Upload HTML files with no cache
aws s3 sync dist/ "s3://${BUCKET_NAME}/" \
    --exclude "*" \
    --include "*.html" \
    --cache-control "public, max-age=0, must-revalidate" \
    --content-type "text/html" \
    --region "$AWS_REGION"

echo -e "${GREEN}✅ Files uploaded to S3${NC}"
echo ""

# Invalidate CloudFront cache
echo -e "${YELLOW}🔄 Invalidating CloudFront cache...${NC}"
INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id "$DISTRIBUTION_ID" \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text \
    --region "$AWS_REGION")

echo -e "${GREEN}✅ CloudFront invalidation created (ID: ${INVALIDATION_ID})${NC}"
echo ""

# Get website URL
WEBSITE_URL=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
    --output text \
    --region "$AWS_REGION")

# Print success message
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 Deployment Completed Successfully!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}Environment:${NC} ${ENV}"
echo -e "${BLUE}Region:${NC} ${AWS_REGION}"
echo -e "${BLUE}S3 Bucket:${NC} ${BUCKET_NAME}"
echo -e "${BLUE}CloudFront Distribution:${NC} ${DISTRIBUTION_ID}"
echo -e "${BLUE}Website URL:${NC} ${WEBSITE_URL}"
echo ""
echo -e "${YELLOW}Note: CloudFront cache invalidation may take a few minutes to complete.${NC}"
echo ""
