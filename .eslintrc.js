module.exports = {
  parser: 'babel-eslint',
  extends: ['yoctol-base'],
  env: {
    node: true,
    jest: true,
    jasmine: true,
  },
  rules: {
    'no-param-reassign': 'off',
    'no-return-assign': 'off',
  },
};
