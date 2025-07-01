import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  // Base JavaScript recommended rules
  js.configs.recommended,
  
  // TypeScript files configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier: prettier,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      ...prettier.configs.recommended.rules,
      'prettier/prettier': 'error',
      // Add any custom rules here
      // '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
  
  // JavaScript files configuration
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    plugins: {
      prettier: prettier,
    },
    rules: {
      ...prettier.configs.recommended.rules,
      'prettier/prettier': 'error',
    },
  },
  
  // Global ignores
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      '*.d.ts',
      'coverage/',
      '.nyc_output/',
    ],
  },
]; 