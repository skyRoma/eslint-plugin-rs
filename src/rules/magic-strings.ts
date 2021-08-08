import { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils';

export const magicStringsRule: TSESLint.RuleModule<string, unknown[]> = {
  meta: {
    type: 'suggestion',
    schema: [],
    messages: { forbidden: 'Do not use magic strings' },
  },
  create: context => ({
    CallExpression: (node: TSESTree.CallExpression) => {
      if (node.arguments.some(arg => arg.type === 'Literal' && arg.value)) {
        context.report({ node, messageId: 'forbidden' });
      }
    },
  }),
};
