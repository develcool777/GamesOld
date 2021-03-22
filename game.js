const Player = require("./player");

module.exports = class Game {
  constructor(field, player, winPosition) {
    if (!Array.isArray(field)) {
      throw Error(`Game.constructor field must be Array`);
    }
    if (!field.every(arr => Array.isArray(arr))) {
      throw Error(`Game.constructor field must be 2D Array`);
    }
    if (!player instanceof Player) {
      throw Error(`Game.constructor player must be object of Player`);
    }
    if (!player instanceof Player) {
      throw Error(`Game.constructor player must be object of Player`);
    }
    if (!winPosition instanceof Object) {
      throw Error(`Game.constructor winPosition must be object`);
    }
    if (!Object.keys(winPosition).join('') === 'xy' ) {
      throw Error(`Game.constructor winPosition must contain 'x' and 'y'`);
    }
    if (!Object.values(winPosition).every(item => Number.isInteger(item) && item >= 0)) {
      throw Error(`Game.constructor winPosition.x and winPosition.y must be positive Integers`);
    }
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
      }
    })
  }
  get log() {
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
      console.log('won');
    }
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
      if (x > 0 && this.field[x-1][y] === 0) {
        this.player.moveUp();
      } else {
        console.log(`sorry no up`);
      }
    }
   else if (move === 'S' ) {
      if (x < this.field.length - 1 && this.field[x+1][y] === 0) {
        this.player.moveDown();
      } else {
        console.log(`sorry no down`);
      }
    }
    else if (move === 'A' ) {
      if (y > 0 && this.field[x][y-1] === 0) {
        this.player.moveLeft();
      } else {
        console.log(`sorry no left`);
      }
    }
    else if (move === 'D') {
      if (y < this.field.length - 1 && this.field[x][y+1] === 0) {
        this.player.moveRight();
      } else {
        console.log(`sorry no right`);
      }
    } else {
      console.log(`something went wrong`);
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
    this.player.x = 0;
    this.player.y = 0;
  }

  init() {
    const [x, y] = this.player.getPosition();
    this.field[x][y] = '@';
    this.printField();
    this.moves('S');
    this.printField();
    this.moves('D');
    this.printField();
    this.moves('D');
    this.moves('W');
    this.printField();
    this.moves('W');
    this.clean();
    this.log;
  }
}