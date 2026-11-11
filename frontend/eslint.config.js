import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';
import { importX } from 'eslint-plugin-import-x';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import pluginQuery from '@tanstack/eslint-plugin-query';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
      pluginQuery.configs['flat/recommended'],
    ],
    plugins: {
      'import-x': importX,
      'better-tailwindcss': betterTailwindcss,
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
      },
    },
    settings: {
      react: { version: 'detect' },
      'better-tailwindcss': {
        entryPoint: 'src/index.css', // Tailwind v4
      },
      'import-x/resolver-next': [createTypeScriptImportResolver()],
    },
    rules: {
      'react/prop-types': 'off',

      // Tailwind
      'better-tailwindcss/no-conflicting-classes': 'error',
      'better-tailwindcss/no-unknown-classes': 'warn',

      // TypeScript
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'warn',

      // Imports
      'import-x/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import-x/no-cycle': 'error',
      'import-x/no-duplicates': 'error',
      'import-x/no-self-import': 'error',

      // Correctness
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // Maintainability
      complexity: ['warn', 15],
      'max-depth': ['warn', 4],
      'max-params': ['warn', 4],
      'no-nested-ternary': 'warn',

      // Readability
      curly: ['error', 'all'],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
        {
          blankLine: 'always',
          prev: '*',
          next: ['if', 'for', 'while', 'switch', 'try'],
        },
        {
          blankLine: 'always',
          prev: ['if', 'for', 'while', 'switch', 'try'],
          next: '*',
        },
      ],
    },
  },
]);
