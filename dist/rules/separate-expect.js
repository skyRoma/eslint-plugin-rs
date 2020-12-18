"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expectRule = void 0;
exports.expectRule = {
    meta: {
        type: 'layout',
        schema: [],
        messages: {
            lineBefore: "'expect' should be on the separate line. Insert empty line before it",
            lineAfter: "'expect' should be on the separate line. Insert empty line after it",
            expectGroup: "'expect' should not be separate from the 'expect' group",
        },
        fixable: 'code',
    },
    create: context => ({
        CallExpression: (node) => {
            const arrowFnIndex = 1;
            if (isTestClosureFn(node, arrowFnIndex)) {
                const body = node.arguments[arrowFnIndex].body;
                body.body.forEach((statement, index, statements) => {
                    handleStatement(context, statement, index, statements);
                });
            }
        },
    }),
};
function isTestClosureFn(expression, arrowFnIndex) {
    return (expression.type === 'CallExpression' &&
        expression.callee.type === 'Identifier' &&
        expression.callee.name === 'it' &&
        expression.arguments[arrowFnIndex] &&
        expression.arguments[arrowFnIndex].type === 'ArrowFunctionExpression');
}
function handleStatement(context, statement, index, statements) {
    if (isExpectStatement(statement)) {
        handleLineBefore(context, index, statements);
        handleLineAfter(context, index, statements);
    }
}
function isExpectStatement(statement) {
    if (statement.type === 'ExpressionStatement') {
        const { expression } = statement;
        if (expression.type === 'CallExpression') {
            const { callee } = expression;
            if (callee.type === 'MemberExpression') {
                return checkObject(callee.object);
            }
        }
    }
    return false;
}
function handleLineBefore(context, index, statements) {
    const currentStatement = statements[index];
    const prevStatement = statements[index - 1];
    const sourceCode = context.getSourceCode();
    if (isFirstStatementOrCommentsExist(prevStatement, currentStatement, sourceCode)) {
        return;
    }
    if (isLineMissedBefore(currentStatement, prevStatement)) {
        handleMissedLineBefore(context, currentStatement);
    }
    if (isExtraLineBefore(currentStatement, prevStatement)) {
        handleExtraLineBefore(context, currentStatement, prevStatement);
    }
}
function isFirstStatementOrCommentsExist(prevStatement, currentStatement, sourceCode) {
    return (!prevStatement ||
        areCommentsBetween(prevStatement, currentStatement, sourceCode));
}
function isLineMissedBefore(currentStatement, prevStatement) {
    return (!isExpectStatement(prevStatement) &&
        !isEmptyLineBetween(prevStatement, currentStatement));
}
function handleMissedLineBefore(context, statement) {
    context.report({
        node: statement,
        messageId: 'lineBefore',
        fix: function (fixer) {
            return fixer.insertTextBefore(statement, '\n');
        },
    });
}
function isExtraLineBefore(currentStatement, prevStatement) {
    return (isExpectStatement(prevStatement) &&
        isEmptyLineBetween(prevStatement, currentStatement));
}
function handleExtraLineBefore(context, currentStatement, prevStatement) {
    context.report({
        node: currentStatement,
        messageId: 'expectGroup',
        fix: function (fixer) {
            const prevStatementEnd = prevStatement.range[1];
            const currentStatementStart = currentStatement.range[0];
            return fixer.removeRange([prevStatementEnd, currentStatementStart]);
        },
    });
}
function handleLineAfter(context, index, statements) {
    const currentStatement = statements[index];
    const sourceCode = context.getSourceCode();
    if (isLineMissedAfter(index, statements, sourceCode, currentStatement)) {
        handleMissedLineAfter(context, currentStatement);
    }
}
function isLineMissedAfter(currendIndex, satetements, sourceCode, currentStatement) {
    const nextStatement = satetements[currendIndex + 1];
    if (!nextStatement ||
        areCommentsBetween(currentStatement, nextStatement, sourceCode)) {
        return false;
    }
    return (!isExpectStatement(nextStatement) &&
        !isEmptyLineBetween(currentStatement, nextStatement));
}
function handleMissedLineAfter(context, statement) {
    context.report({
        node: statement,
        messageId: 'lineAfter',
        fix: function (fixer) {
            return fixer.insertTextAfter(statement, '\n');
        },
    });
}
function checkObject(object) {
    if (object.type === 'CallExpression') {
        const { callee } = object;
        return callee.type === 'Identifier' && callee.name === 'expect';
    }
    if (object.type === 'MemberExpression') {
        return checkObject(object.object);
    }
    return false;
}
function areCommentsBetween(left, right, sourceCode) {
    return (left.range && right.range && sourceCode.commentsExistBetween(left, right));
}
function isEmptyLineBetween(prevStatement, currentStatement) {
    const linesDiff = 2;
    return (currentStatement.loc.start.line === prevStatement.loc.end.line + linesDiff);
}
