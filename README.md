# EcoViz - Carbon Footprint Calculator

> A comprehensive web application for calculating, visualizing, and reducing your carbon footprint with AI-powered insights.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🌍 Overview

EcoViz is a modern, serverless web application designed to help individuals understand and reduce their environmental impact. By analyzing data across four key lifestyle categories—housing, transportation, food, and consumption—EcoViz provides detailed carbon footprint calculations with personalized, AI-powered recommendations for sustainable living.

### Key Capabilities

- **Comprehensive Analysis**: Calculate carbon emissions across housing energy use, transportation habits, dietary choices, and consumption patterns
- **AI-Powered Insights**: Get personalized recommendations using advanced language models
- **Visual Comparisons**: Compare your footprint against global and US averages
- **Interactive Interface**: User-friendly multi-step calculator with real-time validation
- **Serverless Architecture**: Scalable AWS infrastructure with pay-per-use pricing

## ✨ Features

### Core Functionality

- 🏠 **Housing Emissions**: Track electricity, natural gas, and heating oil consumption
- 🚗 **Transportation Analysis**: Monitor car usage, public transit, and flight emissions
- 🍽️ **Food Impact**: Assess diet type and food waste levels
- 🛍️ **Consumption Tracking**: Evaluate shopping and recycling habits
- 🤖 **AI Recommendations**: Receive personalized suggestions for reducing your footprint
- 📊 **Data Visualization**: Interactive charts and breakdowns of emission sources
- 📈 **Comparative Analysis**: See how you compare to global and national averages

### Technical Features

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Validation**: Zod-based schema validation for data integrity
- **Error Tracking**: Sentry integration for production monitoring
- **Analytics**: PostHog and Vercel Analytics for user insights
- **Performance Monitoring**: Built-in speed insights and optimization
- **Type Safety**: Full TypeScript implementation across the stack

## 🏗️ Architecture

EcoViz follows a modern serverless architecture with clear separation between frontend and backend:

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│                 │         │                  │         │                 │
│  React Frontend │────────▶│  AWS API Gateway │────────▶│ Lambda Function │
│   (Vite + TS)   │         │                  │         │   (Calculate)   │
│                 │         │                  │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
                                                                   │
                                                                   │
                                                                   ▼
                                                          ┌─────────────────┐
                                                          │                 │
                                                          │  OpenAI GPT-4   │
                                                          │  (AI Analysis)  │
                                                          │                 │
                                                          └─────────────────┘
