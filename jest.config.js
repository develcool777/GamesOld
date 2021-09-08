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
  silent: true,
  modulePathIgnorePatterns: [
    // '<rootDir>/RockPaperScissors', 
    // '<rootDir>/timer.test.js',
    // '<rootDir>/ticTacToe/game.test.js',
    // '<rootDir>/ticTacToe/board.test.js',
    // '<rootDir>/ticTacToe/minMax.test.js'
  ],
};

module.exports = config;