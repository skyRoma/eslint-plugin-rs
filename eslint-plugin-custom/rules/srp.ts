import { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils';

export const SRPRule: TSESLint.RuleModule<string, unknown[]> = {
  meta: {
    type: 'suggestion',
    schema: [],
    messages: { forbidden: 'Do not use any logic in the model definition' },
  },
  create: context => ({
    ClassDeclaration: (node: TSESTree.ClassDeclaration) => {
      if (isModelDefinition(node)) {
        node.body.body.forEach(element => {
          if (element.type === 'MethodDefinition') {
            context.report({ node: element, messageId: 'forbidden' });
          }
        });
      }
    },
  }),
};

function isModelDefinition(node: TSESTree.ClassDeclaration) {
  return node.id?.name.includes('Model');
}
