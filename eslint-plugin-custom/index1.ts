import * as t from "@babel/types";

const rules = {
  "no-template-literals": (context) => ({
    ClassProperty: (node: t.ClassProperty) => {
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
