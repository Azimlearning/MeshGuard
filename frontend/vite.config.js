import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
    host: true, // expose to local network so iPhone can access via IP
    proxy: {
      '/status': 'http://localhost:3001',
    },
  },
});
