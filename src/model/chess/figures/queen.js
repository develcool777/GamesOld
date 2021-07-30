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

    // upLeft 
    currentPosition= Object.assign({}, this.position);
    for (let i = this.position.x; i > 0 && currentPosition.y > 0; i--) {
      super.fillWayToKing(available, currentPosition);
      if (super.check(field, currentPosition.x - 1, currentPosition.y - 1, currentPosition, available)) {
        super.clearWayToKing(available);
        break
      }
    }
    super.clearWayToKing(available);

    // downLeft
    currentPosition = Object.assign({}, this.position);
    for (let i = currentPosition.x; i < field.length - 1 && currentPosition.y > 0; i++) {
      super.fillWayToKing(available, currentPosition);
      if (super.check(field, currentPosition.x + 1, currentPosition.y - 1, currentPosition, available)) {
        super.clearWayToKing(available);
        break;
      }
    }
    super.clearWayToKing(available);

    // upRight
    currentPosition = Object.assign({}, this.position);
    for (let i = currentPosition.x; i > 0 && currentPosition.y < field.length - 1; i--) {
      super.fillWayToKing(available, currentPosition);
      if (super.check(field, currentPosition.x - 1, currentPosition.y + 1, currentPosition, available)) {
        super.clearWayToKing(available);
        break;
      }
    }
    super.clearWayToKing(available);

    // downRight
    currentPosition = Object.assign({}, this.position);
    for (let i = currentPosition.x; i < field.length - 1 && currentPosition.y < field.length - 1; i++) {
      super.fillWayToKing(available, currentPosition);
      if (super.check(field, currentPosition.x + 1, currentPosition.y + 1, currentPosition, available)) {
        super.clearWayToKing(available);
        break;
      }
    }
    super.clearWayToKing(available);

    // console.log({available}, "Queen");
    return available;
  }

  makeMove(cordinates, field) {
    super.makeMove(cordinates, field, this);
  }
}