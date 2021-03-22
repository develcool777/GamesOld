export default class Player {
  constructor(x, y) {
    if (typeof x !== 'number' || !Number.isInteger(x)) {
      throw Error(`Player.constructor x must be Integer`);
    }
    if (typeof y !== 'number' || !Number.isInteger(y)) {
      throw Error(`Player.constructor y must be Integer`);
    }
    Object.defineProperties(this, {
      x: {
        get: () => x,
        set: (value) => {
          if (typeof value !== 'number' || !Number.isInteger(value)) {
            throw Error(`x.set() value must be Integer`);
          }
          x = value;
        }
      },
      y: {
        get: () => y,
        set: (value) => {
          if (typeof value !== 'number' || !Number.isInteger(value)) {
            throw Error(`y.set() value must be Integer`);
          }
          y = value;
        }
      }
    })
  }
  log() {
    console.log({x: this.x, y: this.y});
  }

  getPosition() {
    return [this.x, this.y];
  }

  moveRight() {
    this.y++;
  }

  moveLeft() {
    this.y--;
  }

  moveUp() {
    this.x--;
  }

  moveDown() {
    this.x++;
  }
}