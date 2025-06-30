import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// These are needed for __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  server: {
    host: true, // This allows access from other devices on your network
  },
  // Define plugins only once
  plugins: [
    react(), // This is the React plugin
    // Remove nodeResolve unless you specifically need it and install/configure it correctly.
    // Vite handles module resolution for your source files and node_modules by default.
  ],
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.bin'],
  resolve: {
    alias: {
      // This is generally all you need for absolute imports from src
      '@': path.resolve(__dirname, 'src'),
    },
    // Vite's default resolution usually covers common extensions.
    // You only need to explicitly list them if you have unusual file types
    // or specific resolution requirements not met by default.
    // If you add this, ensure it's inside the 'resolve' object, not outside.
    // extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
});