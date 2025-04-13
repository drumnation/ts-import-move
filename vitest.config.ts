import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/tests/**'],
    },
    setupFiles: ['./tests/setup.ts'],
    testTimeout: 10000,
  },
});