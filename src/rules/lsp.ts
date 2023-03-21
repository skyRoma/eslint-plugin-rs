import { TSESLint, TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils';

export const LSPRule: TSESLint.RuleModule<string, unknown[]> = {
  create: context => ({
    IfStatement: (node: TSESTree.IfStatement) => {
      if (isInstanceOf(node) && isTypeCast(node)) {
        context.report({ node, messageId: 'forbidden' });
      }
    },
  }),
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      forbidden:
        'Use of the instanceof together with As operator may violate the LSP principle',
    },
  },
  defaultOptions: [],
};

function isInstanceOf({ test }: TSESTree.IfStatement) {
  return (
    test.type === AST_NODE_TYPES.BinaryExpression &&
    test.operator === 'instanceof'
  );
}

function isTypeCast({ consequent }: TSESTree.IfStatement) {
  return (
    consequent.type === AST_NODE_TYPES.BlockStatement &&
    consequent.body[0].type === AST_NODE_TYPES.ExpressionStatement &&
    consequent.body[0].expression.type === AST_NODE_TYPES.CallExpression &&
    consequent.body[0].expression.arguments[0].type ===
      AST_NODE_TYPES.TSAsExpression
  );
}
