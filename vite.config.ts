
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Đảm bảo process.env không gây lỗi ReferenceError trên trình duyệt
    'process.env': {
      API_KEY: JSON.stringify(process.env.API_KEY || '')
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
});
