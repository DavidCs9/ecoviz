# EcoViz Frontend

## Overview

EcoViz is a powerful web application designed to help users calculate, visualize, and reduce their carbon footprint. This repository contains the frontend codebase for the EcoViz project, built with modern web technologies to provide an intuitive and engaging user experience.

## Features

- **Carbon Footprint Calculator**: Easy-to-use interface for inputting lifestyle data
- **Results Visualization**: Interactive charts and graphs to display carbon footprint breakdown
- **AI-Powered Recommendations**: Personalized suggestions for reducing environmental impact
- **Comparison with Averages**: See how your carbon footprint compares to global and US averages
- **Responsive Design**: Optimized for both desktop and mobile devices

## Technology Stack

- **React**: Frontend library for building user interfaces
- **Vite**: Next-generation frontend tooling for faster development
- **TypeScript**: Typed superset of JavaScript for improved developer experience
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Recharts**: Composable charting library for React
- **React Router**: Declarative routing for React applications
- **ShadCN UI**: Component library for consistent and customizable UI elements
- **React Spring**: Spring-physics based animation library
- **PostHog**: Product analytics for user insights
- **Sentry**: Real-time error tracking and monitoring

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/ecoviz-frontend.git
   ```

2. Navigate to the project directory:

   ```
   cd ecoviz-frontend
   ```

3. Install dependencies:

   ```
   npm install
   ```

   or

   ```
   yarn install
   ```

4. Create a `.env` file in the root directory and add necessary environment variables:

   ```
   VITE_API_URL=your_backend_api_url
   VITE_POSTHOG_API_KEY=your_posthog_api_key
   VITE_SENTRY_DSN=your_sentry_dsn
   ```

5. Start the development server:

   ```
   npm run dev
   ```

   or

   ```
   yarn dev
   ```

6. Open your browser and visit `http://localhost:5173` to see the application running.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── pages/          # Main page components
├── styles/         # Global styles and Tailwind config
├── utils/          # Utility functions and helpers
├── App.tsx         # Main application component
├── main.tsx        # Entry point of the application
└── vite-env.d.ts   # TypeScript declarations for Vite
```

## Key Components

- `Home.tsx`: Landing page component
- `Calculator.tsx`: Multi-step carbon footprint calculator
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
