// @ts-check
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

/**
 * Global ESLint configuration for EcoViz monorepo
 * Shared between backend and frontend workspaces
 */
export default tseslint.config(
  // Ignore build output and dependencies
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/node_modules/**',
      '**/.aws-sam/**',
      '**/coverage/**',
    ],
  },

  // Base recommended configs
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Global settings for all files
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      // Common rules for both workspaces
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'off', // Allow console logs
    },
  },

  // Backend-specific configuration
  {
    files: ['backend/**/*.{ts,js}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Backend can have any due to Lambda event types
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // Frontend-specific configuration
  {
    files: ['frontend/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },

  // JavaScript files don't need TypeScript type checking
  {
    files: ['**/*.js', '**/*.mjs'],
    ...tseslint.configs.disableTypeChecked,
  }
)
