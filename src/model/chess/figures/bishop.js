import Figures from "../figures";

export default class Bishop extends Figures {
  constructor(color, position) {
    super();

    if (typeof color !== 'string') {
      throw Error(`Bishop.constructor color must be String`);
    }
    if (Object.keys(position).join('') !== 'xy') {
      throw Error(`Bishop.constructor position must be Object with keys x and y`);
    }
    const name = 'Bishop';
    Object.defineProperties(this, {
      color: {
        get: () => color
      },
      position: {
        get: () => position
      },
      name: {
        get: () => name
      }
    })
  }

  available(field) {
    const available = {
      move: [],
      kill: [],
      check: []
    };

    // upLeft 
    const currentPositionUpLeft = Object.assign({}, this.position);
    for (let i = this.position.x; i > 0 && currentPositionUpLeft.y > 0; i--) {
      if (super.check(field, currentPositionUpLeft.x - 1, currentPositionUpLeft.y - 1, currentPositionUpLeft, available)) {
        break
      }
    }

    // downLeft
    const currentPositionDownLeft = Object.assign({}, this.position);
    for (let i = currentPositionDownLeft.x; i < field.length - 1 && currentPositionDownLeft.y > 0; i++) {
      if (super.check(field, currentPositionDownLeft.x + 1, currentPositionDownLeft.y - 1, currentPositionDownLeft, available)) {
        break;
      }
    }

    // upRight
    const currentPositionUpRight = Object.assign({}, this.position);
    for (let i = currentPositionUpRight.x; i > 0 && currentPositionUpRight.y < field.length - 1; i--) {
      if (super.check(field, currentPositionUpRight.x - 1, currentPositionUpRight.y + 1, currentPositionUpRight, available)) {
        break;
      }
    }

    // downRight
    const currentPositionDownRight = Object.assign({}, this.position);
    for (let i = currentPositionDownRight.x; i < field.length - 1 && currentPositionDownRight.y < field.length - 1; i++) {
      if (super.check(field, currentPositionDownRight.x + 1, currentPositionDownRight.y + 1, currentPositionDownRight, available)) {
        break;
      }
    }

    return available;
  }

  makeMove(cordinates, field) {
    super.makeMove(cordinates, field, this);
  }

  checkForCheck(figure, field) {
    const moves = figure.available(field);
    return moves.check.length === 0 ? false : moves.check[0];
  }
}