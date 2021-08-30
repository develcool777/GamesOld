import Figures from "../figures";

export default class Queen extends Figures {
  /**
   * @class
   * @alias Queen
   * @memberof Chess#Figures#
   * @augments Figures
   * @classdesc This class represents the logic of Queen figure
   * @param {String} color - color of the figure
   * @param {Object} position - position of the figure 
   * @constructor
   * @property {String} color - this `color`
   * @property {Object} position - this `position`
   * @property {String} name - name of the figure
   * @throws Error - if `color` is not String
   * @throws Error - if `color` is not 'white' or 'black'
   * @throws Error - if `position` is Object with keys: 'x' and 'y'
   */
  constructor(color, position) {
    super();

    if (typeof color !== 'string') {
      throw Error(`Queen.constructor color must be String`);
    }
    if (!['white', 'black'].includes(color)) {
      throw Error(`Queen.constructor color must be 'white' or 'black'`);
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

  /**
   * @method available
   * @memberof Chess#Figures#Queen#
   * @description Returns all available moves for the figure
   * @param {Array} field chess board
   * @param {Boolean} xray enables xray vision if value is `true`
   * @returns {Object} {
      move: [],
      kill: [],
      check: [],
      wayToKing: [],
      cover: [],
    }
   * @example 
   * const f = new Field()
   * this.available(f.board); // without xray
   * this.available(f.board, true); // with xray
   */
  available(field, xray=false) {
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
      if (super.check(field, currentPosition.x - 1, currentPosition.y, currentPosition, available, xray)) {
        super.clearWayToKing(available);
        break;
      }
    }
    super.clearWayToKing(available);

    // down
    currentPosition = Object.assign({}, this.position);
    for (let i = currentPosition.x; i < field.length - 1; i++) {
      super.fillWayToKing(available, currentPosition);
      if (super.check(field, currentPosition.x + 1, currentPosition.y, currentPosition, available, xray)) {
        super.clearWayToKing(available);
        break;
      }
    }
    super.clearWayToKing(available);

    // left
    currentPosition = Object.assign({}, this.position);
    for (let i = currentPosition.y; i > 0; i--) {
      super.fillWayToKing(available, currentPosition);
      if (super.check(field, currentPosition.x, currentPosition.y - 1, currentPosition, available, xray)) {
        super.clearWayToKing(available);
        break;
      }
    }
    super.clearWayToKing(available);

    // right
    currentPosition = Object.assign({}, this.position);
    for (let i = currentPosition.y; i < field.length - 1; i++) {
      super.fillWayToKing(available, currentPosition);
      if (super.check(field, currentPosition.x, currentPosition.y + 1, currentPosition, available, xray)) {
        super.clearWayToKing(available);
        break;
      }
    }
    super.clearWayToKing(available);

    // upLeft 
    currentPosition= Object.assign({}, this.position);
    for (let i = this.position.x; i > 0 && currentPosition.y > 0; i--) {
      super.fillWayToKing(available, currentPosition);
      if (super.check(field, currentPosition.x - 1, currentPosition.y - 1, currentPosition, available, xray)) {
        super.clearWayToKing(available);
        break
      }
    }
    super.clearWayToKing(available);

    // downLeft
    currentPosition = Object.assign({}, this.position);
    for (let i = currentPosition.x; i < field.length - 1 && currentPosition.y > 0; i++) {
      super.fillWayToKing(available, currentPosition);
      if (super.check(field, currentPosition.x + 1, currentPosition.y - 1, currentPosition, available, xray)) {
        super.clearWayToKing(available);
        break;
      }
    }
    super.clearWayToKing(available);

    // upRight
    currentPosition = Object.assign({}, this.position);
    for (let i = currentPosition.x; i > 0 && currentPosition.y < field.length - 1; i--) {
      super.fillWayToKing(available, currentPosition);
      if (super.check(field, currentPosition.x - 1, currentPosition.y + 1, currentPosition, available, xray)) {
        super.clearWayToKing(available);
        break;
      }
    }
    super.clearWayToKing(available);

    // downRight
    currentPosition = Object.assign({}, this.position);
    for (let i = currentPosition.x; i < field.length - 1 && currentPosition.y < field.length - 1; i++) {
      super.fillWayToKing(available, currentPosition);
      if (super.check(field, currentPosition.x + 1, currentPosition.y + 1, currentPosition, available, xray)) {
        super.clearWayToKing(available);
        break;
      }
    }
    super.clearWayToKing(available);

    return available;
  }

  /**
   * @method makeMove
   * @memberof Chess#Figures#Queen#
   * @param {Array} cordinates - new position for figure [x, y] 
   * @param {Array} field - chess board
   * @returns {undefined} undefined 
   * @example 
   * const f = new Field()
   * this.makeMove([0, 1], f.board)
   */
  makeMove(cordinates, field) {
    super.makeMove(cordinates, field, this);
  }
}