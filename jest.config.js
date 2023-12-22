module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  transformIgnorePatterns: ['node_modules/(?![axios|@dao-style])'],
  collectCoverage: true,
  collectCoverageFrom: ['src/utils/*.{vue,ts}', 'src/api/*.{vue,ts}', '!**/node_modules/**', '!**/dist/**'],
  // coverageDirectory: 'src',
  coverageReporters: ['text', 'text-summary'],
  // coverageThreshold: {
  //   global: {
  //     branches: 80,
  //     functions: 80,
  //     lines: 80,
  //     statements: -10,
  //   },
  // },
};
