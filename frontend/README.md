# EcoViz Frontend - Carbon Footprint Calculator UI

> Modern, responsive React application for calculating and visualizing carbon footprints with AI-powered insights.

[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Latest-646CFF)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Components](#components)
- [State Management](#state-management)
- [Routing](#routing)
- [Styling](#styling)
- [Analytics & Monitoring](#analytics--monitoring)
- [Deployment](#deployment)
- [Performance](#performance)
- [Contributing](#contributing)

## 🌍 Overview

The EcoViz frontend is a modern single-page application (SPA) built with React, TypeScript, and Vite. It provides an intuitive, multi-step interface for users to calculate their carbon footprint across housing, transportation, food, and consumption categories, with real-time validation, interactive visualizations, and AI-powered recommendations.

### Key Capabilities

- **Intuitive Multi-Step Form**: Guided calculator with progress tracking
- **Real-Time Validation**: Zod-based schema validation for data integrity
- **Interactive Visualizations**: Dynamic charts using Recharts
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **State Persistence**: Zustand-based state management with local storage
- **Performance Monitoring**: Built-in analytics and error tracking
- **Accessibility**: WCAG compliant with shadcn/ui components

## ✨ Features

### User Features

- 🧮 **Multi-Step Calculator**: Progressive form with 4 main categories
- 📊 **Visual Results**: Interactive pie charts and bar graphs
- 🤖 **AI Recommendations**: Personalized suggestions via OpenAI
- 📈 **Comparative Analysis**: Compare against global and US averages
- 💾 **Auto-Save**: Form data persists across sessions
- 📱 **Responsive Design**: Seamless experience on all devices
- ♿ **Accessibility**: Keyboard navigation and screen reader support
- 🎨 **Modern UI**: Clean, intuitive interface with shadcn/ui

### Technical Features

- **Fast Development**: Hot module replacement (HMR) with Vite
- **Type Safety**: Full TypeScript coverage with strict mode
- **Component Library**: Radix UI primitives with shadcn/ui
- **Animation**: Smooth transitions with React Spring
- **Error Boundaries**: Graceful error handling with Sentry
- **Analytics**: User behavior tracking with PostHog
- **Performance**: Optimized builds with code splitting
- **SEO**: Meta tags and Open Graph support

## 🛠️ Technology Stack

### Core Framework

- **React 18.3.1**: Latest React with concurrent features
- **TypeScript 5.8.3**: Type-safe JavaScript with strict checks
- **Vite**: Next-generation frontend tooling for blazing fast builds

### UI & Styling

- **Tailwind CSS 3.x**: Utility-first CSS framework
- **shadcn/ui**: High-quality, accessible component library
- **Radix UI**: Unstyled, accessible UI primitives
- **Lucide React**: Beautiful, consistent icon set
- **React Spring**: Physics-based animation library

### Data & State

- **Zustand**: Lightweight state management
- **TanStack Query (React Query)**: Server state management
- **Zod**: Runtime type validation
- **React Markdown**: Markdown rendering for AI responses

### Routing & Navigation

- **React Router v6**: Declarative routing

### Visualization

- **Recharts**: Composable charting library

### Analytics & Monitoring

- **PostHog**: Product analytics and feature flags
- **Sentry**: Error tracking and performance monitoring
- **Vercel Analytics**: Web vitals and real-time insights
- **Vercel Speed Insights**: Performance metrics

### Development Tools

- **Biome**: Fast linter and formatter
- **PostCSS**: CSS transformations
- **dotenv**: Environment variable management

## 📁 Project Structure

```
frontend/
├── public/                    # Static assets
│   └── (images, icons, etc.)
│
├── src/
│   ├── assets/               # Dynamic assets (images, fonts)
│   │
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── accordion.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── label.tsx
│   │   │   └── navigation-menu.tsx
│   │   ├── Footer.tsx       # Site footer
│   │   ├── Layout.tsx       # Main layout wrapper
│   │   └── Navbar.tsx       # Navigation bar
│   │
│   ├── hooks/               # Custom React hooks
│   │   └── use-toast.ts    # Toast notification hook
│   │
│   ├── lib/                 # Utility functions
│   │   └── utils.ts        # General utilities (cn, etc.)
│   │
│   ├── pages/              # Route components
│   │   ├── Home.tsx        # Landing page
│   │   ├── Calculator.tsx  # Main calculator (926 lines)
│   │   ├── Results.tsx     # Results visualization
│   │   ├── AboutUs.tsx     # About page
│   │   └── AlgorithmExplanationPage.tsx  # Algorithm details
│   │
│   ├── stores/             # State management
│   │   └── dataStore.ts   # Zustand store for form data
│   │
│   ├── App.tsx             # Main app component with routes
│   ├── App.css             # App-level styles
│   ├── index.css           # Global styles & Tailwind imports
│   ├── main.tsx            # App entry point
│   └── vite-env.d.ts       # Vite type declarations
│
├── scripts/                # Build and deployment scripts
│   └── deploy.sh          # Deployment automation
│
├── components.json         # shadcn/ui configuration
├── index.html             # HTML entry point
├── package.json           # Dependencies and scripts
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript base config
├── tsconfig.app.json      # TypeScript app config
├── tsconfig.node.json     # TypeScript Node config
├── vite.config.ts         # Vite configuration
├── template.yaml          # AWS CloudFormation template
├── samconfig.toml         # SAM deployment config
├── DEPLOYMENT_QUICK_REFERENCE.md  # Deployment guide
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0

### Installation

1. **Navigate to frontend directory**:

   ```bash
   cd frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Create environment file**:

   Create a `.env` file in the frontend root:

   ```bash
   # Backend API URL
   VITE_API_URL=http://localhost:3001

   # PostHog Analytics (optional)
   VITE_POSTHOG_API_KEY=your_posthog_api_key

   # Sentry Error Tracking (optional)
   VITE_SENTRY_DSN=your_sentry_dsn
   ```

4. **Start development server**:

   ```bash
   npm run dev
   ```

5. **Open browser**:

   Navigate to `http://localhost:5173`

## 💻 Development

### Development Server

```bash
# Start dev server with HMR
npm run dev

# Dev server runs at: http://localhost:5173
```

### Building for Production

```bash
# Build TypeScript and create production bundle
npm run build

# Output directory: dist/
```

### Preview Production Build

```bash
# Preview production build locally
npm run preview

# Preview server runs at: http://localhost:4173
```

### Code Quality

```bash
# Run linter
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format:fix

# Check code quality (lint + format)
npm run check

# Auto-fix all issues
npm run check:fix
```

### Development Workflow

1. **Create feature branch**: `git checkout -b feature/my-feature`
2. **Make changes**: Edit files in `src/`
3. **Test locally**: `npm run dev`
4. **Check quality**: `npm run check:fix`
5. **Build**: `npm run build`
6. **Commit**: `git commit -m "Add feature"`
7. **Push**: `git push origin feature/my-feature`

## 🧩 Components

### Page Components

#### Home.tsx

Landing page with:
- Hero section
- Feature highlights
- Call-to-action buttons
- Responsive layout

#### Calculator.tsx (926 lines)

Multi-step form with:
- **Step 1: Housing** - Property type, size, energy usage
- **Step 2: Transportation** - Car, public transit, flights
- **Step 3: Food** - Diet type, waste levels
- **Step 4: Consumption** - Shopping and recycling habits

Features:
- Progress indicator
- Form validation
- Auto-save functionality
- Loading states with facts
- Error handling

#### Results.tsx

Results visualization with:
- Total carbon footprint display
- Category breakdown (pie chart)
- Comparison bars (global/US averages)
- AI-powered recommendations
- Markdown rendering

#### AboutUs.tsx

Information page about the project

#### AlgorithmExplanationPage.tsx

Detailed explanation of calculation methodology

### UI Components

All UI components from shadcn/ui:
- **button**: Action buttons with variants
- **card**: Content containers
- **input**: Text input fields
- **select**: Dropdown selections
- **checkbox**: Boolean inputs
- **radio-group**: Single-choice selections
- **slider**: Range inputs
- **progress**: Progress bars
- **toast**: Notifications
- **accordion**: Collapsible sections
- **sheet**: Side drawers
- **label**: Form labels
- **navigation-menu**: Navigation component

### Layout Components

- **Layout.tsx**: Main application layout wrapper
- **Navbar.tsx**: Top navigation with routing
- **Footer.tsx**: Site footer with links

## 🗂️ State Management

### Zustand Store (dataStore.ts)

```typescript
// Store for calculator form data
interface DataStore {
  formData: FormData;
  saveData: (data: FormData) => void;
  validateAndSaveData: (data: FormData) => boolean;
  clearData: () => void;
}
```

Features:
- Persists to localStorage
- Schema validation with Zod
- Type-safe state updates
- Hydration on mount

### TanStack Query

Used for server state management:
- API request caching
- Automatic refetching
- Loading and error states
- Request deduplication

## 🛣️ Routing

React Router v6 configuration:

```
/ → Home page
/calculator → Multi-step calculator
/results → Results visualization
/about → About Us page
/algorithm → Algorithm explanation
```

Protected routes and navigation guards can be added as needed.

## 🎨 Styling

### Tailwind CSS

Utility-first CSS with custom configuration:

```javascript
// tailwind.config.js
{
  theme: {
    extend: {
      colors: { /* custom colors */ },
      borderRadius: { /* custom radii */ },
      keyframes: { /* animations */ }
    }
  }
}
```

### shadcn/ui Theming

CSS variables for theming:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... more variables */
}
```

### Dark Mode

Dark mode support via CSS variables (can be enabled in tailwind.config.js)

## 📊 Analytics & Monitoring

### PostHog Analytics

Track user behavior:
- Page views
- Button clicks
- Form interactions
- Feature usage

### Sentry Error Tracking

Production error monitoring:
- Runtime errors
- API failures
- Performance issues
- Source maps for debugging

### Vercel Analytics

Web vitals tracking:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- First Input Delay (FID)

## 🚢 Deployment

### Vercel (Current)

**Automatic Deployment**:
- Push to `main` branch → Production
- Pull requests → Preview deployments

**Manual Deployment**:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### AWS S3 + CloudFront (Alternative)

Deploy static site to AWS:

```bash
# Build application
npm run build

# Deploy with SAM
sam build -t template.yaml
sam deploy -t template.yaml
```

See [DEPLOYMENT_QUICK_REFERENCE.md](DEPLOYMENT_QUICK_REFERENCE.md) for details.

### Environment Variables

Set in deployment platform:

**Vercel**:
1. Project Settings → Environment Variables
2. Add `VITE_API_URL`, `VITE_POSTHOG_API_KEY`, `VITE_SENTRY_DSN`
3. Redeploy

**AWS**:
- Store in SSM Parameter Store or Secrets Manager
- Reference in CloudFormation template

## ⚡ Performance

### Optimization Strategies

1. **Code Splitting**: Automatic route-based splitting
2. **Tree Shaking**: Remove unused code
3. **Lazy Loading**: Dynamic imports for heavy components
4. **Image Optimization**: Compressed assets
5. **Bundle Analysis**: Vite build analyzer

### Build Optimization

```bash
# Analyze bundle size
npx vite-bundle-visualizer

# Check bundle stats
npm run build -- --mode production
```

### Performance Metrics

Target metrics:
- **FCP**: < 1.8s
- **LCP**: < 2.5s
- **CLS**: < 0.1
- **FID**: < 100ms
- **Bundle Size**: < 500KB (gzipped)

## 🧪 Testing

Testing will be added using Vitest (see TODO.md):

```bash
# Run tests (coming soon)
npm test

# Run tests in watch mode
npm test:watch

# Coverage report
npm test:coverage
```

## 🤝 Contributing

Contributions welcome! Please:

1. Follow the existing component structure
2. Use TypeScript for all new files
3. Follow Tailwind CSS conventions
4. Add proper TypeScript types
5. Test on mobile devices
6. Run `npm run check:fix` before committing

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Vite](https://vitejs.dev/) for blazing fast builds
- [Recharts](https://recharts.org/) for data visualization

## 📧 Support

For issues and questions:
- Create an issue in the GitHub repository
- Check documentation in `/docs` folder
- Review [DEPLOYMENT_QUICK_REFERENCE.md](DEPLOYMENT_QUICK_REFERENCE.md)

---

**Built with 💚 for a sustainable future**
- `Results.tsx`: Detailed results page with visualizations
- `AboutUs.tsx`: Information about EcoViz and its technology stack
- `AlgorithmExplanationPage.tsx`: Detailed explanation of calculation methodology

## Contribution Guidelines

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

Please ensure your code follows the existing style conventions and includes appropriate tests.

## Future Enhancements

- User Authentication
- Email Results Feature
- Results Preview Page
- Progress Tracking
- Social Sharing
- Localization
- Enhanced AI Recommendations
- Mobile App Development

## License

[MIT License](LICENSE)

## Contact

For any queries or support, please contact us at support@ecoviz.xyz.

---

Built with 🌿 by the EcoViz Team
