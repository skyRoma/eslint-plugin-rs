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
      if (
        node.decorators.some(
          (decorator) => decorator.loc.start.line === node.key.loc.start.line
        )
      ) {
        context.report(node, "Decorator must be on a separate line");
      }
    },
  }),
};
