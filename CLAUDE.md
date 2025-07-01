# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

EcoViz is a monorepo carbon footprint platform with distinct frontend and backend architectures:

### Backend Architecture
- **AWS Serverless**: Two Lambda functions deployed via SAM CLI
  - `CalculateFunction` (`/calculate`): Carbon footprint calculation with OpenAI integration
  - `MailerFunction` (`/send-mail`): Email reporting using Nodemailer with Zoho SMTP
- **Shared API Gateway**: Single endpoint with CORS enabled, routes to both functions
- **TypeScript**: All Lambda functions written in TypeScript, compiled with esbuild
- **Centralized package management**: npm workspaces from backend root directory

### Frontend Architecture  
- **React + TypeScript**: Modern React with hooks, functional components
- **Component system**: Radix UI primitives with custom styling using Tailwind CSS
- **State management**: React Query for server state, custom hooks for local persistence
- **Data flow**: Multi-step calculator → API calls → results visualization
- **Local storage**: Persists calculation results via `useDataPersistence` hook

### Key Integration Points
- Frontend calls backend `/calculate` endpoint with structured carbon footprint data
- Results stored in localStorage and displayed via charts (Recharts)  
- Optional email reporting via `/send-mail` endpoint
- AI analysis provides personalized recommendations based on user's top emission categories

## Essential Commands

### Development Workflow
```bash
# Root setup
npm install
npm run prepare  # Install husky hooks

# Backend development  
cd backend
npm install
npm run build    # Lint + format + compile TypeScript
npm test
sam build        # Build for AWS deployment
sam local start-api  # Local development server

# Frontend development
cd frontend  
npm install
npm run dev      # Start Vite dev server
npm test
npm run build    # TypeScript compile + Vite build

# Test specific functions
cd backend
npm run test --workspace=calculate
npm run test --workspace=mailer
```

### Deployment
```bash
# Backend to AWS
cd backend
npm run deploy   # Uses dotenv for environment variables

# Frontend to Vercel (automated via GitHub Actions)
npm run build
# Deployment happens automatically on push to main branch
```

## Key Files and Patterns

### Backend Lambda Structure
- `backend/template.yaml`: SAM template defining infrastructure and API routes
- `backend/calculate/app.ts`: Main calculation logic with emission factor calculations  
- `backend/mailer/app.ts`: Email service with HTML template generation
- `backend/*/types.ts`: TypeScript interfaces for request/response data structures

### Frontend Component Patterns
- `src/components/ui/`: Reusable Radix UI components with Tailwind styling
- `src/hooks/useDataPersistence.ts`: localStorage integration for calculation results
- `src/pages/Calculator.tsx`: Multi-step form with validation and API integration
- `src/pages/Results.tsx`: Data visualization with charts and AI recommendations

### Configuration Files
- `backend/samconfig.toml`: AWS SAM deployment configuration (us-west-1 region)
- `backend/jest.config.js`: Test configuration covering all Lambda functions
- Both directories use ESLint flat config format (`eslint.config.js`)

## Environment Requirements

### Backend Environment Variables  
- `OPENAI_API_KEY`: Required for AI recommendation generation
- `EMAIL_PASS`: Zoho SMTP password for email functionality

### Frontend Environment Variables
- `VITE_API_URL`: Backend API Gateway endpoint URL
- `VITE_POSTHOG_API_KEY`: Analytics (optional)
- `VITE_SENTRY_DSN`: Error monitoring (optional)

### Development Prerequisites
- Node.js 18+ (backend), 14+ (frontend)
- AWS SAM CLI for backend deployment
- Docker for local Lambda testing

## Code Quality & Testing

### Pre-commit Workflow
Husky pre-commit hook runs: `cd backend && npm run lint && npm run format && npm test`

### Testing Strategy
- Backend: Jest with ts-jest for Lambda function unit tests
- Frontend: Jest with jsdom environment, React Testing Library
- Coverage collection configured for both environments

### Linting & Formatting  
- ESLint flat config with TypeScript support
- Prettier for consistent code formatting
- Automated via build process: `npm run build` includes linting and formatting

## Emission Calculation Logic

The carbon footprint calculation uses specific emission factors:
- **Housing**: electricity (0.42 kg CO2/kWh), natural gas (5.3 kg CO2/therm), heating oil (10.15 kg CO2/gallon)
- **Transportation**: car emissions, public transit, flight distances with different factors for short/long haul
- **Food**: diet-based multipliers (meat-heavy: 3.3, vegetarian: 1.7, vegan: 1.5) with waste adjustments
- **Consumption**: shopping habits and recycling behavior modifiers

Global average: 4000 kg CO2e/year, US average: 16000 kg CO2e/year