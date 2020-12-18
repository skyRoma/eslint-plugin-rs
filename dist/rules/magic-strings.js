"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.magicStringsRule = void 0;
exports.magicStringsRule = {
    meta: {
        type: 'suggestion',
        schema: [],
        messages: { forbidden: 'Do not use magic strings' },
        fixable: 'code',
    },
    create: context => ({
        CallExpression: (node) => {
            if (node.arguments.some(arg => arg.type === 'Literal' && arg.value)) {
                context.report({ node, messageId: 'forbidden' });
            }
        },
    }),
};
