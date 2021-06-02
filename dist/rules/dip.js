'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.DIPRule = void 0;
exports.DIPRule = {
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      forbidden:
        'using classes without referring an interface may violate the DIP principle',
    },
  },
  create: context => ({
    Program: node => {
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

function isClassName(node, typeName) {
  return node.body.some(
    item => item.type === 'ClassDeclaration' && item.id?.name === typeName
  );
}
