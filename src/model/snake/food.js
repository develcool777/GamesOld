export default class Food {
  constructor(width, height, snakeBody) {
    const fieldSize = { width, height }
    const allCells = [];
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
      },

      allCells: {
        get: () => allCells
      }
    })
  }

  get log() {
    return console.log({
      position: this.position,
      fieldSize: this.fieldSize,
      snakeBody: this.snakeBody,
      allCells: this.allCells,
      guidingLines: this.guidingLines
    })
  }

  generateAllCells() {
    for (let x = 0; x < this.fieldSize.height; x++) {
      const row = [];
      for (let y = 0; y < this.fieldSize.width; y++) {
        row.push({x, y});
      }
      this.allCells.push(...row);
    }
  }

  generatePosition() {
    const availableCells = this.allCells.filter(cell => {
      return !this.snakeBody.some(part => part.x === cell.x && part.y === cell.y)
    })
    this.position = availableCells[Math.floor(Math.random() * availableCells.length)];
  }

  generateGuidingLines() {
    const up = [];
    for (let x = this.position.x - 1; x >= 0; x--) {
      up.push({ x, y: this.position.y });
    }

    const down = [];
    for (let x = this.position.x + 1; x < this.fieldSize.height; x++) {
      down.push({ x, y: this.position.y });
    }

    const left = [];
    for (let y = this.position.y - 1; y >= 0; y--) {
      left.push({ x: this.position.x, y });
    }

    const right = [];
    for (let y = this.position.y + 1; y < this.fieldSize.width; y++) {
      right.push({ x: this.position.x, y });
    }

    this.guidingLines = [...up, ...down, ...left, ...right];
  }
}