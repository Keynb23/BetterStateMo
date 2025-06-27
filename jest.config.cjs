// jest.config.cjs
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

  // Tells Jest where to find your test files.
  testMatch: ['<rootDir>/src/tests/**/*.test.{js,jsx,ts,tsx}'],

  // Mocks modules for certain file types.
  // 'identity-obj-proxy' handles CSS imports (Vite generates unique class names).
  // The fileMock.js handles image/asset imports.
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg|webp|avif)$': '<rootDir>/__mocks__/fileMock.js', // Added more image types
  },
};

module.exports = config;
