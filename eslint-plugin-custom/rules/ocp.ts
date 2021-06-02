import { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils';

export const OCPRule: TSESLint.RuleModule<string, unknown[]> = {
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      forbidden: 'Use of the switch operator may violate the OCP principle',
    },
  },
  create: context => ({
    SwitchStatement: (node: TSESTree.SwitchStatement) => {
      context.report({ node, messageId: 'forbidden' });
    },
  }),
};
