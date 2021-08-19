import { minMax, Board } from './minMaxAlgorithm';
/**
 * @namespace TicTacToe
 */

/**
 * @class 
 * @alias Game
 * @memberof TicTacToe
 * @classdesc This class representing logic of TicTacToe game
 * @constructor
 */
export default class Game {
  /**
   * @property {Array} field - this is matrix 3x3, '' - empty cell
   * @property {String} currentPlayer - shows whose turn to move, player with 'x' or player with 'o' 
   * @property {String} winner - shows who win, player with 'x' or player with 'o' or 'It's a draw'
   * @property {Array} winnerCells - stores the path where winner player placed 'x' or 'o' in row, column or diagonal, [[0, 0], [1, 1], [2, 2]] 
   * @property {Array} moves - stores all moves that were made, {player: 'x', x: 0 , y: 1}
   */
  constructor() {
    let field = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ]
    let currentPlayer = 'x';
    let winner = '';
    const winnerCells = [];
    const moves = [];
    Object.defineProperties(this, {
      field: {
        get: () => field,
        set: (value) => {
          if (!Array.isArray(value)) {
            throw Error(`field.set(value) value must be Array`);
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
          winner = value;
        }
      },
      winnerCells: {
        get: () => winnerCells
      },
      moves: {
        get: () => moves
      }
    })
  }
  /**
   * @method
   * @alias log
   * @memberof Game#
   * @description show in console all fields of class
   * @returns {undefined}
   * @example this.log
   */
  get log() {
    return console.log({
      field: this.field, 
      currentPlayer: this.currentPlayer,
      winnerCells: this.winnerCells,
      winner: this.winner,
      moves: this.moves
    });
  }

  /**
   * @method
   * @alias getFieldForDraw
   * @memberof Game#
   * @description Generates array of objects for draw 
   * @returns {Array}
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
   * @method
   * @alias clear
   * @memberof Game#
   * @description resets the values of the class fields to their initial state
   * @returns {undefined}
   * @example this.clear();
   */
  clear() {
    this.field = this.field.map(arr => arr.map(() => ''))
    this.currentPlayer = 'x';
    this.moves.splice(0);
    this.winnerCells.splice(0);
    this.winner = '';
  }

  /**
   * @method
   * @alias play
   * @memberof Game#
   * @param {Number} cordX - cordX must be Integer
   * @param {Number} cordY - cordY must be Integer
   * @description firstly check if there is a winner, then call [`makeMove()`]{@link Game#makeMove} function, then changes `currentPlayer` and call `checkWinner()` function
   * @returns {undefined}
   * @example this.play(0, 0);
   */
  play(cordX, cordY) {
    if (this.winner !== '') { return }
    this.makeMove(this.currentPlayer, cordX, cordY);
    this.currentPlayer = this.currentPlayer === 'x' ? 'o' : 'x';
    this.checkWinner(this.field);
  }

  /**
   * @method
   * @alias makeMove
   * @memberof Game#
   * @param {String} player - player must be 'x' or 'o'
   * @param {Number} cordX - cordX must be Integer
   * @param {Number} cordY - cordY must be Integer
   * @description Inserts `player` symbol('x' or 'o') in `this.field` at coordinates(`cordX`, `cordY`) 
   * @throws Error - if player is not type of String
   * @throws Error - if player is not 'x' or 'o'
   * @throws Error - if cordX and cordY are not Integer
   * @throws Error - if cordX and cordY are not in range(0, 2)
   * @returns {undefined}
   * @example this.makeMove(this.currentPlayer, 0, 0);
   */
  makeMove(player, cordX, cordY) {
    if (typeof player !== 'string') {
      throw Error(`Game.makeMove(player, cordX, cordY) player must be String`);
    }
    if (['x', 'o'].indexOf(player) === -1) {
      throw Error(`Game.makeMove(player, cordX, cordY) player must be 'x' or 'o'`);
    }
    if (!Number.isInteger(cordX) || !Number.isInteger(cordY)) {
      throw Error(`Game.makeMove(player, cordX, cordY) cordX and cordY must be Integer`);
    }
    if ([cordX, cordY].some(c => ![0,1,2].includes(c))) {
      throw Error(`Game.makeMove(player, cordX, cordY) cordX and cordY must be in range(0, 2)`);
    }
    if (this.field[cordX][cordY] !== '') {
      return console.log('this cell is not available for move');
    }
    this.moves.push({player, x: cordX, y: cordY});
    this.field[cordX][cordY] = player;
  }

