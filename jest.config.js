// eslint-disable-next-line import/no-commonjs
module.exports = {
  testMatch: ['**/?(*.)+(spec|test).+(ts|tsx|js)'],
  coverageReporters: ['text'],
  collectCoverage: true,
  collectCoverageFrom: ['./src/**', '!**/__tests__/**', '!**/*.test.*/**', '!**/generated/**'],
  transform: {
    '^.+\\.(tsx?|json?)$': [
      'esbuild-jest',
      {
        sourcemap: true, // correct line numbers in code coverage
      },
    ],
  },
  coverageThreshold: {
    global: {
      lines: 90,
      functions: 80,
      branches: 70,
    },
  },
};
