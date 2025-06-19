// jest.setup.js

// This line directly polyfills `global.fetch` and related globals (`Request`, `Response`, `Headers`)
// It's designed to be compatible with Node.js's CommonJS environment.
require('cross-fetch/polyfill');

// Polyfill globalThis.self for libraries that expect a window-like global object
if (typeof globalThis.self === 'undefined') {
  globalThis.self = globalThis;
}

// Polyfill globalThis.crypto.webcrypto if it's not natively available in the Node.js version
// This is often needed by Firebase SDKs.
// Note: Node.js 15+ has webcrypto built-in. This is primarily for older Node.js versions or specific environments.
if (typeof globalThis.crypto === 'undefined' || typeof globalThis.crypto.webcrypto === 'undefined') {
  try {
    const { webcrypto } = require('crypto');
    // For older Node.js versions, webcrypto might be nested differently.
    // Ensure `globalThis.crypto` provides a `getRandomValues` method if Firebase relies on it.
    globalThis.crypto = webcrypto;
  } catch (e) {
    console.warn("webcrypto is not natively available via Node.js 'crypto' module. Some Firebase functions might not work without a polyfill. Error:", e.message);
  }
}

// Ensure you keep this line for @testing-library/jest-dom setup
// CHANGED: Converted from 'import' to 'require' to resolve module loading issue
require('@testing-library/jest-dom');