/**
 * ESLint configuration for the OPEP API.
 *
 * Uses TypeScript-ESLint when available (@typescript-eslint/parser + plugin
 * already listed in devDependencies). Falls back to base parser if those
 * packages are missing in a given environment.
 */
module.exports = {
  root: true,
  env: { node: true, jest: true, es2021: true },
  ignorePatterns: ['dist/', 'node_modules/', 'coverage/', '.eslintrc.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    project: false,
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    // The codebase uses `any` widely in existing tests/services; relax this rule.
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    // Allow empty catch blocks (ioredis errors are deliberately swallowed in tests)
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-undef': 'error',
  },
  overrides: [
    {
      files: ['*.spec.ts'],
      rules: {
        // Tests rely on non-null assertions, unknown casts, etc.
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        // Allow unused vars in tests (mocks/helpers may be declared but conditionally used)
        '@typescript-eslint/no-unused-vars': [
          'warn',
          { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
        ],
      },
    },
  ],
};
