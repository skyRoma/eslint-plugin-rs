import { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils';

export const DIPRule: TSESLint.RuleModule<string, unknown[]> = {
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      forbidden:
        'using classes without referring an interface may violate the DIP principle',
    },
  },
  create: context => ({
    Program: (node: TSESTree.Program) => {
      node.body.forEach(item => {
        if (item.type === 'ClassDeclaration') {
          item.body.body.forEach(i => {
            if (
              i.type === 'ClassProperty' &&
              i.typeAnnotation?.typeAnnotation.type === 'TSTypeReference' &&
              i.typeAnnotation?.typeAnnotation.typeName.type === 'Identifier'
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
};

function isClassName(node: TSESTree.Program, typeName: string) {
  return node.body.some(
    item => item.type === 'ClassDeclaration' && item.id?.name === typeName
  );
}
