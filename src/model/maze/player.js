export default class Player {
  /**
   * @class 
   * @alias Player
   * @memberof Maze#
   * @param {Number} x this is coordinate x
   * @param {Number} y his is coordinate y
   * @property {Number} x this is `x`
   * @property {Number} y this is `y`
   * @constructor
   * @classdesc This class represents player move logic 
   * @throws Error - if `x` is not Integer
   * @throws Error - if `y` is not Integer
   */
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
    Object.freeze(this);
  }
  /**
   * @method log
   * @memberof Maze#Player#
   * @description Shows in console all class fields
   * @returns {undefined} undefined
   * @example this.log
   */
  get log() {
    return console.log({x: this.x, y: this.y});
  }

  /**
   * @method getPosition
   * @memberof Maze#Player#
   * @description Returns current position 
   * @returns {Array} [x, y]
   * @example const position = this.getPosition()
   */
  getPosition() {
    return [this.x, this.y];
  }

  /**
   * @method moveRight
   * @memberof Maze#Player#
   * @description Moves player position right
   * @returns {undefined} undefined
   * @example this.moveRight()
   */
  moveRight() {
    this.y++;
  }

  /**
   * @method moveLeft
   * @memberof Maze#Player#
   * @description Moves player position left 
   * @returns {undefined} undefined
   * @example this.moveLeft()
   */
  moveLeft() {
    this.y--;
  }

  /**
   * @method moveUp
   * @memberof Maze#Player#
   * @description Moves player position up 
   * @returns {undefined} undefined
   * @example this.moveUp()
   */
  moveUp() {
    this.x--;
  }

  /**
   * @method moveDown
   * @memberof Maze#Player#
   * @description Moves player position down 
   * @returns {undefined} undefined
   * @example this.moveDown()
   */
  moveDown() {
    this.x++;
  }
}