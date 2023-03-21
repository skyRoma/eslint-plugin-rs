import { TSESLint, TSESTree } from '@typescript-eslint/utils';

export const decoratorsRule: TSESLint.RuleModule<string, unknown[]> = {
  create: context => ({
    PropertyDefinition: (node: TSESTree.PropertyDefinition) => {
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
  meta: {
    type: 'layout',
    schema: [],
    messages: { forbidden: 'Decorator must be on a a separate line' },
    fixable: 'code',
  },
  defaultOptions: [],
};

function isDecoratorOnTheSameLine(node: TSESTree.PropertyDefinition) {
  const { decorators } = node;

  return (
    decorators &&
    decorators.some(
      decorator => decorator.loc.start.line === node.key.loc.start.line
    )
  );
}
