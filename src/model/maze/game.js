import Player from './player'
import Timer from '../timer'
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
   * @property {Instance} timer - instance of [`Timer`]{@link Timer}
   * @property {String} gameStatus - Shows game status
   * @property {Number} resultTime - stores time in milliseconds that was need to complete the game
   * @property {String} result - stores result of the game('Won' or 'Lost') 
   * @throws Error - if `field` is not Array
   * @throws Error - if `field` is not 2D Array
   * @throws Error - if every element of `field` is not 1 or 0 or '^@' or '#' or '$'
   * @throws Error - if `startPosition` is not Object 
   * @throws Error - if `startPosition` is not Object with keys: 'x', 'y'
   * @throws Error - if values of `startPosition.x` and `startPosition.y` are not Integers or lower than 0
   * @throws Error - if `winPosition` is not Object 
   * @throws Error - if `winPosition` is not Object with keys: 'x', 'y'
   * @throws Error - if values of `winPosition.x` and `winPosition.y` are not Integers or lower than 0
   * @throws Error - if `time` is not Integer or lower than 0
   */
  constructor(field, startPosition, winPosition, time) {
    // field
    if (!Array.isArray(field)) {
      throw Error(`Game.constructor field must be Array`);
    }
    if (!field.every(arr => Array.isArray(arr))) {
      throw Error(`Game.constructor field must be 2D Array`);
    }
    if (!field.every(arr => arr.every(item => [1, 0, '^@', '#', '$'].includes(item)))) {
      throw Error(`Game.constructor field must be 2D Array where every element of it must be: 1 or 0 or '^@' or '#' or '$'`);
    }
    // startPosition
    if (typeof startPosition !== 'object' || startPosition === null || Array.isArray(startPosition)) {
      throw Error(`Game.constructor startPosition must be Object`);
    }
    if (!['x', 'y'].every(prop => Object.prototype.hasOwnProperty.call(startPosition, prop))) {
      throw Error(`Game.constructor startPosition must contain 'x' and 'y'`);
    }
    if (!Object.values(startPosition).every(item => Number.isInteger(item) && item >= 0)) {
      throw Error(`Game.constructor startPosition.x and startPosition.y must be positive Integers`);
    }
    // winPosition
    if (typeof winPosition !== 'object' || winPosition === null || Array.isArray(winPosition)) {
      throw Error(`Game.constructor winPosition must be Object`);
    }
    if (!['x', 'y'].every(prop => Object.prototype.hasOwnProperty.call(winPosition, prop))) {
      throw Error(`Game.constructor winPosition must contain 'x' and 'y'`);
    }
    if (!Object.values(winPosition).every(item => Number.isInteger(item) && item >= 0)) {
      throw Error(`Game.constructor winPosition.x and winPosition.y must be positive Integers`);
    }
    // time
    if (!Number.isInteger(time) || time < 0) {
      throw Error(`Game.constructor time must be Integer and greater than 0`);
    }
    const player = new Player(startPosition.x, startPosition.y);
    let history = [];
    const timer = new Timer(time);
    let gameStatus = '';
    let result = '';
    let resultTime = 0;
    Object.defineProperties(this, {
      field: {
        get: () => field,
        set: (matrix) => {
          if (!Array.isArray(matrix)) {
            throw Error(`Game.field.set(matrix) matrix must be Array`);
          }
          if (!matrix.every(arr => Array.isArray(arr))) {
            throw Error(`Game.field.set(matrix) matrix must be 2D Array`);
          }
          if (!matrix.every(arr => arr.every(item => [1, 0, '^@', '#', '$'].includes(item)))) {
            throw Error(`Game.field.set(matrix) matrix must be 2D Array where every element of it must be: 1 or 0 or '^@' or '#' or '$'`);
          }
          field = matrix;
        }
      },
      player: {
        get: () => player
      },
      history: {
        get: () => history,
        set: (arr) => {
          if (!Array.isArray(arr)) {
            throw Error(`Game.history.set(arr) arr must be Array`);
          }
          history = arr;
        }
      },
      winPos: {
        get: () => winPosition
      },
      startPos: {
        get: () => startPosition
      },
      timer: {
        get: () => timer
      },
      gameStatus: {
        get: () => gameStatus,
        set: (value) => {
          if (typeof value !== 'string') {
            throw Error(`Game.gameStatus.set(value) value must be String`);
          }
          if (!['', 'start', 'stop', 'finish'].includes(value)) {
            throw Error(`Game.gameStatus.set(value) value must be '' or 'start' or 'finish' or 'stop'`);
          }
          gameStatus = value;
        }
      },
      resultTime: {
        get: () => resultTime,
        set: (value) => {
          if (!Number.isInteger(value) || value < 0) {
            throw Error(`Game.resultTime.set(value) value must be positive Integer`);
          }
          resultTime = value;
        }
      },
      result: {
        get: () => result,
        set: (value) => {
          if (typeof value !== 'string') {
            throw Error(`Game.result.set(value) value must be String`);
          }
          if (!['', 'Won', 'Lost'].includes(value)) {
            throw Error(`Game.result.set(value) value must be '' or 'Lost' or 'Won'`);
          }
          result = value;
        }
      },
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
    return console.log({
      field: this.field,
      history: this.history,
      WinPosition: this.winPos,
      playerX: x,
      playerY: y,
      timer: this.timer,
      gameStatus: this.gameStatus,
      resultTime: this.resultTime,
      result: this.result
    });
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
    if (!Number.isInteger(x)) {
      throw Error(`Game.cheakWin(x, y) x must be Integer`);
    }
    if (!Number.isInteger(y)) {
      throw Error(`Game.cheakWin(x, y) y must be Integer`);
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
   * @throws Error - if `move` is not String
   * @throws Error - if `move` is not 'W' or 'A' or 'S' or 'D'
   * @example 
   * this.moves('W') // move Up
   * this.moves('S') // move Down
   * this.moves('D') // move Right
   * this.moves('A') // move Left
   */
  moves(move) {
    if (typeof move !== 'string') {
      throw Error(`Game.moves(move) move must be String`);
    }
    if (!['W', 'A', 'S', 'D'].includes(move)) {
      throw Error(`Game.moves(move) move must be 'W' or 'A' or 'S' or 'D'`);
    }
    const [x, y] = this.player.getPosition();
    switch (move) {
      case 'W':
        if (x > 0 && this.field[x-1][y] !== 1) {
          this.player.moveUp();
        }
        break;

      case 'S':
        if (x < this.field.length - 1 && this.field[x+1][y] !== 1) {
          this.player.moveDown();
        }
        break;

      case 'A': 
        if (y > 0 && this.field[x][y-1] !== 1) {
          this.player.moveLeft();
        }
        break;

      case 'D':
        if (y < this.field[0].length - 1 && this.field[x][y+1] !== 1) {
          this.player.moveRight();
        }
        break;
    }

    this.history.push(move);
    const [xC, yC] = this.player.getPosition();
    this.draw(x, y, xC, yC);
  }

  /**
   * @method draw
   * @memberof Maze#Game#
   * @param {Number} xPrev previous `x` coordinate
   * @param {Number} yPrev previous `y` coordinate
   * @param {Number} xCurrent current `x` coordinate
   * @param {Number} yCurrent current `y` coordinate
   * @description Changes players position on coordinates(`xCurrent`, `yCurrent`) 
   * and marks as a player path(coordinates(`xPrev`, `yPrev`)), returns `true` in case of success, otherwise `false`
   * @throws Error - if `xPrev` is not positive Integer
   * @throws Error - if `yPrev` is not positive Integer
   * @throws Error - if `xPrev` and `yPrev` point to 1 or undefined on field
   * @throws Error - if `xCurrent` is not positive Integer
   * @throws Error - if `yCurrent` is not positive Integer
   * @throws Error - if `xCurrent` and `yCurrent` point to 1 or undefined on field
   * @returns {Boolean} Boolean
   * @example this.draw(0, 0, 0, 1)
   */
  draw(xPrev, yPrev, xCurrent, yCurrent) {
    if (!Number.isInteger(xPrev) || xPrev < 0) {
      throw Error(`Game.draw(xPrev, yPrev, xCurrent, yCurrent) xPrev must be positive Integer`);
    }
    if (!Number.isInteger(yPrev) || yPrev < 0) {
      throw Error(`Game.draw(xPrev, yPrev, xCurrent, yCurrent) yPrev must be positive Integer`);
    }
    if (this.field[xPrev][yPrev] === 1 || this.field[xPrev][yPrev] === undefined) {
      throw Error(`Game.draw(xPrev, yPrev, xCurrent, yCurrent) xPrev, yPrev must not point to 1 or undefined on field`);
    }
    if (!Number.isInteger(xCurrent) || xCurrent < 0) {
      throw Error(`Game.draw(xPrev, yPrev, xCurrent, yCurrent) xCurrent must be positive Integer`);
    }
    if (!Number.isInteger(yCurrent) || yCurrent < 0) {
      throw Error(`Game.draw(xPrev, yPrev, xCurrent, yCurrent) yCurrent must be positive Integer`);
    }
    if (this.field[xCurrent][yCurrent] === 1 || this.field[xCurrent][yCurrent] === undefined) {
      throw Error(`Game.draw(xPrev, yPrev, xCurrent, yCurrent) xCurrent, yCurrent must not point to 1 or undefined on field`);
    }
    if (xPrev === xCurrent && yPrev === yCurrent) {
      return false;
    }
    if (xPrev === this.startPos.x && yPrev === this.startPos.y) {
      this.field[xPrev][yPrev] = '^';
      this.field[xCurrent][yCurrent] = ['#', '#*'].includes(this.field[xCurrent][yCurrent]) ? '#@' : '@';
    }
    else if (xCurrent === this.startPos.x && yCurrent === this.startPos.y) {
      this.field[xPrev][yPrev] = ['#', '#@'].includes(this.field[xPrev][yPrev]) ? '#*' : '*';
      this.field[xCurrent][yCurrent] = '^@';
    }
    else if (xCurrent === this.winPos.x && yCurrent === this.winPos.y) {
      this.field[xPrev][yPrev] = ['#', '#@'].includes(this.field[xPrev][yPrev]) ? '#*' : '*';
      this.field[xCurrent][yCurrent] = '$@';
    }
    else {
      this.field[xPrev][yPrev] = ['#', '#@'].includes(this.field[xPrev][yPrev]) ? '#*' : '*';
      this.field[xCurrent][yCurrent] = ['#', '#*'].includes(this.field[xCurrent][yCurrent]) ? '#@' : '@'
    }
    return true;
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
        if (item === '^') {
          item = '^@';
        }
        if (item === '$@') {
          item = '$';
        }
        if (item === '*' || item === '@') {
          item = 0;
        }
        if (item === '#*' || item === '#@') {
          item = '#';
        }
        return item;
      })
    });
    this.history = [];
    this.player.x = this.startPos.x;
    this.player.y = this.startPos.y;
    this.resultTime = 0;
    this.result = '';
    this.timer.reset();
    this.gameStatus = '';
  }
 
  /**
   * @method startGame
   * @memberof Maze#Game#
   * @description Starts the game
   * @returns {undefined} undefined
   * @example this.startGame()
   */
  startGame() {
    this.gameStatus = 'start';
    this.timer.start();
  }

  /**
   * @method stopGame
   * @memberof Maze#Game#
   * @description Pauses the game
   * @returns {undefined} undefined
   * @example this.stopGame()
   */
  stopGame() {
    this.gameStatus = 'stop';
    this.timer.stop();
  }

  /**
   * @method gameFinished
   * @memberof Maze#Game#
   * @param {String} str - result of game('Won' or 'Lost')
   * @description Finishes the game 
   * @throws Error - if `str` is not String
   * @throws Error - if `str` is 'Won' or 'Lost'
   * @returns {undefined} undefined
   * @example this.gameFinished()
   */
  gameFinished(str) {
    if (typeof str !== 'string') {
      throw Error(`Game.gameFinished(str) str must be String`);
    }
    if (!['Won', 'Lost'].includes(str)) {
      throw Error(`Game.gameFinished(str) str must be 'Won' or 'Lost'`);
    }
    this.resultTime = this.timer.amountOfTime();
    this.result = str;
    this.timer.stop();
    this.gameStatus = 'finish'
  }
}