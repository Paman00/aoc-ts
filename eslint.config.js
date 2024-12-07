import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import love from 'eslint-config-love';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...love,
  },
  {
    rules: {
      complexity: 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/prefer-destructuring': 'off',
    },
  },
];
