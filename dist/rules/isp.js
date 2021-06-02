'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ISPRule = void 0;
exports.ISPRule = {
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      forbidden:
        'Return null in inherited methods may violate the ISP principle',
    },
  },
  create: context => ({
    ClassDeclaration: node => {
      if (node.superClass) {
        checkMethodsReturnValue(node, context);
      }
    },
  }),
};

function checkMethodsReturnValue({ body }, context) {
  return body.body.forEach(item => {
    if (
      item.type === 'MethodDefinition' &&
      item.value.body?.body.some(
        i =>
          i.type === 'ReturnStatement' &&
          i.argument?.type === 'Literal' &&
          i.argument?.value === null
      )
    ) {
      context.report({ node: item, messageId: 'forbidden' });
    }
  });
}
