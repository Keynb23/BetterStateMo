// esLint.config.mjs
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import pluginJest from 'eslint-plugin-jest';

export default [
  { ignores: ['dist'] },

  // Node.js override for functions, mocks, and setOwnerClaim folders
  {
    files: [
      'functions/**/*.js',
      '__mocks__/**/*.js',
      'setOwnerClaim/**/*.js',
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'commonjs',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      indent: ['error', 2],
      quotes: ['error', 'double', { allowTemplateLiterals: true }],
      semi: ['error', 'always'],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
    },
  },

  // Jest specific configurations (for your test files)
  {
    files: ['**/*.test.js', '**/*.test.jsx'],
    plugins: {
      jest: pluginJest,
    },
    languageOptions: {
      globals: {
        ...globals.jest,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...pluginJest.configs.recommended.rules,
      'no-unused-vars': 'off',
    },
  },

  // React/browser config (keep this after the Node override)
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        __initial_auth_token: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': 'off', // <-- MODIFIED: Changed from ['warn', { allowConstantExport: true }] to 'off'
      quotes: 'off',
      semi: 'off',
    },
  },

  // General recommended rules (apply them to the whole project first, or carefully at the end)
  js.configs.recommended,
];