import { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils';

export const LSPRule: TSESLint.RuleModule<string, unknown[]> = {
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      forbidden:
        'Use of the instanceof together with As operator may violate the LSP principle',
    },
  },
  create: context => ({
    IfStatement: (node: TSESTree.IfStatement) => {
      if (isInstanceOf(node) && isTypeCast(node)) {
        context.report({ node, messageId: 'forbidden' });
      }
    },
  }),
};

function isInstanceOf({ test }: TSESTree.IfStatement) {
  return test.type === 'BinaryExpression' && test.operator === 'instanceof';
}

function isTypeCast({ consequent }: TSESTree.IfStatement) {
  return (
    consequent.type === 'BlockStatement' &&
    consequent.body[0].type === 'ExpressionStatement' &&
    consequent.body[0].expression.type === 'CallExpression' &&
    consequent.body[0].expression.arguments[0].type === 'TSAsExpression'
  );
}
