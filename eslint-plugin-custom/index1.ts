import { Statement } from "@babel/types";
import { SourceCode } from "eslint";

module.exports.rules = {
  "no-template-literals": (context) => ({
    TemplateLiteral: (node) => {
      context.report(node, "Do not use template literals");
    },
  }),
  "no-hardcoded-strings": (context) => ({
    CallExpression: (node) => {
      if (node.arguments.some((arg) => arg.type === "Literal" && arg.value)) {
        context.report(node, "Do not use hardcoded strings");
      }
    },
  }),
  "separate-line-for-decorators": (context) => ({
    ClassProperty: (node) => {
      if (isDecoratorOnTheSameLine(node)) {
        context.report({
          node,
          message: "Decorator must be on a a separate line",
          fix: function (fixer) {
            return fixer.insertTextBefore(node.key, "\n");
          },
        });
      }
    },
  }),
  "separated-expect-expresion(s)": (context) => ({
    ExpressionStatement: (node) => {
      const sourceCode: SourceCode = context.getSourceCode();
      const { expression } = node;
      const arrowFnIndex = 1;
      if (isTestClosureFn(expression, arrowFnIndex)) {
        let { body } = expression.arguments[arrowFnIndex];
        body.body.forEach((statement, index, body) => {
          if (isExpectStatement(statement)) {
            if (isLineMissedBefore(index, body, sourceCode)) {
              context.report({
                node: statement,
                message:
                  "'expect' should be on the separate line. Insert empty line before it",
                fix: function (fixer) {
                  return fixer.insertTextBefore(statement, "\n");
                },
              });
            }
            if (isLineMissedAfter(index, body, sourceCode)) {
              context.report({
                node: statement,
                message:
                  "'expect' should be on the separate line. Insert empty line after it",
                fix: function (fixer) {
                  return fixer.insertTextAfter(statement, "\n");
                },
              });
            }
            if (isExtraLineBefore(index, body, sourceCode)) {
              context.report({
                node: statement,
                message:
                  "'expect' should not be separate from the 'expect' group",
                fix: function (fixer) {
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
};

function isTestClosureFn(expression, arrowFnIndex) {
  return (
    expression.type === "CallExpression" &&
    expression.callee.type === "Identifier" &&
    expression.callee.name === "it" &&
    expression.arguments[arrowFnIndex] &&
    expression.arguments[arrowFnIndex].type === "ArrowFunctionExpression"
  );
}

function isDecoratorOnTheSameLine(node) {
  const { decorators } = node;

  return (
    decorators &&
    decorators.some(
      (decorator) => decorator.loc.start.line === node.key.loc.start.line
    )
  );
}

function isLineMissedBefore(currendIndex, body, sourceCode) {
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
}

function isLineMissedAfter(currendIndex, body, sourceCode) {
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
}

function isExtraLineBefore(currendIndex, body, sourceCode) {
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
}

function isFirstStatementOrCommentsExist(
  currendIndex,
  prevStatement,
  currentStatement,
  sourceCode
) {
  return (
    currendIndex === 0 ||
    areCommentsBetween(prevStatement, currentStatement, sourceCode)
  );
}

function isExpectStatement(statement: Statement) {
  if (statement.type === "ExpressionStatement") {
    const { expression } = statement;

    if (expression.type === "CallExpression") {
      const { callee } = expression;

      if (callee.type === "MemberExpression") {
        return checkObject(callee.object);
      }
    }
  }
}

function checkObject(object) {
  if (object.type === "CallExpression") {
    const { callee } = object;

    return callee.type === "Identifier" && callee.name === "expect";
  }
  if (object.object) {
    return checkObject(object.object);
  }
  return false;
}

function areCommentsBetween(left, right, sourceCode) {
  return (
    left.range && right.range && sourceCode.commentsExistBetween(left, right)
  );
}
