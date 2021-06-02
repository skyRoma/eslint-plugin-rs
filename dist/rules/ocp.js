'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.OCPRule = void 0;
exports.OCPRule = {
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      forbidden: 'Use of the switch operator may violate the OCP principle',
    },
  },
  create: context => ({
    SwitchStatement: node => {
      context.report({ node, messageId: 'forbidden' });
    },
  }),
};
