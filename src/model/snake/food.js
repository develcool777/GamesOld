export default class Food {
  constructor(width, height, snakeBody) {
    const fieldSize = { width, height }
    let position = {};
    let guidingLines = [];
    Object.defineProperties(this, {
      position: {
        get: () => position,
        set: (value) => {
          position = value
        }
      },

      guidingLines: {
        get: () => guidingLines,
        set: (value) => {
          if (!Array.isArray(value)) {
            throw Error(`Food.guidingLines.set(value) value must be Array`);
          }
          guidingLines = value;
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
      fieldSize: this.fieldSize,
      snakeBody: this.snakeBody,
      guidingLines: this.guidingLines
    })
  }

  clear() {
    this.position = {};
    this.guidingLines = [];
  }

  generatePosition(allCells=[], wallsPosition=[]) {
    let array = [...this.snakeBody, ...wallsPosition, this.position];

    const findAndDelete = (cell) => {
      const lenBeforeFilter = array.length;
      array = array.filter(pos => pos.x !== cell.x || pos.y !== cell.y);
      return lenBeforeFilter === array.length;
    }

    const availableCells = allCells.filter(cell => findAndDelete(cell));

    this.position = availableCells[Math.floor(Math.random() * availableCells.length)];
  }

  generateGuidingLines(wallsPosition=[]) {
    const y = this.position.y;
    const x = this.position.x;

    const up = [];
    for (let x = this.position.x - 1; x >= 0; x--) {
      if (wallsPosition.some(pos => pos.x === x && pos.y === y)) break;
      up.push({ x, y });
    }

    const down = [];
    for (let x = this.position.x + 1; x < this.fieldSize.height; x++) {
      if (wallsPosition.some(pos => pos.x === x && pos.y === y)) break;
      down.push({ x, y });
    }

    const left = [];
    for (let y = this.position.y - 1; y >= 0; y--) {
      if (wallsPosition.some(pos => pos.x === x && pos.y === y)) break;
      left.push({ x, y });
    }

    const right = [];
    for (let y = this.position.y + 1; y < this.fieldSize.width; y++) {
      if (wallsPosition.some(pos => pos.x === x && pos.y === y)) break;
      right.push({ x, y });
    }

    this.guidingLines = [...up, ...down, ...left, ...right];
  }
}