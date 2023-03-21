import { TSESLint, TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils';

export const ISPRule: TSESLint.RuleModule<string, unknown[]> = {
  create: context => ({
    ClassDeclaration: (node: TSESTree.ClassDeclaration) => {
      if (node.superClass) {
        checkMethodsReturnValue(node, context);
      }
    },
  }),
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      forbidden:
        'Return null in inherited methods may violate the ISP principle',
    },
  },
  defaultOptions: [],
};

function checkMethodsReturnValue(
  { body }: TSESTree.ClassDeclaration,
  context: Readonly<TSESLint.RuleContext<string, unknown[]>>
) {
  return body.body.forEach(item => {
    if (
      item.type === AST_NODE_TYPES.MethodDefinition &&
      item.value.body?.body.some(
        i =>
          i.type === AST_NODE_TYPES.ReturnStatement &&
          i.argument?.type === AST_NODE_TYPES.Literal &&
          i.argument?.value === null
      )
    ) {
      context.report({ node: item, messageId: 'forbidden' });
    }
  });
}
