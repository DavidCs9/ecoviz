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
- Docker (for local backend testing)

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

### Frontend Deployment (Vercel)

The frontend is deployed using Vercel. To deploy:

1.  **Install Vercel CLI:** `npm install -g vercel`
2.  **Link Project:** Run `vercel` in the `frontend/` directory and link it to your Vercel account and a new or existing project.
3.  **Deploy:** `vercel --prod` (for production deployment) or `vercel` (for preview deployments).

For continuous deployment with GitHub Actions, ensure you have configured the `VERCEL_TOKEN` as a GitHub secret in your repository settings.

---
