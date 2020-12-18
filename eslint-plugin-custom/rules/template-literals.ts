import { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils';

export const templateLiteralsRule: TSESLint.RuleModule<string, unknown[]> = {
  meta: {
    type: 'suggestion',
    schema: [],
    messages: { forbidden: 'Do not use template literals' },
    fixable: 'code',
  },
  create: context => ({
    TemplateLiteral: (node: TSESTree.TemplateLiteral) => {
      context.report({ node, messageId: 'forbidden' });
    },
  }),
};
