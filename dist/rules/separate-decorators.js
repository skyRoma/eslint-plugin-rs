"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decoratorsRule = void 0;
exports.decoratorsRule = {
    meta: {
        type: 'layout',
        schema: [],
        messages: { forbidden: 'Decorator must be on a a separate line' },
        fixable: 'code',
    },
    create: context => ({
        ClassProperty: (node) => {
            if (isDecoratorOnTheSameLine(node)) {
                context.report({
                    node,
                    messageId: 'forbidden',
                    fix: function (fixer) {
                        return fixer.insertTextBefore(node.key, '\n');
                    },
                });
            }
        },
    }),
};
function isDecoratorOnTheSameLine(node) {
    const { decorators } = node;
    return (decorators &&
        decorators.some(decorator => decorator.loc.start.line === node.key.loc.start.line));
}
