# EcoViz Frontend - Quick Deployment Reference

## 🚀 Quick Start

### Prerequisites

```bash
# Install AWS SAM CLI
pip install aws-sam-cli

# Configure AWS credentials
aws configure
```

### Deploy with Script

```bash
# Deploy to dev
cd frontend
./scripts/deploy.sh dev

# Deploy to production
./scripts/deploy.sh prod
```

### Manual Deploy

```bash
cd frontend

# 1. Build
npm run build

# 2. Deploy infrastructure
sam deploy  # dev
sam deploy --config-env prod  # production

# 3. Upload to S3 (replace BUCKET_NAME)
aws s3 sync dist/ s3://BUCKET_NAME/ --delete

# 4. Invalidate CloudFront (replace DISTRIBUTION_ID)
aws cloudfront create-invalidation --distribution-id DISTRIBUTION_ID --paths "/*"
```

## 🔄 CI/CD Pipeline

Automatic deployments trigger on:

- **dev branch** → Dev environment
- **main branch** → Production environment

## 📊 Stack Information

Get deployment details:

```bash
# Get website URL
aws cloudformation describe-stacks \
  --stack-name ecoviz-frontend-dev \
  --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
  --output text

# Get bucket name
aws cloudformation describe-stacks \
  --stack-name ecoviz-frontend-dev \
  --query 'Stacks[0].Outputs[?OutputKey==`WebsiteBucketName`].OutputValue' \
  --output text

# Get CloudFront distribution ID
aws cloudformation describe-stacks \
  --stack-name ecoviz-frontend-dev \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
  --output text
```

## 🔥 Useful Commands

```bash
# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

# View CloudFront logs
aws s3 ls s3://ecoviz-logs-dev-ACCOUNT_ID/cloudfront/dev/

# Check stack status
aws cloudformation describe-stacks --stack-name ecoviz-frontend-dev

# Delete stack (careful!)
aws cloudformation delete-stack --stack-name ecoviz-frontend-dev

# View recent deployments
aws cloudformation describe-stack-events \
  --stack-name ecoviz-frontend-dev \
  --max-items 20
```

## 🛠️ Troubleshooting

### Issue: Files not updating

```bash
# Hard invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

# Check S3 file upload
aws s3 ls s3://YOUR_BUCKET_NAME/ --recursive

# Verify file content
aws s3 cp s3://YOUR_BUCKET_NAME/index.html - | head
```

### Issue: 403 Forbidden

- Check CloudFront distribution is deployed
- Verify S3 bucket policy allows CloudFront OAC
- Confirm files exist in bucket

### Issue: SPA routing broken

- Verify CloudFront custom error responses (403→200, 404→200)
- Check error responses redirect to /index.html
- Test direct URL access to nested routes

### Issue: Deployment fails

```bash
# Check CloudFormation events
aws cloudformation describe-stack-events \
  --stack-name ecoviz-frontend-dev \
  --query 'StackEvents[?ResourceStatus==`CREATE_FAILED` || ResourceStatus==`UPDATE_FAILED`]'

# Validate template
sam validate

# Check SAM build
sam build --debug
```

## 🔐 Environment Variables

The frontend uses build-time environment variables:

**`.env.development`**

```env
VITE_API_URL=https://your-dev-api.execute-api.us-west-1.amazonaws.com/dev
```

**`.env.production`**

```env
VITE_API_URL=https://your-prod-api.execute-api.us-west-1.amazonaws.com/prod
```

## 📁 File Structure

```
frontend/
├── template.yaml          # CloudFormation infrastructure
├── samconfig.toml         # SAM deployment config
├── scripts/
│   └── deploy.sh         # Automated deployment script
└── .github/workflows/
    └── frontend-deploy.yml # CI/CD pipeline
```

## 🎯 Deployment Workflow

### First-Time Setup

```bash
# 1. Create environment files
cp .env.development.example .env.development
cp .env.production.example .env.production
# Edit files with your API URLs

# 2. Deploy infrastructure
cd frontend
sam deploy --guided

# 3. Build and deploy
npm run build
./scripts/deploy.sh dev
```

### Regular Updates

```bash
# Code changes only
cd frontend
npm run build
./scripts/deploy.sh dev

# Infrastructure changes
sam deploy
```

