import Figures from "../figures";

export default class Rook extends Figures {
  /**
   * @class
   * @alias Rook
   * @memberof Chess#Figures#
   * @augments Figures
   * @classdesc This class represents the logic of Rook figure
   * @param {String} color - color of the figure
   * @param {Object} position - position of the figure 
   * @param {String} side - side of the figure 
   * @constructor
   * @property {String} color - this `color`
   * @property {Object} position - this `position`
   * @property {Object} side - this `side`
   * @property {String} name - name of the figure
   * @property {Boolean} firstMove - if rook have not made move yet, the value is `true` otherwise `false`
   * @throws Error - if `color` is not String
   * @throws Error - if `color` is not 'white' or 'black'
   * @throws Error - if `position` is not Object
   * @throws Error - if `position` is not Object with keys: 'x' and 'y'
   * @throws Error - if `side` is not String
   * @throws Error - if `side` is not 'up' or 'down'
   */
  constructor(color, position, side) {
    super();

    if (typeof color !== 'string') {
      throw Error(`Rook.constructor color must be String`);
    }
    if (!['white', 'black'].includes(color)) {
      throw Error(`Rook.constructor color must be 'white' or 'black'`);
    }
    if (typeof position !== 'object' || position === null || Array.isArray(position)) {
      throw Error(`Pawn.constructor position must be Object`);
    }
    if (['x', 'y'].every(prop => !Object.prototype.hasOwnProperty.call(position, prop))) {
      throw Error(`Pawn.constructor position must be Object with keys x and y`);
    }
    if (typeof side !== 'string') {
      throw Error(`Pawn.constructor side must be String`);
    }
    if (!['up', 'down'].includes(side)) {
      throw Error(`Pawn.constructor side must be 'up' or 'down'`);
    }
    const name = 'Rook';
    let firstMove = true
    Object.defineProperties(this, {
      color: {
        get: () => color
      },
      side: {
        get: () => side,
        set: (value) => {
          if (typeof value !== 'string') {
            throw Error(`Rook.side.set(value) value be String`);
          }
          if (!['up', 'down'].includes(value)) {
            throw Error(`Rook.side.set(value) value must be 'up' or 'down'`);
          }
          side = value;
        }
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

  /**
   * @method available
   * @memberof Chess#Figures#Rook#
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
    
    return available;
  }

  /**
   * @method makeMove
   * @memberof Chess#Figures#Rook#
   * @param {Array} cordinates - new position for figure [x, y] 
   * @param {Array} field - chess board
   * @returns {undefined} undefined 
   * @example 
   * const f = new Field()
   * this.makeMove([0, 1], f.board)
   */
  makeMove(cordinates, field) {
    super.makeMove(cordinates, field, this);

    if (this.firstMove) {
      this.firstMove = false;
    }
  }
}