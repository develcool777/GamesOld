export default class Cell {
  /**
   * @class 
   * @alias Cell
   * @memberof Chess#
   * @classdesc This class represents cell of the chess board
   * @param {String} color - color of the cell
   * @param {Object} position - position of the cell
   * @constructor
   * @property {Object|Instance} figure - if the cell is empty(no figure) the value is null, otherwise instance of figure
   * @property {String} isAvailableFor - shows that cell is available for(move, check, kill, promotion, castle, enPassant)
   * @throws Error - if `color` is not String
   * @throws Error - if `color` is not 'white' or 'black'
   * @throws Error - if `position` is not Object with keys: 'x' and 'y'
   */
  constructor(color, position) {
    if (typeof color !== 'string') {
      throw Error(`Cell.constructor color must be String`);
    }
    if (!['white', 'black'].includes(color)) {
      throw Error(`Cell.constructor color must be 'white' or 'black'`);
    }
    if (Object.keys(position).join('') !== 'xy') {
      throw Error(`Cell.constructor position must be Object with keys x and y`);
    }
    let figure = null;
    let isAvailableFor = '';
    Object.defineProperties(this, {
      color: {
        get: () => color 
      },

      figure: {
        get: () => figure,
        set: (value) => {
          figure = value;
        }
      },

      position: {
        get: () => position
      },

      isAvailableFor: {
        get: () => isAvailableFor,
        set: (value) => {
          if (typeof value !== 'string') {
            throw Error(`Cell.isAvailableFor.set(value) value must be String`);
          }
          if (!['', 'move', 'kill', 'castle', 'promotion', 'check', 'wayToKing', 'enPassant'].includes(value)) {
            throw Error(`Cell.isAvailableFor.set(value) value must be '' or 'move' or 'kill' or 'castle' or 'promotion' or 'check' or 'wayToKing' or 'enPassant'`);
          }
          isAvailableFor = value;
        }
      }
    })
  }
}