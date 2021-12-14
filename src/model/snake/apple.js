export default class Apple {
  constructor(width=0, height=0, snakeBody=[]) {
    if (!Number.isInteger(width)) {
      throw Error(`Apple.constructor(width=0, height=0, snakeBody=[]) width must be Integer`);
    }
    if (!Number.isInteger(height)) {
      throw Error(`Apple.constructor(width=0, height=0, snakeBody=[]) height must be Integer`);
    }
    if (!Array.isArray(snakeBody)) {
      throw Error(`Apple.constructor(width=0, height=0, snakeBody=[]) snakeBody must be Array`);
    }

    const fieldSize = { width, height }
    let position = {};
    let amountOfEatenApples = 0;
    
    Object.defineProperties(this, {
      position: {
        get: () => position,
        set: (value) => {
          if (typeof value !== 'object' || value === null || Array.isArray(value)) {
            throw Error(`Apple.position.set(value) value must be Object`);
          }
          position = value
        }
      },

      amountOfEatenApples: {
        get: () => amountOfEatenApples,
        set: (value) => {
          if (!Number.isInteger(value)) {
            throw Error(`Apple.amountOfEatenApples.set(value) value must be Integer`);
          }
          amountOfEatenApples = value;
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
      position: this.position,
      amountOfEatenApples: this.amountOfEatenApples,
      fieldSize: this.fieldSize,
      snakeBody: this.snakeBody
    })
  }

  clear() {
    this.position = {};
    this.amountOfEatenApples = 0;
  }

  generatePosition(allCells=[], wallsPosition=[], cookiePosition={}) { 
    if (!Array.isArray(allCells)) {
      throw Error(`Apple.generatePosition(allCells=[], wallsPosition=[], cookiePosition={}) allCells must be Array`);
    }
    if (!Array.isArray(wallsPosition)) {
      throw Error(`Apple.generatePosition(allCells=[], wallsPosition=[], cookiePosition={}) wallsPosition must be Array`);
    }
    if (typeof cookiePosition !== 'object' || cookiePosition === null || Array.isArray(cookiePosition)) {
      throw Error(`Apple.generatePosition(allCells=[], wallsPosition=[], cookiePosition={}) cookiePosition must be Object`);
    }

    let array = [...this.snakeBody, ...wallsPosition, cookiePosition, this.position];

    const findAndDelete = (cell) => {
      const lenBeforeFilter = array.length;
      array = array.filter(pos => pos.x !== cell.x || pos.y !== cell.y);
      return lenBeforeFilter === array.length;
    }

    const availableCells = allCells.filter(cell => findAndDelete(cell));
    this.position = availableCells[Math.floor(Math.random() * availableCells.length)];
  }

  generateGuidingLines(wallsPosition=[], cookiePosition={}) {
    if (!Array.isArray(wallsPosition)) {
      throw Error(`Apple.generateGuidingLines(wallsPosition=[], cookiePosition={}) wallsPosition must be Array`);
    }
    if (typeof cookiePosition !== 'object' || cookiePosition === null || Array.isArray(cookiePosition)) {
      throw Error(`Apple.generateGuidingLines(wallsPosition=[], cookiePosition={}) cookiePosition must be Object`);
    }

    const array = [...wallsPosition, cookiePosition];
    const y = this.position.y;
    const x = this.position.x;

    const up = [];
    for (let x = this.position.x - 1; x >= 0; x--) {
      if (array.some(pos => pos.x === x && pos.y === y)) break;
      up.push({ x, y });
    }

    const down = [];
    for (let x = this.position.x + 1; x < this.fieldSize.height; x++) {
      if (array.some(pos => pos.x === x && pos.y === y)) break;
      down.push({ x, y });
    }

    const left = [];
    for (let y = this.position.y - 1; y >= 0; y--) {
      if (array.some(pos => pos.x === x && pos.y === y)) break;
      left.push({ x, y });
    }

    const right = [];
    for (let y = this.position.y + 1; y < this.fieldSize.width; y++) {
      if (array.some(pos => pos.x === x && pos.y === y)) break;
      right.push({ x, y });
    }

    return [...up, ...down, ...left, ...right];
  }
}