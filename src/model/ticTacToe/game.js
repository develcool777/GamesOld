import { minMax, Board } from './minMaxAlgorithm';
/**
 * @namespace TicTacToe
 */

export default class Game {
  /**
   * @class 
   * @alias Game
   * @memberof TicTacToe#
   * @classdesc This class representing logic of TicTacToe game
   * @constructor
   * @property {Array} field - this is matrix 3x3, '' - empty cell
   * @property {String} currentPlayer - shows whose turn to move, player with 'x' or player with 'o' 
   * @property {String} winner - shows who win, player with 'x' or player with 'o' or 'It's a draw'
   * @property {Array} winnerCells - stores the path where winner player placed 'x' or 'o' in row, column or diagonal, [[0, 0], [1, 1], [2, 2]] 
   * @property {Array} moves - stores all moves that were made, {player: 'x', x: 0 , y: 1}
   * @property {Object} comp - comp settings 
   * @property {String} gameStatus - Shows game status
   */
  constructor() {
    let field = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ]
    let currentPlayer = 'x';
    let winner = '';
    let gameStatus = '';
    const winnerCells = [];
    const moves = [];
    const comp = {
      playWithComputer: true,
      userSide: 'x',
      compSide: 'o',
      difficulty: 'easy'
    }

    Object.defineProperties(this, {
      field: {
        get: () => field,
        set: (value) => {
          if (!Array.isArray(value)) {
            throw Error(`field.set(value) value must be Array`);
          }
          if (value.length !== 3) {
            throw Error(`field.set(value) length of value must be 3`);
          }
          if (!value.every(arr => Array.isArray(arr))) {
            throw Error(`field.set(value) every element of value must be Array`);
          }
          if (!value.every(arr => arr.length === 3 )) {
            throw Error(`field.set(value) every subarray of value must have length 3`);
          }
          if (!value.every(arr => arr.every(item => typeof item === 'string'))) {
            throw Error(`field.set(value) every element of 2D array(value) must be String`)
          }
          if (!value.every(arr => arr.every(item => ['', 'x', 'o'].includes(item)))) {
            throw Error(`field.set(value) every element of 2D array(value) must be '' or 'x' or 'o'`)
          }
          field = value;
        }
      },
      currentPlayer: {
        get: () => currentPlayer,
        set: (value) => {
          if (typeof value !== 'string') {
            throw Error(`currentPlayer.set(value) value must be String`);
          }
          if (['x', 'o'].indexOf(value) === -1) {
            throw Error(`currentPlayer.set(value) value must be 'x' or 'o'`);
          }
          currentPlayer = value;
        }
      },
      winner: {
        get: () => winner,
        set: (value) => {
          if (typeof value !== 'string') {
            throw Error(`winner.set(value) value must be String`);
          }
          if (!['draw', 'x', 'o', ''].includes(value)) {
            throw Error(`winner.set(value) value must be 'draw' or 'x' or 'o' or ''`)
          }
          winner = value;
        }
      },
      gameStatus: {
        get: () => gameStatus,
        set: (value) => {
          if (typeof value !== 'string') {
            throw Error(`gameStatus.set(value) value must be String`);
          }
          if (!['start', 'finish', ''].includes(value)) {
            throw Error(`gameStatus.set(value) value must be 'start' or 'finish' or ''`);
          }
          gameStatus = value;
        }
      },
      winnerCells: {
        get: () => winnerCells
      },
      moves: {
        get: () => moves
      },
      comp: {
        get: () => comp
      }
    });
  }
  /**
   * @method log
   * @memberof TicTacToe#Game#
   * @description Shows in console all fields of class
   * @returns {undefined} undefined
   * @example this.log
   */
  get log() {
    return console.log({
      field: this.field, 
      currentPlayer: this.currentPlayer,
      winnerCells: this.winnerCells,
      winner: this.winner,
      moves: this.moves,
      gameStatus: this.gameStatus,
      comp: this.comp
    });
  }

  /**
   * @method getFieldForDraw
   * @memberof TicTacToe#Game#
   * @description Generates array of objects for draw 
   * @returns {Array} Array
   * @example const res = this.getFieldForDraw();
   */
  getFieldForDraw() {
    const match = (x, y) => {
      if (this.winnerCells.length === 0) { return false }
      return this.winnerCells.some(pair => pair[0] === x && pair[1] === y);
    }
    return this.field.map((arr, i) => {
      return arr.map((item, j) => {
        return {
          currentPlayer: this.currentPlayer,
          cell: item,
          winCell: match(i, j),
          coordinates: {
            x: i,
            y: j
          }
        }
      })
    }).flat();
  }

  /**
   * @method clear
   * @memberof TicTacToe#Game#
   * @description Resets the values of the class fields to their initial state
   * @returns {Boolean} Boolean 
   * @example this.clear();
   */
  clear() {
    this.field = this.field.map(arr => arr.map(() => ''));
    this.currentPlayer = 'x';
    this.moves.splice(0);
    this.winnerCells.splice(0);
    this.winner = '';
    this.gameStatus = '';
    return true;
  }

  /**
   * @method play
   * @memberof TicTacToe#Game#
   * @param {Number} cordX - cordX must be Integer
   * @param {Number} cordY - cordY must be Integer
   * @description Returns `true` if move made successfully, otherwise `false` or throws `error` 
   * @returns {Boolean} Boolean
   * @throws Error - if `cordX` and `cordY` are not Integer
   * @throws Error - if `cordX` and `cordY` are not in range(0, 2)
   * @example this.play(0, 0);
   */
  play(cordX, cordY) {
    if (!Number.isInteger(cordX) || !Number.isInteger(cordY)) {
      throw Error(`Game.play(cordX, cordY) cordX and cordY must be Integer`);
    }
    if ([cordX, cordY].some(c => ![0,1,2].includes(c))) {
      throw Error(`Game.play(cordX, cordY) cordX and cordY must be in range(0, 2)`);
    }
    if (this.winner !== '') { return false }
    if (this.field[cordX][cordY] !== '') { return false }

    this.field[cordX][cordY] = this.currentPlayer;
    this.moves.push({player: this.currentPlayer, x: cordX, y: cordY});
    this.currentPlayer = this.currentPlayer === 'x' ? 'o' : 'x';
    this.checkWinner(this.field);
    return true;
  }


  /**
   * @method returnMove
   * @memberof TicTacToe#Game#
   * @description If `moves` is empty or there is a winner or there is no cell for move: return from function, 
   * otherwise define `amountOfMoves` that need to be returned then erase those moves from `moves`. 
   * Also returns `true` if function runs correctly otherwise `false`
   * @returns {Boolean} Boolean
   * @example this.returnMove()
   */
  returnMove() {
    const withComp = this.comp.playWithComputer
    const compFirstMove = this.comp.compSide === 'x';
    if (this.moves.length === 0 || this.winner !== '' || compFirstMove && this.moves.length <= 2) { return false }
    let amountOfMoves = withComp ? 2 : 1;
    const lastMoves = this.moves.splice(this.moves.length - amountOfMoves).reverse()
    lastMoves.forEach(move => {
      this.currentPlayer = move.player;
      this.field[move.x][move.y] = '';
    })
    return true;
  }

  /**
   * @method checkWinner
   * @memberof TicTacToe#Game#
   * @description Check is there a winner or a draw, also returns `true` if function runs correctly otherwise `false`
   * @returns {Boolean} Boolean
   * @example this.checkWinner();
   */
  checkWinner() {
    if (this.moves.length < 4) { return false }
    const equals = (a,b,c) => a === b && b === c && a !== '';
    const F = this.field;

    // rows
    F.forEach((row, i) => {
      if (equals(...row)) {
        this.winnerCells.push([i, 0], [i, 1], [i, 2]);
        this.winner = row[i];
      }
    })
    
    // columns
    F.forEach((_, i) => {
      if (equals(F[0][i], F[1][i], F[2][i])) {
        this.winnerCells.push([0, i], [1, i], [2, i]);
        this.winner = F[0][i];
      }
    })

    // diagonals
    if (equals(F[0][0], F[1][1], F[2][2])) {
      this.winnerCells.push([0, 0], [1, 1], [2, 2]);
      this.winner = F[1][1];
    }
    if (equals(F[0][2], F[1][1], F[2][0])) {
      this.winnerCells.push([0, 2], [1, 1], [2, 0]);
      this.winner = F[1][1];
    }

    // draw
    if (this.moves.length === 9 && this.winner === '') {
      this.winner = `draw`;
    }

    // finish
    if (this.winner !== '') {
      this.finishGame();
    }
    return true;
  }

  /**
   * @method playWithComputer
   * @memberof TicTacToe#Game#
   * @description If `difficulty` is easy call [`computerMoveRandom`]{@link TicTacToe#Game#computerMoveRandom}, if hard call [`computerMoveClever`]{@link TicTacToe#Game#computerMoveClever},
   * the result of function will be received in format[x, y](if the is a winner, return false), which then passes as an argument into [`play`]{@link TicTacToe#Game#play} function. Also returns `true` if function runs correctly otherwise `false` 
   * @returns {Boolean} Boolean
   * @example this.playWithComputer(); 
   */
  playWithComputer() {
    if (this.winner !== '') { return false }
    const difficulty = this.comp.difficulty;
    const computerMove = difficulty === 'hard' ? this.computerMoveClever() : this.computerMoveRandom();
    this.play(...computerMove);
    return true;
  }

  /**
   * @method computerMoveClever
   * @memberof TicTacToe#Game#
   * @description Returns best move, method needs 2 classes [`Board`]{@link TicTacToe#Board} and [`minMax`]{@link TicTacToe#minMax}, 
   * last one has method [`getBestMove`]{@link TicTacToe#minMax#getBestMove} in which takes as an argument 
   * instance of [`Board`]{@link Board} and maximazing value(if currentPlayer is 'x' pass true otherwise false)
   * @returns {Array} [x, y]
   * @example const compMove = this.computerMoveClever();
   */
  computerMoveClever() {
    const convertedToArray = this.field.flat();
    const b = new Board(convertedToArray);
    const m = new minMax();
    const maximizing = this.currentPlayer === 'x' ? true : false;
    const bestMove = m.getBestMove(b, maximizing);
    return [Math.floor(bestMove / 3), bestMove % 3];
  }

  /**
   * @method computerMoveRandom
   * @memberof TicTacToe#Game#
   * @description Returns computer move, first call [`availableMoves`]{@link Game#availableMoves}
   * function which return all available moves, then choose random move.  
   * @returns {Array} [x, y] 
   * @example const compMove = this.computerMoveRandom();
   */
  computerMoveRandom() {
    const moves = this.availableMoves();
    return moves[Math.floor(Math.random() * moves.length)];
  }

  /**
   * @method availableMoves
   * @memberof TicTacToe#Game#
   * @description Returns available moves, used 2 [`map`]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map}
   * to iterate `field`, if cell is empty then return cordinates, otherwise return false, after use 
   * [`filter`]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter}
   * to leave only pairs [x, y]   
   * @returns {Array} [[x, y], [x1, y1]]
   * @example const moves = this.availableMoves();
   */
  availableMoves() {
    return this.field.map((arr, i) => {
      return arr.map((cell, j) => {
        if (cell === '') {
          return [i, j];
        }
        return false;
      })
    }).flat().filter(pair => pair !== false);
  }

  /**
   * @method startGame
   * @memberof TicTacToe#Game#
   * @description Starts the game
   * @returns {undefined} undefined
   * @example this.startGame()
   */
  startGame() {
    this.gameStatus = 'start';
  }

  /**
   * @method finishGame
   * @memberof TicTacToe#Game#
   * @description Finishes the game 
   * @returns {undefined} undefined
   * @example this.finishGame()
   */
  finishGame() {
    this.gameStatus = 'finish';
  }
}