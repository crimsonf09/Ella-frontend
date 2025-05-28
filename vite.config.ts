import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'),
        content: resolve(__dirname, 'src/content.tsx'),
        // Add promptBox entry here for your React component lib bundle
        promptBox: resolve(__dirname, 'src/components/promptBox.tsx'),
      },
      output: {
        // Output different filenames
        entryFileNames: chunk => {
          if (chunk.name === 'content') return 'content.js';
          if (chunk.name === 'promptBox') return 'prompt-box.umd.js';
          return '[name].js';
        },
        // Force UMD format for promptBox bundle only:
        // You can handle this in a separate build or by using manual chunks,
        // but to keep it simple, let's split build into 2 steps later.
      },
    },
    emptyOutDir: true,
  },
});
