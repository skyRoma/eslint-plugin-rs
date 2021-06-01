# custom-eslint-plugin

Contains examples of custom `eslint` rules

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-custom`:

```
$ npm i --save-dev file:./eslint-plugin-custom
```


## Usage

Add `eslint-plugin-custom` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "custom"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "custom/rule-name": 2
    }
}
```

Useful links for creating custom rules:
- https://astexplorer.net/
- https://resources.jointjs.com/demos/rappid/apps/Ast/index.html