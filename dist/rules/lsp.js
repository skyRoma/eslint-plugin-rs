'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.LSPRule = void 0;
exports.LSPRule = {
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      forbidden:
        'Use of the instanceof together with As operator may violate the LSP principle',
    },
  },
  create: context => ({
    IfStatement: node => {
      if (isInstanceOf(node) && isTypeCast(node)) {
        context.report({ node, messageId: 'forbidden' });
      }
    },
  }),
};

function isInstanceOf({ test }) {
  return test.type === 'BinaryExpression' && test.operator === 'instanceof';
}

function isTypeCast({ consequent }) {
  return (
    consequent.type === 'BlockStatement' &&
    consequent.body[0].type === 'ExpressionStatement' &&
    consequent.body[0].expression.type === 'CallExpression' &&
    consequent.body[0].expression.arguments[0].type === 'TSAsExpression'
  );
}
