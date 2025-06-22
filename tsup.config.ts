import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/cli-install-rules.ts', 'src/exports.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  outDir: 'dist',
  esbuildOptions: (options) => {
    options.alias = {
      '@': './src'
    };
  },
}); 