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
if (typeof globalThis.crypto === 'undefined' || typeof globalThis.crypto.webcrypto === 'undefined') {
  try {
    // Node.js 15+ has webcrypto built-in in the 'crypto' module
    const { webcrypto } = require('crypto');
    globalThis.crypto = webcrypto;
  } catch (e) {
    // Fallback or warning if crypto.webcrypto is not available
    console.warn("webcrypto is not available, some Firebase functions might not work. Error:", e.message);
  }
}

// Ensure you keep this line for @testing-library/jest-dom setup
import '@testing-library/jest-dom';