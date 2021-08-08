# eslint-plugin-rs

Contains `eslint` rules for tests and decorators

## Installation

Run the following command to install `eslint-plugin-rs`:

```
$ npm i --save-dev eslint-plugin-rs
```

## Usage

Add `eslint-plugin-rs` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```js
{
  plugins: ['rs'],
}
```

Then configure the rules you want to use under the rules section:

```js
{
    "rules": {
      'rs/separate-line-for-decorators': 'error',
      'rs/separate-expect-expression(s)': 'error',
    }
}
```

Useful links for creating custom rules:
- https://astexplorer.net/
- https://resources.jointjs.com/demos/rappid/apps/Ast/index.html
