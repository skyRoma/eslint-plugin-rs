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
    "custom/no-template-literals": "error",
    "custom/no-hardcoded-strings": "warn",
    "custom/separate-line-for-decorators": "error",
    "custom/separated-expect-expresion(s)": "error",
  },
};
