// vite.config.js - CORRECTED @rollup/plugin-node-resolve configuration
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  server: {
    host: true,
  },
  plugins: [
    react(),
    nodeResolve({
      // 'moduleDirectories' should only contain directory names, not paths
      // It defaults to ['node_modules'], so you often don't need to specify it.
      // moduleDirectories: ['node_modules'], // Can omit this as it's default

      // Use 'modulePaths' for absolute paths to search for modules
      modulePaths: [
        path.resolve(__dirname, 'src'), // Add your 'src' directory as a module search path
      ],
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
    // Keep this as Vite's own resolver will use it
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
});