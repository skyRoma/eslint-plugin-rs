import { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils';

type context = Readonly<TSESLint.RuleContext<string, unknown[]>>;

export const expectRule: TSESLint.RuleModule<string, unknown[]> = {
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
    fixable: 'code',
  },
  create: context => ({
    CallExpression: (node: TSESTree.CallExpression) => {
      const arrowFnIndex = 1;

      if (isTestClosureFn(node, arrowFnIndex)) {
        const body = (
          node.arguments[arrowFnIndex] as TSESTree.ArrowFunctionExpression
        ).body as TSESTree.BlockStatement;

        body.body.forEach((statement, index, statements) => {
          handleStatement(context, statement, index, statements);
        });
      }
    },
  }),
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

function handleStatement(
  context: context,
  statement: TSESTree.Statement,
  index: number,
  statements: TSESTree.Statement[]
) {
  if (isExpectStatement(statement)) {
    const sourceCode = context.getSourceCode();
    const currentStatement = statements[index];
    const prevStatement = statements[index - 1];
    const nextStatement = statements[index + 1];

    if (prevStatement) {
      handleLineBefore(context, sourceCode, currentStatement, prevStatement);
    }

    if (nextStatement) {
      handleLineAfter(context, sourceCode, currentStatement, nextStatement);
    }
  }
}

function isExpectStatement(statement: TSESTree.Statement) {
  if (statement.type === 'ExpressionStatement') {
    const { expression } = statement;

    if (expression.type === 'CallExpression') {
      const { callee } = expression;

      if (callee.type === 'MemberExpression') {
        return checkObject(callee.object as TSESTree.LeftHandSideExpression);
      }
    }
  }

  return false;
}

function handleLineBefore(
  context: context,
  sourceCode: TSESLint.SourceCode,
  currentStatement: TSESTree.Statement,
  prevStatement: TSESTree.Statement
) {
  if (areCommentsBetween(prevStatement, currentStatement, sourceCode)) {
    return;
  }

  if (isLineMissedBefore(currentStatement, prevStatement)) {
    handleMissedLineBefore(context, currentStatement);
  }

  if (isExtraLineBefore(currentStatement, prevStatement)) {
    handleExtraLineBefore(context, currentStatement, prevStatement);
  }
}

function isLineMissedBefore(
  currentStatement: TSESTree.Statement,
  prevStatement: TSESTree.Statement
) {
  return (
    !isExpectStatement(prevStatement) &&
    !isEmptyLineBetween(prevStatement, currentStatement)
  );
}

function handleMissedLineBefore(
  context: context,
  statement: TSESTree.Statement
) {
  context.report({
    node: statement,
    messageId: 'lineBefore',
    fix: function (fixer: TSESLint.RuleFixer) {
      return fixer.insertTextBefore(statement, '\n');
    },
  });
}

function isExtraLineBefore(
  currentStatement: TSESTree.Statement,
  prevStatement: TSESTree.Statement
) {
  return (
    isExpectStatement(prevStatement) &&
    isEmptyLineBetween(prevStatement, currentStatement)
  );
}

function handleExtraLineBefore(
  context: context,
  currentStatement: TSESTree.Statement,
  prevStatement: TSESTree.Statement
) {
  context.report({
    node: currentStatement,
    messageId: 'expectGroup',
    fix: function (fixer: TSESLint.RuleFixer) {
      const prevStatementEnd = prevStatement.range[1];
      const currentStatementStart = currentStatement.range[0];

      return fixer.removeRange([prevStatementEnd, currentStatementStart]);
    },
  });
}

function handleLineAfter(
  context: context,
  sourceCode: TSESLint.SourceCode,
  currentStatement: TSESTree.Statement,
  nextStatement: TSESTree.Statement
) {
  if (areCommentsBetween(currentStatement, nextStatement, sourceCode)) {
    return;
  }

  if (isLineMissedAfter(currentStatement, nextStatement)) {
    handleMissedLineAfter(context, currentStatement);
  }
}

function isLineMissedAfter(
  currentStatement: TSESTree.Statement,
  nextStatement: TSESTree.Statement
) {
  return (
    !isExpectStatement(nextStatement) &&
    !isEmptyLineBetween(currentStatement, nextStatement)
  );
}

function handleMissedLineAfter(
  context: context,
  statement: TSESTree.Statement
) {
  context.report({
    node: statement,
    messageId: 'lineAfter',
    fix: function (fixer: TSESLint.RuleFixer) {
      return fixer.insertTextAfter(statement, '\n');
    },
  });
}

function checkObject(object: TSESTree.LeftHandSideExpression): boolean {
  if (object.type === 'CallExpression') {
    const { callee } = object;

    return callee.type === 'Identifier' && callee.name === 'expect';
  }

  if (object.type === 'MemberExpression') {
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

function isEmptyLineBetween(
  prevStatement: TSESTree.Statement,
  currentStatement: TSESTree.Statement
) {
  const linesDiff = 2;

  return (
    currentStatement.loc.start.line === prevStatement.loc.end.line + linesDiff
  );
}