```

### AWS Resources

- **API Gateway**: RESTful API endpoints with CORS support
- **Lambda Functions**: Serverless compute for calculations and AI analysis
- **CloudWatch**: Logging and monitoring with JSON format
- **X-Ray**: Distributed tracing for performance insights
- **S3 + CloudFront**: Static website hosting with CDN (optional)

## 📁 Project Structure

```
ecoviz/
├── backend/                    # Serverless backend application
│   ├── calculate/             # Lambda function for carbon calculations
│   │   ├── app.ts            # Lambda handler
│   │   ├── Calculator.ts     # Main calculation orchestrator
│   │   ├── config/           # Emission factors and configuration
│   │   ├── schema/           # Zod validation schemas
│   │   └── services/         # Business logic services
│   ├── events/               # Test events for local development
│   ├── template.yaml         # SAM infrastructure template
│   ├── samconfig.toml        # SAM config for dev environment
│   └── samconfig.prod.toml   # SAM config for prod environment
│
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   ├── Footer.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── Navbar.tsx
│   │   ├── pages/           # Route components
│   │   │   ├── Home.tsx
│   │   │   ├── Calculator.tsx
│   │   │   ├── Results.tsx
│   │   │   ├── AboutUs.tsx
│   │   │   └── AlgorithmExplanationPage.tsx
│   │   ├── stores/          # State management (Zustand)
│   │   ├── hooks/           # Custom React hooks
│   │   └── lib/             # Utility functions
│   ├── public/              # Static assets
│   ├── template.yaml        # CloudFormation template for S3/CloudFront
│   └── vite.config.ts       # Vite configuration
│
├── biome.json               # Biome linter/formatter config
└── package.json             # Root workspace configuration
```

## 🛠️ Technology Stack

### Frontend

- **Framework**: React 18.3 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router v6
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Charts**: Recharts
- **Animations**: React Spring
- **Form Validation**: Zod
- **Analytics**: PostHog, Vercel Analytics
- **Error Tracking**: Sentry

### Backend

- **Runtime**: Node.js 22.x
- **Language**: TypeScript 5.8
- **Framework**: AWS SAM (Serverless Application Model)
- **API**: AWS API Gateway
- **Compute**: AWS Lambda
- **AI/ML**: LangChain + OpenAI GPT-4
- **Validation**: Zod
- **Build**: esbuild (bundled via SAM)

### Development Tools

- **Linter/Formatter**: Biome
- **Git Hooks**: Husky + lint-staged
- **Package Manager**: npm with workspaces
- **Version Control**: Git

## 🚀 Getting Started

### Prerequisites

- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0
- **AWS CLI**: >= 2.0 (for backend deployment)
- **SAM CLI**: >= 1.0 (for backend development)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/DavidCs9/ecoviz.git
   cd ecoviz
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

   This will install dependencies for the root workspace, backend, and frontend.

3. **Set up environment variables**:

   **Backend** (`backend/.env`):
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   ```

   **Frontend** (`frontend/.env`):
   ```bash
   VITE_API_URL=http://localhost:3001
   VITE_POSTHOG_API_KEY=your_posthog_key
   VITE_SENTRY_DSN=your_sentry_dsn
   ```

## 💻 Development

### Running the Backend Locally

```bash
cd backend

# Build TypeScript
npm run build

# Start local API server
npm run local:api
# API available at: http://localhost:3001

# Or invoke function directly with test event
npm run local:invoke
```

### Running the Frontend Locally

```bash
cd frontend

# Start development server
npm run dev
# Application available at: http://localhost:5173
```

### Code Quality

The project uses Biome for linting and formatting. Run these commands from the root:

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

### Testing

```bash
# Backend - test specific function
cd backend
npm run local:invoke
```

## 🚢 Deployment

### Backend Deployment

The backend uses AWS SAM for infrastructure as code. Two environments are supported:

**Development**:
```bash
cd backend
sam build
sam deploy
```

**Production**:
```bash
cd backend
sam build
sam deploy --config-file samconfig.prod.toml
```

See [backend/DEPLOYMENT.md](backend/DEPLOYMENT.md) for detailed deployment instructions.

### Frontend Deployment

**Option 1: Vercel** (Current)
```bash
cd frontend
npm run build
# Deploy via Vercel CLI or GitHub integration
```

**Option 2: AWS S3 + CloudFront**
```bash
cd frontend
npm run build
sam build -t template.yaml
sam deploy
```

See [frontend/README.md](frontend/README.md) for detailed deployment instructions.

## 📊 Project Metrics

- **Lines of Code**: ~4,500+ (TypeScript/TSX)
- **Components**: 25+ React components
- **API Endpoints**: 1 primary calculation endpoint
- **Emission Factors**: 15+ categories tracked
- **Average Carbon Footprint Calculation Time**: < 5 seconds

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style (enforced by Biome)
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful, accessible components
- [LangChain](https://www.langchain.com/) for AI integration framework
- [AWS SAM](https://aws.amazon.com/serverless/sam/) for serverless infrastructure
- [Vercel](https://vercel.com/) for frontend hosting and analytics

## 📧 Contact

David - [@DavidCs9](https://github.com/DavidCs9)

Project Link: [https://github.com/DavidCs9/ecoviz](https://github.com/DavidCs9/ecoviz)

---

**Built with 💚 for a sustainable future**
