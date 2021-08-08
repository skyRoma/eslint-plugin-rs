import { TSESLint } from '@typescript-eslint/experimental-utils';
import {
  decoratorsRule,
  expectRule,
  magicStringsRule,
  templateLiteralsRule,
  SRPRule,
  OCPRule,
  LSPRule,
  ISPRule,
  DIPRule,
} from './rules';

export const rules: Record<string, TSESLint.RuleModule<string, unknown[]>> = {
  'no-template-literals': templateLiteralsRule,
  'no-magic-strings': magicStringsRule,
  'separate-line-for-decorators': decoratorsRule,
  'separate-expect-expression(s)': expectRule,
  'solid-srp': SRPRule,
  'solid-ocp': OCPRule,
  'solid-lsp': LSPRule,
  'solid-isp': ISPRule,
  'solid-dip': DIPRule,
};
