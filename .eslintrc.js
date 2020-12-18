module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: ['@typescript-eslint', 'custom'],
  rules: {
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: 'block-like', next: 'block-like' },
    ],
    'custom/no-template-literals': 'error',
    'custom/no-magic-strings': 'warn',
    'custom/separate-line-for-decorators': 'error',
    'custom/separate-expect-expresion(s)': 'error',
  },
};
