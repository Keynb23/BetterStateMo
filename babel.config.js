// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }], // Ensure this line is present
  ],
  plugins: [
    // Any other plugins you might have, e'g' for class properties, decorators, etc.
  ],
};