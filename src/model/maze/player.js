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
   * @throws Error - if `x` is not positive Integer
   * @throws Error - if `y` is not positive Integer
   */
  constructor(x, y) {
    if (!Number.isInteger(x) || x < 0) {
      throw Error(`Player.constructor x must be positive Integer`);
    }
    if (!Number.isInteger(y) || y < 0) {
      throw Error(`Player.constructor y must be positive Integer`);
    }
    Object.defineProperties(this, {
      x: {
        get: () => x,
        set: (value) => {
          if (!Number.isInteger(value) || value < 0) {
            throw Error(`Player.x.set() value must be positive Integer`);
          }
          x = value;
        }
      },
      y: {
        get: () => y,
        set: (value) => {
          if (!Number.isInteger(value) || value < 0) {
            throw Error(`Player.y.set() value must be positive Integer`);
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