import { TSESLint, TSESTree } from '@typescript-eslint/utils';

export const OCPRule: TSESLint.RuleModule<string, unknown[]> = {
  create: context => ({
    SwitchStatement: (node: TSESTree.SwitchStatement) => {
      context.report({ node, messageId: 'forbidden' });
    },
  }),
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      forbidden: 'Use of the switch operator may violate the OCP principle',
    },
  },
  defaultOptions: [],
};
