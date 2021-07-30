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
      check: [],
      wayToKing: [],
      cover: [],
    };

    // up 
    let currentPosition = Object.assign({}, this.position);
    for (let i = currentPosition.x; i > 0; i--) {
      super.fillWayToKing(available, currentPosition);
      if (super.check(field, currentPosition.x - 1, currentPosition.y, currentPosition, available)) {
        super.clearWayToKing(available);
        break;
      }
    }
    super.clearWayToKing(available);

    // down
    currentPosition = Object.assign({}, this.position);
    for (let i = currentPosition.x; i < field.length - 1; i++) {
      super.fillWayToKing(available, currentPosition);
      if (super.check(field, currentPosition.x + 1, currentPosition.y, currentPosition, available)) {
        super.clearWayToKing(available);
        break;
      }
    }
    super.clearWayToKing(available);

    // left
    currentPosition = Object.assign({}, this.position);
    for (let i = currentPosition.y; i > 0; i--) {
      super.fillWayToKing(available, currentPosition);
      if (super.check(field, currentPosition.x, currentPosition.y - 1, currentPosition, available)) {
        super.clearWayToKing(available);
        break;
      }
    }
    super.clearWayToKing(available);

    // right
    currentPosition = Object.assign({}, this.position);
    for (let i = currentPosition.y; i < field.length - 1; i++) {
      super.fillWayToKing(available, currentPosition);
      if (super.check(field, currentPosition.x, currentPosition.y + 1, currentPosition, available)) {
        super.clearWayToKing(available);
        break;
      }
    }
    super.clearWayToKing(available);
    
    return available;
  }

  makeMove(cordinates, field) {
    super.makeMove(cordinates, field, this);

    if (this.firstMove) {
      this.firstMove = false;
    }
  }
}