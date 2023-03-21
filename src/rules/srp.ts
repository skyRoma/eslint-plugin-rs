import { TSESLint, TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils';

export const SRPRule: TSESLint.RuleModule<string, unknown[]> = {
  create: context => ({
    ClassDeclaration: (node: TSESTree.ClassDeclaration) => {
      if (isModelDefinition(node)) {
        node.body.body.forEach(element => {
          if (element.type === AST_NODE_TYPES.MethodDefinition) {
            context.report({ node: element, messageId: 'forbidden' });
          }
        });
      }
    },
  }),
  meta: {
    type: 'suggestion',
    schema: [],
    messages: { forbidden: 'Do not use any logic in the model definition' },
  },
  defaultOptions: [],
};

function isModelDefinition(node: TSESTree.ClassDeclaration) {
  return node.id?.name.includes('Model');
}
