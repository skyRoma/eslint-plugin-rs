"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rules = void 0;
const rules_1 = require("./rules");
exports.rules = {
    'no-template-literals': rules_1.templateLiteralsRule,
    'no-magic-strings': rules_1.magicStringsRule,
    'separate-line-for-decorators': rules_1.decoratorsRule,
    'separate-expect-expression(s)': rules_1.expectRule,
    'solid-srp': rules_1.SRPRule,
    'solid-ocp': rules_1.OCPRule,
    'solid-lsp': rules_1.LSPRule,
    'solid-isp': rules_1.ISPRule,
    'solid-dip': rules_1.DIPRule,
};
