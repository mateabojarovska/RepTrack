import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    // Requests to /api go to the backend, so the frontend and the API share one address
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
