import { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils';

export const decoratorsRule: TSESLint.RuleModule<string, unknown[]> = {
  meta: {
    type: 'layout',
    schema: [],
    messages: { forbidden: 'Decorator must be on a a separate line' },
    fixable: 'code',
  },
  create: context => ({
    ClassProperty: (node: TSESTree.ClassProperty) => {
      if (isDecoratorOnTheSameLine(node)) {
        context.report({
          node,
          messageId: 'forbidden',
          fix: function (fixer: TSESLint.RuleFixer) {
            return fixer.insertTextBefore(node.key, '\n');
          },
        });
      }
    },
  }),
};

function isDecoratorOnTheSameLine(node: TSESTree.ClassProperty) {
  const { decorators } = node;

  return (
    decorators &&
    decorators.some(
      decorator => decorator.loc.start.line === node.key.loc.start.line
    )
  );
}
