// eslint-disable-next-line import/no-commonjs
module.exports = {
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['**/generated/**'],
  extends: '@stutzlab/eslint-config',
  rules: {
    'import/group-exports': 'off',
    'fp/no-class': 'off',
  },
};
