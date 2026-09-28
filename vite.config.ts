import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    proxy: {
      '/green-api': {
        target: 'https://3100.api.green-api.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/green-api/, ''),
        secure: true,
      },
    },
  },
});
