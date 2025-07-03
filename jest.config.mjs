// jest.config.mjs
/** @type {import('jest').Config} */
const config = {
  // Specifies the test environment Jest will use. 'jsdom' simulates a browser environment.
  testEnvironment: 'jsdom',

  // Setup files to be run once before all test suites.
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Configuration for transforming files with Babel.
  // Ensures Babel processes JSX, modern JS, and potentially TypeScript files.
  transform: {
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': 'babel-jest',
  },

  // By default, Jest ignores files in node_modules for transformation.
  // Explicitly setting this ensures no unexpected overrides.
  transformIgnorePatterns: ['/node_modules/'],

  // Tells Jest where to find your test files.
  // Fixed: Changed 'ts|tsx' to 'ts,tsx' for correct array syntax.
  testMatch: ['<rootDir>/src/tests/**/*.test.{js,jsx,ts,tsx}'],

  // Mocks modules for certain file types.
  // 'identity-obj-proxy' handles CSS imports (Vite generates unique class names).
  // The fileMock.js handles image/asset imports.
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg|webp|avif)$': '<rootDir>/__mocks__/fileMock.js',
  },
  // Specify file extensions Jest should look for when resolving modules.
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  // If you use absolute imports from 'src' (e.g., import MyComponent from '@/components/MyComponent'),
  // you might need to uncomment and configure modulePaths to help Jest resolve them.
  // modulePaths: ['<rootDir>/src'],
};

export default config;
