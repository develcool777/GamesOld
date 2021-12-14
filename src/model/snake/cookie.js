export default class Cookie {
  constructor(width, height, snakeBody) {
    if (!Number.isInteger(width)) {
      throw Error(`Cookie.constructor(width=0, height=0, snakeBody=[]) width must be Integer`);
    }
    if (!Number.isInteger(height)) {
      throw Error(`Cookie.constructor(width=0, height=0, snakeBody=[]) height must be Integer`);
    }
    if (!Array.isArray(snakeBody)) {
      throw Error(`Cookie.constructor(width=0, height=0, snakeBody=[]) snakeBody must be Array`);
    }

    const fieldSize = { width, height }
    let position = {};
    let intervalID = null;
    let maxScore = 100;
    let isPositionExist = false;

    Object.defineProperties(this, {
      position: {
        get: () => position,
        set: (value) => {
          if (typeof value !== 'object' || value === null || Array.isArray(value)) {
            throw Error(`Cookie.position.set(value) value must be Object`);
          }
          position = value;
        }
      },

      intervalID: {
        get: () => intervalID,
        set: (value) => {
          intervalID = value;
        }
      },

      maxScore: {
        get: () => maxScore,
        set: (value) => {
          if (!Number.isInteger(value)) {
            throw Error(`Cookie.maxScore.set(value) value must be Integer`);
          }
          maxScore = value;
        }
      },

      isPositionExist: {
        get: () => isPositionExist,
        set: (value) => {
          if (typeof value !== 'boolean') {
            throw Error(`Cookie.isPositionExist.set(value) value must be Boolean`);
          }
          isPositionExist = value;
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
      maxScore: this.maxScore,
      isPositionExist: this.isPositionExist,
      fieldSize: this.fieldSize,
      snakeBody: this.snakeBody
    })
  }

  clear() {
    this.cookiePosition = {};
    this.maxScore = 100;
    this.isPositionExist = false;
    clearInterval(this.intervalID);
    this.intervalID = null;
  }

  generatePosition(allCells=[], wallsPosition=[], applePosition={}) { 
    if (!Array.isArray(allCells)) {
      throw Error(`Cookie.generatePosition(allCells=[], wallsPosition=[], applePosition={}) allCells must be Array`);
    }
    if (!Array.isArray(wallsPosition)) {
      throw Error(`Cookie.generatePosition(allCells=[], wallsPosition=[], applePosition={}) wallsPosition must be Array`);
    }
    if (typeof applePosition !== 'object' || applePosition === null || Array.isArray(applePosition)) {
      throw Error(`Cookie.generatePosition(allCells=[], wallsPosition=[], applePosition={}) applePosition must be Object`);
    }

    let array = [...this.snakeBody, ...wallsPosition, applePosition, this.position];

    const findAndDelete = (cell) => {
      const lenBeforeFilter = array.length;
      array = array.filter(pos => pos.x !== cell.x || pos.y !== cell.y);
      return lenBeforeFilter === array.length;
    }

    const availableCells = allCells.filter(cell => findAndDelete(cell));

    const chooseCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    
    this.position = chooseCell;
    this.isPositionExist = true;
  }

  startTimer() {
    const step = 1;
    this.intervalID = setInterval(() => {
      this.maxScore -= step;
      if (this.maxScore === 0) {
        this.removeCookie();
      }
    }, 100);
  }

  removeCookie() {
    this.stopTimer();
    this.position = {};
    this.isPositionExist = false;
    setTimeout(() => this.maxScore = 100, 2000);
    return this.maxScore;
  }

  stopTimer() {
    clearInterval(this.intervalID);
  }

  // generateGuidingLines(wallsPosition=[], applePosition={}) {
  //   if (!Array.isArray(wallsPosition)) {
  //     throw Error(`Cookie.generateGuidingLines(wallsPosition=[]) wallsPosition must be Array`);
  //   }

  //   const array = [...wallsPosition, applePosition];
  //   const y = this.position.y;
  //   const x = this.position.x;

  //   const up = [];
  //   for (let x = this.position.x - 1; x >= 0; x--) {
  //     if (array.some(pos => pos.x === x && pos.y === y)) break;
  //     up.push({ x, y });
  //   }

  //   const down = [];
  //   for (let x = this.position.x + 1; x < this.fieldSize.height; x++) {
  //     if (array.some(pos => pos.x === x && pos.y === y)) break;
  //     down.push({ x, y });
  //   }

  //   const left = [];
  //   for (let y = this.position.y - 1; y >= 0; y--) {
  //     if (array.some(pos => pos.x === x && pos.y === y)) break;
  //     left.push({ x, y });
  //   }

  //   const right = [];
  //   for (let y = this.position.y + 1; y < this.fieldSize.width; y++) {
  //     if (array.some(pos => pos.x === x && pos.y === y)) break;
  //     right.push({ x, y });
  //   }

  //   return [...up, ...down, ...left, ...right];
  // }
}