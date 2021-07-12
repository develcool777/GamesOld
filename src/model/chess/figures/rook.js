import Figures from "../figures";

export default class Rook extends Figures {
  constructor(color, position) {
    super();

    if (typeof color !== 'string') {
      throw Error(`Rook.constructor color must be String`);
    }
    if (Object.keys(position).join('') !== 'xy') {
      throw Error(`Rook.constructor position must be Object with keys x and y`);
    }
    const name = 'Rook';
    let firstMove = true
    Object.defineProperties(this, {
      color: {
        get: () => color
      },
      position: {
        get: () => position
      },
      name: {
        get: () => name
      },
      firstMove: {
        get: () => firstMove,
        set: (value) => {
          if (typeof value !== 'boolean') {
            throw Error(`Rook.firstMove.set() value must be Boolean`);
          }
          firstMove = value;
        }
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
    
    return available;
  }

  makeMove(cordinates, field) {
    super.makeMove(cordinates, field, this);

    if (this.firstMove) {
      this.firstMove = false;
    }
  }

  checkForCheck(figure, field) {
    const moves = figure.available(field);
    return moves.check.length === 0 ? false : moves.check[0];
  }
}