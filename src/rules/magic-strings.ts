import { TSESLint, TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils';

export const magicStringsRule: TSESLint.RuleModule<string, unknown[]> = {
  create: context => ({
    CallExpression: (node: TSESTree.CallExpression) => {
      if (
        node.arguments.some(
          arg => arg.type === AST_NODE_TYPES.Literal && arg.value
        )
      ) {
        context.report({ node, messageId: 'forbidden' });
      }
    },
  }),
  meta: {
    type: 'suggestion',
    schema: [],
    messages: { forbidden: 'Do not use magic strings' },
  },
  defaultOptions: [],
};
