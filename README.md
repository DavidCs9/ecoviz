# EcoViz

EcoViz is a comprehensive platform for calculating, visualizing, and reducing your carbon footprint. It consists of a modern web frontend and a serverless backend powered by AI and AWS Lambda.

---

## Project Structure

- **backend/**: Serverless API for carbon footprint calculation, AI-powered analysis, and email reporting (Node.js, AWS Lambda, SAM CLI)
- **frontend/**: Web application for user interaction, visualization, and recommendations (React, Vite, TypeScript, Tailwind CSS)

---

## Features

- Multi-step carbon footprint calculator
- AI-powered personalized recommendations
- Interactive results visualization
- Email reporting
- Comparison with global and US averages

---

## Quickstart

### Prerequisites

- Node.js (v18+ for backend, v14+ for frontend)
- npm
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) (for backend)
- Docker (for local backend development)

### Backend Setup

```bash
cd backend
npm install
# Build and deploy (first time)
sam build
sam deploy --guided
# For local development
sam local start-api
```

- Configure environment variables: `OPENAI_API_KEY`, `EMAIL_PASS`
- See [backend/README.md](backend/README.md) for full API docs and advanced usage

### Frontend Setup

```bash
cd frontend
npm install
# Start development server
npm run dev
```

- Configure `.env` with: `VITE_API_URL`, `VITE_POSTHOG_API_KEY`, `VITE_SENTRY_DSN`
- See [frontend/README.md](frontend/README.md) for full details

### Frontend Deployment (AWS S3 + CloudFront)

The frontend is deployed to AWS S3 with CloudFront CDN. To deploy:

**Automated Deployment (Recommended):**

```bash
cd frontend
./scripts/deploy.sh dev   # Deploy to dev
./scripts/deploy.sh prod  # Deploy to production
```

**Manual Deployment:**

```bash
cd frontend
npm run build
sam deploy --guided  # First time setup
# Then sync to S3 and invalidate CloudFront (see DEPLOYMENT.md)
```

**CI/CD Pipeline:**

- Push to `dev` branch → auto-deploys to dev environment
- Push to `main` branch → auto-deploys to production environment

---
