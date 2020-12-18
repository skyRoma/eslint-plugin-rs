"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateLiteralsRule = void 0;
exports.templateLiteralsRule = {
    meta: {
        type: 'suggestion',
        schema: [],
        messages: { forbidden: 'Do not use template literals' },
        fixable: 'code',
    },
    create: context => ({
        TemplateLiteral: (node) => {
            context.report({ node, messageId: 'forbidden' });
        },
    }),
};
