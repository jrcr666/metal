/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tsconfigPaths(),
  ],
  // build: {
  //   outDir: 'dist',
  //   emptyOutDir: true,
  //   rollupOptions: {
  //     input: path.resolve(__dirname, 'src/main.tsx'),
  //     output: {
  //       entryFileNames: 'main.js',
  //       format: 'iife',
  //       name: 'MyApp',
  //     },
  //   },
  // },
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
    },
  },

  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@app-types': path.resolve(__dirname, 'src/types'),
    },
  },
  server: {
    port: 5173,
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8000',
    //     changeOrigin: true,
    //     secure: false,
    //     rewrite: path => path.replace(/^\/api/, ''),
    //   },
    //   '/app': {
    //     target: 'http://localhost:8000',
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },
});
