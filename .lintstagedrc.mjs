/**
 * Lint-staged configuration for the EcoViz monorepo
 * Runs linters and formatters on staged files before commit
 */

export default {
  // TypeScript/JavaScript files in backend
  'backend/**/*.{ts,js}': ['eslint --fix --quiet', 'prettier --write'],

  // TypeScript/JavaScript files in frontend
  'frontend/**/*.{ts,tsx,js,jsx}': ['eslint --fix --quiet', 'prettier --write'],

  // JSON files across the monorepo
  '**/*.json': ['prettier --write'],

  // Markdown files
  '**/*.md': ['prettier --write'],

  // CSS files in frontend
  'frontend/**/*.css': ['prettier --write'],

  // YAML files (GitHub Actions, SAM templates, etc.)
  '**/*.{yml,yaml}': ['prettier --write'],
}
