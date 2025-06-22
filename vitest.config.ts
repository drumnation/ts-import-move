import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/tests/**'],
    },
    setupFiles: ['./tests/setup.ts'],
    testTimeout: 10000,
    pool: 'forks',
    poolOptions: {
      forks: {
        maxForks: 2,
        minForks: 1
      }
    }
  },
});