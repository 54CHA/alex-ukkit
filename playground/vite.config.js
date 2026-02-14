import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@ui-kit': path.resolve(__dirname, '..'),
    },
    // Force all bare imports from ui-kit components to resolve from playground/node_modules
    dedupe: ['react', 'react-dom', 'clsx', 'sonner', '@phosphor-icons/react', 'motion', 'motion/react'],
  },
  // Allow Vite to process files outside the playground root (the parent ui-kit directory)
  server: {
    fs: { allow: [path.resolve(__dirname, '..')] },
  },
});
