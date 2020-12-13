module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: ["custom"],
  rules: {
    "custom/no-template-literals": 2,
    "custom/no-hardcoded-strings": 1,
    "custom/separate-line-for-decorators": 2,
  },
};