### CI/CD Updates

```bash
# Dev deployment
git checkout dev
git add .
git commit -m "Your changes"
git push origin dev
# Auto-deploys to dev environment

# Production deployment
git checkout main
git merge dev
git push origin main
# Auto-deploys to production
```

## 🔍 Verification Commands

```bash
# Test website is accessible
curl -I https://YOUR_CLOUDFRONT_DOMAIN

# Check security headers
curl -I https://YOUR_CLOUDFRONT_DOMAIN | grep -E "strict-transport-security|x-frame-options|content-security-policy"

# Test SPA routing
curl -I https://YOUR_CLOUDFRONT_DOMAIN/calculator

# Check CloudFront cache status
curl -I https://YOUR_CLOUDFRONT_DOMAIN | grep x-cache

# Verify HTTPS redirect
curl -I http://YOUR_CLOUDFRONT_DOMAIN
```

## 💰 Cost Management

```bash
# Check S3 storage usage
aws s3 ls s3://YOUR_BUCKET_NAME --recursive --summarize --human-readable

# View CloudFront data transfer
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name BytesDownloaded \
  --dimensions Name=DistributionId,Value=YOUR_DISTRIBUTION_ID \
  --start-time $(date -u -d '7 days ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 86400 \
  --statistics Sum

# Clean up old S3 versions (if needed)
aws s3api list-object-versions \
  --bucket YOUR_BUCKET_NAME \
  --query 'Versions[?IsLatest==`false`].[Key, VersionId]' \
  --output text
```

## 🚨 Emergency Procedures

### Rollback Application

```bash
# 1. List S3 versions
aws s3api list-object-versions \
  --bucket YOUR_BUCKET_NAME \
  --prefix index.html

# 2. Restore previous version
aws s3api copy-object \
  --bucket YOUR_BUCKET_NAME \
  --copy-source YOUR_BUCKET_NAME/index.html?versionId=VERSION_ID \
  --key index.html

# 3. Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### Rollback Infrastructure

```bash
# Cancel in-progress update
aws cloudformation cancel-update-stack --stack-name ecoviz-frontend-prod

# Delete and redeploy (nuclear option)
aws cloudformation delete-stack --stack-name ecoviz-frontend-dev
# Wait for deletion
aws cloudformation wait stack-delete-complete --stack-name ecoviz-frontend-dev
# Redeploy
sam deploy
```

### Disable Site (Emergency)

```bash
# Create maintenance page
echo "<html><body><h1>Maintenance in Progress</h1></body></html>" > maintenance.html

# Upload to S3
aws s3 cp maintenance.html s3://YOUR_BUCKET_NAME/index.html \
  --content-type "text/html" \
  --cache-control "no-cache"

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

## 📚 Additional Resources

- [AWS SAM Documentation](https://docs.aws.amazon.com/serverless-application-model/)
- [CloudFront Developer Guide](https://docs.aws.amazon.com/cloudfront/)
- [S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [GitHub Actions AWS Documentation](https://github.com/aws-actions)

## 🎓 Common Scenarios

### Scenario: Update API endpoint

```bash
# 1. Update .env file
vim .env.production

# 2. Rebuild
npm run build

# 3. Deploy
./scripts/deploy.sh prod
```

### Scenario: Add custom domain

```bash
# 1. Request certificate (must be in us-east-1)
aws acm request-certificate \
  --domain-name yourdomain.com \
  --validation-method DNS \
  --region us-east-1

# 2. Update template parameters
sam deploy --parameter-overrides \
  "Environment=prod DomainName=yourdomain.com CertificateArn=arn:aws:acm:..."

# 3. Update DNS
# Create CNAME/Alias record pointing to CloudFront domain
```

### Scenario: Debug deployment issues

```bash
# 1. Check GitHub Actions logs
# Go to: https://github.com/YOUR_ORG/ecoviz/actions

# 2. Check CloudFormation events
aws cloudformation describe-stack-events \
  --stack-name ecoviz-frontend-dev \
  --max-items 50

# 3. Check S3 bucket
aws s3 ls s3://YOUR_BUCKET_NAME/ --recursive

# 4. Test CloudFront
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID
```

---

**Last Updated:** November 2, 2025  
**Maintained by:** EcoViz Team
