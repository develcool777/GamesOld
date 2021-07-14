import Figures from "../figures";

export default class Queen extends Figures {
  constructor(color, position) {
    super();

    if (typeof color !== 'string') {
      throw Error(`Queen.constructor color must be String`);
    }
    if (Object.keys(position).join('') !== 'xy') {
      throw Error(`Queen.constructor position must be Object with keys x and y`);
    }
    const name = 'Queen';
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

    // up 
    const currentPositionUp = Object.assign({}, this.position);
    for (let i = currentPositionUp.x; i > 0; i--) {
      if (super.check(field, currentPositionUp.x - 1, currentPositionUp.y, currentPositionUp, available)) {
        break;
      }
    }

    // down
    const currentPositionDown = Object.assign({}, this.position);
    for (let i = currentPositionDown.x; i < field.length - 1; i++) {
      if (super.check(field, currentPositionDown.x + 1, currentPositionDown.y, currentPositionDown, available)) {
        break;
      }
    }

    // left
    const currentPositionLeft = Object.assign({}, this.position);
    for (let i = currentPositionLeft.y; i > 0; i--) {
      if (super.check(field, currentPositionLeft.x, currentPositionLeft.y - 1, currentPositionLeft, available)) {
        break;
      }
    }

    // right
    const currentPositionRight = Object.assign({}, this.position);
    for (let i = currentPositionRight.y; i < field.length - 1; i++) {
      if (super.check(field, currentPositionRight.x, currentPositionRight.y + 1, currentPositionRight, available)) {
        break;
      }
    }

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

  // checkForCheck(figure, field) {
  //   const moves = figure.available(field);
  //   return moves.check.length === 0 ? false : moves.check[0];
  // }
}