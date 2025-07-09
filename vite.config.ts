import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/content.tsx'),
        background: resolve(__dirname, 'src/background.js'),
        styles: resolve(__dirname, 'src/index.css'), // add CSS entry here
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === 'content') return 'content.js';
          if (chunk.name === 'styles') return 'styles.css'; // you can customize output filename
          return '[name].js';
        },
      },
    },
    cssCodeSplit: true,
    emptyOutDir: true,
  },
});
