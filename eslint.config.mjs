import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['src/lib/db/migrate.ts', 'src/lib/db/seed.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    ignores: [
      '.next/**',
      'drizzle/**',
      'coverage/**',
      'playwright-report/**',
      'node_modules/**',
      'next-env.d.ts',
    ],
  },
];

export default eslintConfig;
