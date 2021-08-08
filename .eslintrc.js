module.exports = {
  env: {
    browser: true,
    jest: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['rs'],
  rules: {
    'rs/no-template-literals': 'error',
    'rs/no-magic-strings': 'warn',
    'rs/separate-line-for-decorators': 'error',
    'rs/separate-expect-expression(s)': 'error',
    'rs/solid-srp': 'error',
    'rs/solid-ocp': 'warn',
    'rs/solid-lsp': 'error',
    'rs/solid-isp': 'error',
    'rs/solid-dip': 'error',
  },
};
