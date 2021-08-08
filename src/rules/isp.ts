import { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils';

export const ISPRule: TSESLint.RuleModule<string, unknown[]> = {
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      forbidden:
        'Return null in inherited methods may violate the ISP principle',
    },
  },
  create: context => ({
    ClassDeclaration: (node: TSESTree.ClassDeclaration) => {
      if (node.superClass) {
        checkMethodsReturnValue(node, context);
      }
    },
  }),
};

function checkMethodsReturnValue(
  { body }: TSESTree.ClassDeclaration,
  context: Readonly<TSESLint.RuleContext<string, unknown[]>>
) {
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