  /**
   * @method
   * @alias returnMove
   * @memberof Game#
   * @param {Boolean} withComp - if playing against computer this value must be true, otherwise false
   * @param {Boolean} compFirstMove - if computer made first move this value must be true, otherwise false
   * @description If `moves` is empty or there is a winner or there is no cell for move: return from function, 
   * otherwise define `amountOfMoves` that need to be returned then erase those moves from `moves`. 
   * @returns {undefined}
   * @example 
   * this.returnMove() // in this case it's user vs user, so it removes one move
   * this.returnMove(true) // in this case it's user vs comp, so it removes two moves
   * this.returnMove(true, true) // in this case it's user vs comp, but computer made first move,
   * so if there are less or equal to 2 moves were maden than it wont remove moves, but if more 
   */
  returnMove(withComp=false, compFirstMove=false) {
    if (this.moves.length === 0 || this.winner !== '' || this.moves.length === 9) { return }
    let amountOfMoves = 1;
    if (withComp) {
      amountOfMoves = 2; 
    } 
    if (compFirstMove && this.moves.length <= 2) {
      amountOfMoves = 0;    
    }
    const lastMoves = this.moves.splice(this.moves.length - amountOfMoves).reverse()
    lastMoves.forEach(move => {
      this.currentPlayer = move.player;
      this.field[move.x][move.y] = '';
    })
  }

  /**
   * @method
   * @alias checkWinner
   * @memberof Game#
   * @description Check is there a winner or a draw
   * @returns {undefined}
   * @example this.checkWinner();
   */
  checkWinner() {
    if (this.moves.length < 4) { return }
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
      this.winner = `It's a draw`;
    }
  }

  /**
   * @method
   * @alias playWithComputer
   * @memberof Game#
   * @param {String} difficulty - difficulty can be 'easy' or 'hard'
   * @description If `difficulty` is easy call [`computerMoveRandom`]{@link Game#computerMoveRandom}, if hard call [`computerMoveClever`]{@link Game#computerMoveClever},
   * the result of function will be received in format[x, y](if the result of function is empty array, return from function), which then passes as an argument into [`play`]{@link Game#play} function. 
   * @returns {undefined}
   * @example 
   * this.playWithComputer(); // difficulty is easy
   * this.playWithComputer('hard'); // difficulty is hard
   */
  playWithComputer(difficulty='easy') {
    const computerMove = difficulty === 'hard' ? this.computerMoveClever() : this.computerMoveRandom();
    if (computerMove.length === 0) { return }
    this.play(...computerMove);
  }

  /**
   * @method
   * @alias computerMoveClever
   * @memberof Game#
   * @description Return best move, method needs 2 classes [`Board`]{@link Board} and [`minMax`]{@link minMax}, 
   * last one has method [`getBestMove`]{@link minMax#getBestMove} in which takes as an argument 
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
   * @method
   * @alias computerMoveRandom
   * @memberof Game#
   * @description Returns computer move, first call [`availableMoves`]{@link Game#availableMoves}
   * function which return all available moves, then choose random move.  
   * @returns {Array} [x, y] or []
   * @example const compMove = this.computerMoveRandom();
   */
  computerMoveRandom() {
    const moves = this.availableMoves(this.field);
    const randomMove = moves[Math.floor(Math.random() * moves.length)] || [];
    return randomMove;
  }

  /**
   * @method
   * @alias availableMoves
   * @memberof Game#
   * @param {Array} field - field must be matrix 3x3
   * @description Return available moves, used 2 [`map`]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map}
   * to iterate `field`, if cell is empty then return cordinates, otherwise return false, after use 
   * [`filter`]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter}
   * to leave only pairs [x, y]   
   * @returns {Array} [[x, y], [x1, y1]]
   * @example const moves = this.availableMoves(this.field);
   */
  availableMoves(field) {
    return field.map((arr, i) => {
      return arr.map((cell, j) => {
        if (cell === '') {
          return [i, j];
        }
        return false;
      })
    }).flat().filter(pair => pair !== false);
  }
}