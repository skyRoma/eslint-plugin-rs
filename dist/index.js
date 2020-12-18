"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rules = void 0;
const rules_1 = require("./rules");
exports.rules = {
    'no-template-literals': rules_1.templateLiteralsRule,
    'no-magic-strings': rules_1.magicStringsRule,
    'separate-line-for-decorators': rules_1.decoratorsRule,
    'separate-expect-expresion(s)': rules_1.expectRule,
};
