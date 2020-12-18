import { TSESTree, TSESLint } from '@typescript-eslint/experimental-utils';

export const rules: Record<string, TSESLint.RuleModule<string, unknown[]>> = {
  'no-template-literals': {
    meta: {
      type: 'suggestion',
      schema: [],
      messages: { forbidden: 'Do not use template literals' },
    },
    create: context => ({
      TemplateLiteral: (node: TSESTree.TemplateLiteral) => {
        context.report({ node, messageId: 'forbidden' });
      },
    }),
  },
  'no-hardcoded-strings': {
    meta: {
      type: 'suggestion',
      schema: [],
      messages: { forbidden: 'Do not use hardcoded strings' },
    },
    create: context => ({
      CallExpression: (node: TSESTree.CallExpression) => {
        if (node.arguments.some(arg => arg.type === 'Literal' && arg.value)) {
          context.report({ node, messageId: 'forbidden' });
        }
      },
    }),
  },
  'separate-line-for-decorators': {
    meta: {
      type: 'layout',
      schema: [],
      messages: { forbidden: 'Decorator must be on a a separate line' },
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
  },
  'separate-expect-expresion(s)': {
    meta: {
      type: 'layout',
      schema: [],
      messages: {
        lineBefore:
          "'expect' should be on the separate line. Insert empty line before it",
        lineAfter:
          "'expect' should be on the separate line. Insert empty line after it",
        expectGroup: "'expect' should not be separate from the 'expect' group",
      },
    },
    create: context => ({
      CallExpression: (node: TSESTree.CallExpression) => {
        const sourceCode = context.getSourceCode();
        const arrowFnIndex = 1;
        if (isTestClosureFn(node, arrowFnIndex)) {
          const body = (node.arguments[
            arrowFnIndex
          ] as TSESTree.ArrowFunctionExpression)
            .body as TSESTree.BlockStatement;
          body.body.forEach((statement, index, body) => {
            if (isExpectStatement(statement)) {
              if (isLineMissedBefore(index, body, sourceCode)) {
                context.report({
                  node: statement,
                  messageId: 'lineBefore',
                  fix: function (fixer: TSESLint.RuleFixer) {
                    return fixer.insertTextBefore(statement, '\n');
                  },
                });
              }

              if (isLineMissedAfter(index, body, sourceCode)) {
                context.report({
                  node: statement,
                  messageId: 'lineAfter',
                  fix: function (fixer: TSESLint.RuleFixer) {
                    return fixer.insertTextAfter(statement, '\n');
                  },
                });
              }

              if (isExtraLineBefore(index, body, sourceCode)) {
                context.report({
                  node: statement,
                  messageId: 'expectGroup',
                  fix: function (fixer: TSESLint.RuleFixer) {
                    const prevStatementEnd = body[index - 1].range[1];
                    const currentStatementStart = statement.range[0];

                    return fixer.removeRange([
                      prevStatementEnd,
                      currentStatementStart,
                    ]);
                  },
                });
              }
            }
          });
        }
      },
    }),
  },
};

function isTestClosureFn(
  expression: TSESTree.CallExpression,
  arrowFnIndex: number
) {
  return (
    expression.type === 'CallExpression' &&
    expression.callee.type === 'Identifier' &&
    expression.callee.name === 'it' &&
    expression.arguments[arrowFnIndex] &&
    expression.arguments[arrowFnIndex].type === 'ArrowFunctionExpression'
  );
}

function isDecoratorOnTheSameLine(node: TSESTree.ClassProperty) {
  const { decorators } = node;

  return (
    decorators &&
    decorators.some(
      decorator => decorator.loc.start.line === node.key.loc.start.line
    )
  );
}

function isLineMissedBefore(
  currendIndex: number,
  body: TSESTree.Statement[],
  sourceCode: TSESLint.SourceCode
) {
  const currentStatement = body[currendIndex];
  const prevStatement = body[currendIndex - 1];
  if (
    isFirstStatementOrCommentsExist(
      currendIndex,
      prevStatement,
      currentStatement,
      sourceCode
    )
  ) {
    return false;
  }

  if (
    !isExpectStatement(prevStatement) &&
    currentStatement.loc.start.line !== prevStatement.loc.end.line + 2
  ) {
    return true;
  }

  return false;
}

function isLineMissedAfter(
  currendIndex: number,
  body: TSESTree.Statement[],
  sourceCode: TSESLint.SourceCode
) {
  const currentStatement = body[currendIndex];
  const nextStatement = body[currendIndex + 1];
  if (
    currendIndex === body.length - 1 ||
    areCommentsBetween(currentStatement, nextStatement, sourceCode)
  ) {
    return false;
  }

  if (
    !isExpectStatement(nextStatement) &&
    currentStatement.loc.end.line !== nextStatement.loc.start.line - 2
  ) {
    return true;
  }

  return false;
}

function isExtraLineBefore(
  currendIndex: number,
  body: TSESTree.Statement[],
  sourceCode: TSESLint.SourceCode
) {
  const currentStatement = body[currendIndex];
  const prevStatement = body[currendIndex - 1];
  if (
    isFirstStatementOrCommentsExist(
      currendIndex,
      prevStatement,
      currentStatement,
      sourceCode
    )
  ) {
    return false;
  }

  if (
    isExpectStatement(prevStatement) &&
    currentStatement.loc.start.line === prevStatement.loc.end.line + 2
  ) {
    return true;
  }

  return false;
}

function isFirstStatementOrCommentsExist(
  currendIndex: number,
  prevStatement: TSESTree.Statement,
  currentStatement: TSESTree.Statement,
  sourceCode: TSESLint.SourceCode
) {
  return (
    currendIndex === 0 ||
    areCommentsBetween(prevStatement, currentStatement, sourceCode)
  );
}

function isExpectStatement(statement: TSESTree.Statement) {
  if (statement.type === 'ExpressionStatement') {
    const { expression } = statement;

    if (expression.type === 'CallExpression') {
      const { callee } = expression;

      if (callee.type === 'MemberExpression') {
        return checkObject(
          callee.object as TSESTree.CallExpression | TSESTree.MemberExpression
        );
      }
    }
  }

  return false;
}

function checkObject(
  object: TSESTree.CallExpression | TSESTree.MemberExpression
): boolean {
  if (object.type === 'CallExpression') {
    const { callee } = object;

    return callee.type === 'Identifier' && callee.name === 'expect';
  }

  if (object.object) {
    return checkObject(
      object.object as TSESTree.CallExpression | TSESTree.MemberExpression
    );
  }

  return false;
}

function areCommentsBetween(
  left: TSESTree.Statement,
  right: TSESTree.Statement,
  sourceCode: TSESLint.SourceCode
) {
  return (
    left.range && right.range && sourceCode.commentsExistBetween(left, right)
  );
}
