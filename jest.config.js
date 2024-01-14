// eslint-disable-next-line import/no-commonjs
module.exports = {
  testMatch: ['**/?(*.)+(spec|test).+(ts|tsx|js)'],
  coverageReporters: ['text'],
  collectCoverage: true,
  collectCoverageFrom: ['./src/**', '!**/__tests__/**'],
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
      lines: 95,
      functions: 90,
      branches: 70,
    },
  },
};
