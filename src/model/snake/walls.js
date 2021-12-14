export default class Walls {
  constructor(width, height, snakeBody) {
    if (!Number.isInteger(width)) {
      throw Error(`Walls.constructor(width=0, height=0, snakeBody=[]) width must be Integer`);
    }
    if (!Number.isInteger(height)) {
      throw Error(`Walls.constructor(width=0, height=0, snakeBody=[]) height must be Integer`);
    }
    if (!Array.isArray(snakeBody)) {
      throw Error(`Walls.constructor(width=0, height=0, snakeBody=[]) snakeBody must be Array`);
    }

    const fieldSize = { width, height }
    let positions = [];

    Object.defineProperties(this, {
      positions: {
        get: () => positions,
        set: (value) => {
          if (!Array.isArray(value)) {
            throw Error(`Walls.positions.set(value) value must be Array`);
          }
          positions = value
        }
      },

      fieldSize: {
        get: () => fieldSize
      },

      snakeBody: {
        get: () => snakeBody
      }
    })
  }

  get log() {
    return console.log({
      positions: this.positions,
      fieldSize: this.fieldSize,
      snakeBody: this.snakeBody,
    })
  }

  clear() {
    this.positions = [];
  }

  generatePosition(allCells=[], applePosition={}, cookiePosition={}) {
    if (!Array.isArray(allCells)) {
      throw Error(`Walls.generatePosition(allCells=[], applePosition={}, cookiePosition={}) allCells must be Array`);
    }
    if (typeof applePosition !== 'object' || applePosition === null || Array.isArray(applePosition)) {
      throw Error(`Walls.generatePosition(allCells=[], applePosition={}, cookiePosition={}) applePosition must be Object`);
    }
    if (typeof cookiePosition !== 'object' || cookiePosition === null || Array.isArray(cookiePosition)) {
      throw Error(`Walls.generatePosition(allCells=[], applePosition={}, cookiePosition={}) cookiePosition must be Object`);
    }

    let array = [...this.snakeBody, applePosition, cookiePosition, ...this.positions];

    const findAndDelete = (cell) => {
      const lenBeforeFilter = array.length;
      array = array.filter(pos => pos.x !== cell.x || pos.y !== cell.y);
      return lenBeforeFilter === array.length;
    }

    const availableCells = allCells.filter(cell => findAndDelete(cell));

    this.positions.push(availableCells[Math.floor(Math.random() * availableCells.length)]);
  }
}