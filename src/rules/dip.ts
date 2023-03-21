import { TSESLint, TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils';

export const DIPRule: TSESLint.RuleModule<string, unknown[]> = {
  create: context => ({
    Program: (node: TSESTree.Program) => {
      node.body.forEach(item => {
        if (item.type === AST_NODE_TYPES.ClassDeclaration) {
          item.body.body.forEach(i => {
            if (
              i.type === AST_NODE_TYPES.PropertyDefinition &&
              i.typeAnnotation?.typeAnnotation.type ===
                AST_NODE_TYPES.TSTypeReference &&
              i.typeAnnotation?.typeAnnotation.typeName.type ===
                AST_NODE_TYPES.Identifier
            ) {
              const { name } = i.typeAnnotation?.typeAnnotation.typeName;

              if (isClassName(node, name)) {
                context.report({
                  node: i.typeAnnotation?.typeAnnotation,
                  messageId: 'forbidden',
                });
              }
            }
          });
        }
      });
    },
  }),
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      forbidden:
        'using classes without referring an interface may violate the DIP principle',
    },
  },
  defaultOptions: [],
};

function isClassName(node: TSESTree.Program, typeName: string) {
  return node.body.some(
    item =>
      item.type === AST_NODE_TYPES.ClassDeclaration &&
      item.id?.name === typeName
  );
}
