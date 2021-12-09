export default class Walls {
  constructor(width, height, snakeBody) {
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

  generatePosition(allCells, foodPosition) {
    let array = [...this.snakeBody, foodPosition, ...this.positions];

    const findAndDelete = (cell) => {
      const lenBeforeFilter = array.length;
      array = array.filter(pos => pos.x !== cell.x || pos.y !== cell.y);
      return lenBeforeFilter === array.length;
    }

    const availableCells = allCells.filter(cell => findAndDelete(cell));

    this.positions.push(availableCells[Math.floor(Math.random() * availableCells.length)]);
  }
}