// const Player = require("./player");
// module.exports = class Game {
import Player from './player'
export default class Game {
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
    let loop = false;
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
      },
      loop: {
        get: () => loop,
        set: (value) => {
          loop = value;
        }
      }
    })
  }
  log() {
    const [x, y] = this.player.getPosition();
    console.log({field: this.field, history: this.history, WinPosition: this.winPos, playerX: x, playerY: y});
  }

  printField() {
    console.log(`[`);
    this.field.forEach(arr => {
      console.log(' ', arr);
    })
    console.log(`]`);
  }

  cheakWin(x, y) {
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
        console.log(`sorry no up`);
      }
    }
    else if (move === 'S') {
      if (x < this.field.length - 1 && this.field[x+1][y] !== 1) {
        this.player.moveDown();
      } else {
        console.log(`sorry no down`);
      }
    }
    else if (move === 'A') {
      if (y > 0 && this.field[x][y-1] !== 1) {
        this.player.moveLeft();
      } else {
        console.log(`sorry no left`);
      }
    }
    else if (move === 'D' ) {
      if (y < this.field[0].length - 1 && this.field[x][y+1] !== 1) {
        this.player.moveRight();
      } else {
        console.log(`sorry no right`);
      }
    } 
    this.history.push(move);
    const [xC, yC] = this.player.getPosition();
    this.draw(x, y, xC, yC);
    this.cheakWin(xC, yC);
  }

  draw(xPrev, yPrev, xCurrent, yCurrent) {
    if (xCurrent === undefined && yCurrent === undefined) {
      this.field[xPrev][yPrev] = '@';
    } else {
      this.field[xPrev][yPrev] = '*';
      this.field[xCurrent][yCurrent] = '@'
    }
  }

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

  initGame() {
    this.field[this.startPos.x][this.startPos.y] = '@';
    this.field[this.winPos.x][this.winPos.y] = '';
  }
}