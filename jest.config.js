const config = {
  rootDir: './tests',
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  displayName: {
    name: 'MODEL',
    color: 'blue',
  },
  modulePathIgnorePatterns: ["<rootDir>/rockScissorsPaper.test.js"],
};

module.exports = config;