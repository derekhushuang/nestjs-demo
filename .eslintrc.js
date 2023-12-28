const { eslint } = require('@umijs/fabric');

module.exports = {
  ...eslint,
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      rules: {
        ...eslint.overrides.rules,
        '@typescript-eslint/no-parameter-properties': 0,
        'no-param-reassign': 0
      },
      extends: ['prettier', 'plugin:@typescript-eslint/recommended'],
    },
  ],
};
