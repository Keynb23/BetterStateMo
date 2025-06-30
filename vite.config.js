import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  server: {
    host: true, // This allows access from other devices on your network
  },
<<<<<<< HEAD
  plugins: [react()],
=======
  plugins: [
    react(),
    nodeResolve({
      modulePaths: [
        path.resolve(__dirname, 'src'), // Add your 'src' directory as a module search path
      ],
      // Explicitly allow these extensions for resolution
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
      // This is a safety measure to prevent it from messing with node_modules
      resolveOnly: [/^(?!.*node_modules).*$/i]
    }),
  ],
>>>>>>> 3270e0e (Commit local changes including removal of SingleServicebtn.jsx and other updates)
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.bin'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});