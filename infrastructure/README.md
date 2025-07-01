# Frontend Infrastructure

This directory contains the AWS infrastructure configuration for deploying the EcoViz frontend to S3 with CloudFront CDN.

## Architecture

- **S3 Bucket**: Static website hosting with proper security configurations
- **CloudFront**: Global CDN with custom domain, SSL certificate, and optimized caching
- **Route 53**: DNS management with automatic alias records
- **Certificate Manager**: SSL/TLS certificate with DNS validation

## Quick Setup

### 1. Deploy Infrastructure

```bash
cd infrastructure
./deploy-frontend.sh --domain your-domain.com --environment prod
```

### 2. Configure GitHub Secrets

Add these secrets to your GitHub repository for CI/CD:

```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key  
S3_BUCKET_NAME=your-bucket-name (from deployment output)
CLOUDFRONT_DISTRIBUTION_ID=your_distribution_id (from deployment output)
VITE_API_URL=https://your-api-gateway-url/dev
```

### 3. SSL Certificate Validation

1. Go to AWS Certificate Manager console
2. Find your certificate 
3. Add the CNAME records to your DNS provider for validation

### 4. DNS Configuration (if using external DNS)

If not using Route 53, point your domain to the CloudFront distribution:

```
your-domain.com -> CNAME -> d123456789.cloudfront.net
www.your-domain.com -> CNAME -> d123456789.cloudfront.net
```

## Deployment Process

The CI/CD pipeline automatically:

1. **Tests**: Runs frontend tests and linting
2. **Builds**: Creates optimized production build with environment variables
3. **Deploys**: Syncs files to S3 with proper cache headers
4. **Invalidates**: Clears CloudFront cache for immediate updates

## Cache Strategy

- **Static Assets** (JS/CSS/images): 1 year cache with immutable flag
- **HTML/JSON files**: No cache (immediate updates)
- **CloudFront**: Automatic compression and HTTP/2 support

## Security Features

- Origin Access Control (OAC) for S3 access
- Security headers via CloudFront response policies
- HTTPS enforcement (HTTP redirects to HTTPS)
- Private S3 bucket (no public access)

## Custom Domain Setup

The infrastructure includes:
- SSL certificate for your domain + www subdomain
- Route 53 hosted zone (optional)
- Automatic DNS alias records
- CloudFront custom domain configuration

## Manual Deployment

If you need to deploy manually:

```bash
# Build the frontend
cd frontend
npm run build

# Upload to S3 with proper cache headers
aws s3 sync dist/ s3://your-bucket-name \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "*.html" --exclude "*.json"

aws s3 sync dist/ s3://your-bucket-name \
  --delete \
  --cache-control "public, max-age=0, must-revalidate" \
  --include "*.html" --include "*.json"

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

## Cost Optimization

- Price Class 100 (North America and Europe only)
- Efficient caching reduces origin requests
- Compression enabled for all content
- Only required AWS resources deployed

## Monitoring

CloudFront automatically provides:
- Access logs (can be enabled)
- Real-time metrics in CloudWatch
- Cache hit/miss ratios
- Error rate monitoring