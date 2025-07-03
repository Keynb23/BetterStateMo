// babel.config.js
// This file uses CommonJS syntax (module.exports) because Babel's
// configuration loading mechanism, when used by babel-jest,
// often expects this format even in ES Module projects.
const babelConfig = {
  presets: [
    // Preset for compiling modern JavaScript into a compatible version
    // based on your target environments (e.g., browserlist config).
    // 'node: "current"' targets the current Node.js version Jest runs on.
    ['@babel/preset-env', { targets: { node: 'current' } }],
    // Preset for React, enabling JSX transformation.
    // 'runtime: automatic' is for React 17+ and automatically imports
    // the necessary JSX runtime functions, so you don't need 'import React from "react";'
    // in every file that uses JSX.
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
};

module.exports = babelConfig; // Must use module.exports for babel.config.js
