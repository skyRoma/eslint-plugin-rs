import { TSESLint, TSESTree } from '@typescript-eslint/utils';

export const templateLiteralsRule: TSESLint.RuleModule<string, unknown[]> = {
  create: context => ({
    TemplateLiteral: (node: TSESTree.TemplateLiteral) => {
      context.report({ node, messageId: 'forbidden' });
    },
  }),
  meta: {
    type: 'suggestion',
    schema: [],
    messages: { forbidden: 'Do not use template literals' },
  },
  defaultOptions: [],
};
