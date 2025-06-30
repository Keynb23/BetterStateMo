// vite.config.js - With @rollup/plugin-node-resolve
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { nodeResolve } from '@rollup/plugin-node-resolve'; // <<< Import this

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  server: {
    host: true,
  },
  plugins: [
    react(),
    // Add nodeResolve plugin explicitly
    nodeResolve({
      // Tell it to look in these directories for modules
      moduleDirectories: ['node_modules', path.resolve(__dirname, 'src')],
      // Explicitly allow these extensions for resolution
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
      // Only apply resolution to files within our project src and context
      // This is a safety measure to prevent it from messing with node_modules
      resolveOnly: [/^(?!.*node_modules).*$/i]
    }),
  ],
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.bin'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    // You can remove this 'extensions' property if nodeResolve is handling it,
    // but leaving it won't hurt.
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
});