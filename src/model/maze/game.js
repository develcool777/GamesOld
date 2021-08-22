import Player from './player'

/**
 * @namespace Maze
 */

export default class Game {
  /**
   * @class 
   * @alias Game
   * @memberof Maze#
   * @param {Array} field this is matrix which filled with 1 and 0, 
   * where 1 is block(wall), 0 is an empty cell available for move
   * @param {Object} startPosition this is object{x, y} of start position coordinates
   * @param {Object} winPosition this is object{x, y} of end position coordinates
   * @constructor
   * @classdesc This class represents logic of Maze game
   * @property {Instance} player - Instance of class [`Player`]{@link Maze#Player}
   * @property {Array} history - Stores all `player` moves
   */
  constructor(field, startPosition, winPosition) {
    if (!Array.isArray(field)) {
      throw Error(`Game.constructor field must be Array`);
    }
    if (!field.every(arr => Array.isArray(arr))) {
      throw Error(`Game.constructor field must be 2D Array`);
    }
    if (!Object.keys(startPosition).join('') === 'xy' ) {
      throw Error(`Game.constructor startPosition must contain 'x' and 'y'`);
    }
    if (!Object.values(startPosition).every(item => Number.isInteger(item) && item >= 0)) {
      throw Error(`Game.constructor startPosition.x and startPosition.y must be positive Integers`);
    }
    if (!Object.keys(winPosition).join('') === 'xy' ) {
      throw Error(`Game.constructor winPosition must contain 'x' and 'y'`);
    }
    if (!Object.values(winPosition).every(item => Number.isInteger(item) && item >= 0)) {
      throw Error(`Game.constructor winPosition.x and winPosition.y must be positive Integers`);
    }
    const player = new Player(startPosition.x, startPosition.y);
    let history = [];
    Object.defineProperties(this, {
      field: {
        get: () => field,
        set: (matrix) => {
          field = matrix;
        }
      },
      player: {
        get: () => player
      },
      history: {
        get: () => history,
        set: (arr) => {
          history = arr;
        }
      },
      winPos: {
        get: () => winPosition
      },
      startPos: {
        get: () => startPosition
      }
    })
  }
  /**
   * @method log
   * @memberof Maze#Game#
   * @description Shows in console all class fields
   * @returns {undefined} undefined
   * @example this.log
   */
  get log() {
    const [x, y] = this.player.getPosition();
    return console.log({field: this.field, history: this.history, WinPosition: this.winPos, playerX: x, playerY: y});
  }

  /**
   * @method printField
   * @memberof Maze#Game#
   * @description Shows in console `this.field`
   * @returns {undefined} undefined
   * @example this.printField()
   */
  printField() {
    console.log(`[`);
    this.field.forEach(arr => {
      console.log(' ', arr);
    })
    console.log(`]`);
  }

  /**
   * @method checkWin
   * @memberof Maze#Game#
   * @param {Number} x - x coordinate
   * @param {Number} y - y coordinate
   * @description Returns true if `x` and `y` equals `winPos` coordinates, otherwise false
   * @throws Error - if `x` is not Integer
   * @throws Error - if `y` is not Integer
   * @returns {Boolean} Boolean
   * @example const isWin = this.checkWin(x, y);
   */
  checkWin(x, y) {
    if (typeof x !== 'number' || !Number.isInteger(x)) {
      throw Error(`Game.cheakWin x must be Integer`);
    }
    if (typeof y !== 'number' || !Number.isInteger(y)) {
      throw Error(`Game.cheakWin y must be Integer`);
    }
    if (x === this.winPos.x && y === this.winPos.y) {
      return true;
    }
    return false;
  }

  /**
   * @method moves
   * @memberof Maze#Game#
   * @param {String} move describes in which direction move('W', 'S', 'D', 'A')
   * @description If there no wall(1) or end of field, makes move of player, otherwise show in console `no move`
   * @returns {undefined} undefined
   * @example 
   * this.moves('W') // move Up
   * this.moves('S') // move Down
   * this.moves('D') // move Right
   * this.moves('A') // move Left
   */
  moves(move) {
    if (typeof move !== 'string') {
      throw Error(`Game.moves() move must be String`);
    }
    if (!['W', 'A', 'S', 'D'].includes(move)) {
      throw Error(`Game.moves() move must be 'W' or 'A' or 'S' or 'D'`);
    }
    const [x, y] = this.player.getPosition();
    if (move === 'W') {
      if (x > 0 && this.field[x-1][y] !== 1) {
        this.player.moveUp();
      } else {
        console.log(`no move up`);
      }
    }
    else if (move === 'S') {
      if (x < this.field.length - 1 && this.field[x+1][y] !== 1) {
        this.player.moveDown();
      } else {
        console.log(`no move down`);
      }
    }
    else if (move === 'A') {
      if (y > 0 && this.field[x][y-1] !== 1) {
        this.player.moveLeft();
      } else {
        console.log(`no move left`);
      }
    }
    else if (move === 'D' ) {
      if (y < this.field[0].length - 1 && this.field[x][y+1] !== 1) {
        this.player.moveRight();
      } else {
        console.log(`no move right`);
      }
    } 
    this.history.push(move);
    const [xC, yC] = this.player.getPosition();
    this.draw(x, y, xC, yC);
    this.checkWin(xC, yC);
  }

  /**
   * @method draw
   * @memberof Maze#Game#
   * @param {Number} xPrev previous `x` coordinate
   * @param {Number} yPrev previous `y` coordinate
   * @param {Number} xCurrent current `x` coordinate
   * @param {Number} yCurrent current `y` coordinate
   * @description Changes players position on coordinates(`xCurrent`, `yCurrent`) 
   * and marks as a player path(coordinates(`xPrev`, `yPrev`)) 
   * @returns {undefined} undefined
   * @example this.draw(0, 0, 0, 1)
   */
  draw(xPrev, yPrev, xCurrent, yCurrent) {
    if (xCurrent === undefined && yCurrent === undefined) {
      this.field[xPrev][yPrev] = '@';
    } else {
      this.field[xPrev][yPrev] = '*';
      this.field[xCurrent][yCurrent] = '@'
    }
  }

  /**
   * @method clean
   * @memberof Maze#Game#
   * @description Sets all class properties to initial value
   * @returns {undefined} undefined
   * @example this.clean()
   */
  clean() {
    this.field = this.field.map(arr => {
      return arr.map(item => {
        if (item === '*' || item === '@') {
          item = 0;
        }
        return item;
      })
    });
    this.history = [];
    this.player.x = this.startPos.x;
    this.player.y = this.startPos.y;
  }

  /**
   * @method generateWinPath
   * @memberof Maze#Game#
   * @description Returns array of object(coordinates {x, y}),
   * this is path that show how to get from start point to finish 
   * @returns {Array} Array
   * @example const winPath = this.generateWinPath()
   */
  generateWinPath() {
    const path = this.field.map((arr, i) => {
      return arr.map((item, j) => {
        const obj = {};
        if (item === '*') {
          obj.x = i;
          obj.y = j;
        }
        return obj;
      })
    })
    return path.flat().filter(item => item.x !== undefined && item.y !== undefined);
  }

  /**
   * @method initGame
   * @memberof Maze#Game#
   * @description Initiates game by adding on a field player('@') on start position and adding finish('') on end position 
   * @returns {undefined} undefined
   * @example this.initGame()
   */
  initGame() {
    this.field[this.startPos.x][this.startPos.y] = '@';
    this.field[this.winPos.x][this.winPos.y] = '';
  }
}