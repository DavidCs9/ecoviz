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

- `npm run build` - Build all functions

## Adding New Functions

1. Create a new directory for your function
2. Add it to the `workspaces` array in `package.json`
3. Create a `package.json` for the function with only function-specific dependencies
4. Run `npm install` from the backend root

## Benefits

- **Centralized dependency management** - All dev dependencies in one place
- **Easier maintenance** - Update dependencies in one place
