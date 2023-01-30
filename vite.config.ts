import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, './src'),
    },
  },
  css: {
    modules: {
      generateScopedName: '[hash:base64:5]',
      localsConvention: 'camelCase',
    },
  },
});
