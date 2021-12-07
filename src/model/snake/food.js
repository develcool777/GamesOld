export default class Food {
  constructor(width, height, snakeBody) {
    const fieldSize = { width, height }
    const allCells = [];
    let position = {};
    Object.defineProperties(this, {
      position: {
        get: () => position,
        set: (value) => {
          position = value
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
      allCells: this.allCells
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
}