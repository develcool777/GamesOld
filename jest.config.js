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
  silent: false,
  collectCoverage: true,
  coverageDirectory: "<rootDir>/coverage/",
  coverageReporters: ["teamcity", "lcov", "text"],
  modulePathIgnorePatterns: [ 
    // '<rootDir>/timer.test.js',
    // '<rootDir>/RockPaperScissors/game.test.js',
    // '<rootDir>/TicTacToe/game.test.js',
    // '<rootDir>/TicTacToe/board.test.js',
    // '<rootDir>/TicTacToe/minMax.test.js',
    // '<rootDir>/Memoji/field.test.js',
    // '<rootDir>/Memoji/game.test.js',
    // '<rootDir>/Maze/field.test.js',
    // '<rootDir>/Maze/player.test.js',
    // '<rootDir>/Maze/game.test.js',
    // '<rootDir>/Chess/cell.test.js',
    // '<rootDir>/Chess/field.test.js',
  ],
  detectOpenHandles: true
};

module.exports = config;