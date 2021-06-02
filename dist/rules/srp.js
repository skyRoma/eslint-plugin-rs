'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.SRPRule = void 0;
exports.SRPRule = {
  meta: {
    type: 'suggestion',
    schema: [],
    messages: { forbidden: 'Do not use any logic in the model definition' },
  },
  create: context => ({
    ClassDeclaration: node => {
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

function isModelDefinition(node) {
  return node.id?.name.includes('Model');
}
