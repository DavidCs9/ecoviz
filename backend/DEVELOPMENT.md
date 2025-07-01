# Backend Development Guide

This backend uses a centralized package management approach with npm workspaces to manage all Lambda functions from a single location.

## Setup

1. **Install dependencies from the backend root:**
   ```bash
   cd backend
   npm install
   ```

2. **Install dependencies for all workspaces:**
   ```bash
   npm run install:all
   ```

## Available Scripts

From the backend root directory, you can run:

- `npm run lint` - Lint all TypeScript files and auto-fix issues
- `npm run lint:check` - Check linting without auto-fixing
- `npm run format` - Format all files with Prettier
- `npm run format:check` - Check formatting without making changes
- `npm run test` - Run tests for all functions
- `npm run build` - Build all functions
- `npm run compile` - Compile TypeScript for all functions

## Individual Function Scripts

You can also run scripts for individual functions:

```bash
# From backend root
npm run test --workspace=calculate
npm run test --workspace=mailer

# Or from within the function directory
cd calculate
npm run test
```

## Configuration Files

- `eslint.config.js` - Centralized ESLint flat configuration
- `.prettierrc.js` - Centralized Prettier configuration
- `.prettierignore` - Files to ignore for Prettier

## Adding New Functions

1. Create a new directory for your function
2. Add it to the `workspaces` array in `package.json`
3. Create a `package.json` for the function with only function-specific dependencies
4. Run `npm install` from the backend root

## Benefits

- **Centralized dependency management** - All dev dependencies in one place
- **Consistent linting and formatting** - Same rules across all functions
- **Reduced duplication** - No need to duplicate ESLint/Prettier configs
- **Easier maintenance** - Update dependencies and configs in one place
- **Modern ESLint setup** - Uses flat config format for better performance and configuration

## ESLint Flat Config

This project uses ESLint's new flat config format (`eslint.config.js`) which provides:
- Better performance
- More flexible configuration
- Native ES module support
- Simplified plugin and rule management 