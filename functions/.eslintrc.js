// C:\Users\keynb\OneDrive\Desktop\Coding\Projects\Business\BetterStateMo\BetterStateMo-5\functions\.eslintrc.js

module.exports = {
  root: true, // This ensures ESLint stops looking for configs in parent directories
  env: {
    es6: true,
    node: true, // Explicitly tells ESLint this is a Node.js environment
  },
  parserOptions: {
    ecmaVersion: 2020, // Supports modern JS features like async/await
    sourceType: "script", // Indicates CommonJS modules (the default for Node.js)
  },
  extends: [
    "eslint:recommended",
    "google", // Google's JavaScript style guide
  ],
  rules: {
    // Override/add specific rules here
    "no-restricted-globals": ["error", "name", "length"], // Keeps original rules but might be too strict
    "prefer-arrow-callback": "error",
    "quotes": ["error", "double", {"allowTemplateLiterals": true}],

    // Relax specific rules that might conflict with common Cloud Functions patterns
    "require-jsdoc": "off", // Often too verbose for simple functions
    "valid-jsdoc": "off",   // Related to require-jsdoc
    "indent": ["error", 2], // Enforce 2-space indentation (consistent with Google style)
    "max-len": ["warn", { "code": 100, "ignoreUrls": true }], // Warn on long lines
    "no-trailing-spaces": "error",
    "semi": ["error", "always"], // Enforce semicolons

    // Ensure 'no-undef' is handled by 'env: node' (shouldn't need explicit 'off' here)
    // If you *still* get 'no-undef' for module/require/exports after this,
    // it implies a very unusual setup, and you might need the globals below
    // as a last resort, but it's not ideal.
  },
  // If the above doesn't work, you can force these as globals, but `env: node` is preferred.
  globals: {
    module: "writable", // Changed from "readonly" to "writable" if you assign to it
    require: "readonly",
    exports: "writable",
  },
};