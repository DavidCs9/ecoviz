#!/bin/bash

# Deploy Frontend Infrastructure Script for EcoViz
# This script deploys the S3 + CloudFront infrastructure for the frontend

set -e

# Default values
STACK_NAME="ecoviz-frontend-infrastructure"
DOMAIN_NAME="ecoviz.xyz"
ENVIRONMENT="prod"
REGION="us-west-1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --domain)
            DOMAIN_NAME="$2"
            shift 2
            ;;
        --environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        --region)
            REGION="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --domain DOMAIN       Domain name for the website (default: ecoviz.xyz)"
            echo "  --environment ENV     Environment (default: prod)"
            echo "  --region REGION       AWS region (default: us-west-1)"
            echo "  --help               Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

print_status "Starting frontend infrastructure deployment..."
print_status "Domain: $DOMAIN_NAME"
print_status "Environment: $ENVIRONMENT"
print_status "Region: $REGION"

# Check if AWS CLI is installed and configured
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "AWS credentials not configured. Please run 'aws configure' first."
    exit 1
fi

# Deploy the CloudFormation stack
print_status "Deploying CloudFormation stack: $STACK_NAME"

aws cloudformation deploy \
    --template-file frontend-infrastructure.yaml \
    --stack-name "$STACK_NAME" \
    --parameter-overrides \
        DomainName="$DOMAIN_NAME" \
        Environment="$ENVIRONMENT" \
    --capabilities CAPABILITY_IAM \
    --region "$REGION" \
    --no-fail-on-empty-changeset

if [ $? -eq 0 ]; then
    print_status "CloudFormation stack deployed successfully!"
    
    # Get stack outputs
    print_status "Retrieving stack outputs..."
    
    BUCKET_NAME=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$REGION" \
        --query 'Stacks[0].Outputs[?OutputKey==`WebsiteBucketName`].OutputValue' \
        --output text)
    
    DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$REGION" \
        --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
        --output text)
    
    WEBSITE_URL=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$REGION" \
        --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
        --output text)
    
    print_status "Deployment completed successfully!"
    echo
    print_status "=== Deployment Details ==="
    echo "S3 Bucket: $BUCKET_NAME"
    echo "CloudFront Distribution ID: $DISTRIBUTION_ID"
    echo "Website URL: $WEBSITE_URL"
    echo
    print_warning "=== Next Steps ==="
    echo "1. Add these GitHub Secrets for CI/CD:"
    echo "   - S3_BUCKET_NAME: $BUCKET_NAME"
    echo "   - CLOUDFRONT_DISTRIBUTION_ID: $DISTRIBUTION_ID"
    echo "   - AWS_ACCESS_KEY_ID: [Your AWS Access Key]"
    echo "   - AWS_SECRET_ACCESS_KEY: [Your AWS Secret Key]"
    echo
    echo "2. Validate SSL certificate in AWS Certificate Manager console"
    echo "3. Update DNS settings to point to Route 53 name servers (if using Route 53)"
    echo
    print_status "Infrastructure deployment complete!"
else
    print_error "CloudFormation deployment failed!"
    exit 1
fi