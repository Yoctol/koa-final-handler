module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['import'],
  extends: [
    'yoctol-base',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    node: true,
    jest: true,
  },
  rules: {
    'no-param-reassign': 'off',
    'no-return-assign': 'off',
    '@typescript-eslint/no-var-requires': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
      },
    },
  },
};
