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
   * @property {Boolean} isSelected - value is `true` if cell is selected, otherwise `false`
   * @property {String} showsPosition - Shows figure position('old', 'new')
   * @throws Error - if `color` is not String
   * @throws Error - if `color` is not 'white' or 'black'
   * @throws Error - if `position` is not Object 
   * @throws Error - if `position` is not Object with keys: 'x' and 'y'
   */
  constructor(color, position) {
    if (typeof color !== 'string') {
      throw Error(`Cell.constructor color must be String`);
    }
    if (!['white', 'black'].includes(color)) {
      throw Error(`Cell.constructor color must be 'white' or 'black'`);
    }
    if (typeof position !== 'object' || position === null || Array.isArray(position)) {
      throw Error(`Cell.constructor position must be Object`);
    }
    if (!['x', 'y'].every(prop => Object.prototype.hasOwnProperty.call(position, prop))) {
      throw Error(`Cell.constructor position must be Object with keys x and y`);
    }
    let figure = null;
    let isAvailableFor = '';
    let isSelected = false;
    let showsPosition = ''; 
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
      },

      isSelected: {
        get: () => isSelected,
        set: (value) => {
          if (typeof value !== 'boolean') {
            throw Error(`Cell.isSelected.set(value) value must be Boolean`);
          }
          isSelected = value;
        }
      },

      showsPosition: {
        get: () => showsPosition,
        set: (value) => {
          if (typeof value !== 'string') {
            throw Error(`Cell.showsPosition.set(value) value must be String`);
          }
          if (!['', 'oldPosition', 'newPosition'].includes(value)) {
            throw Error(`Cell.showsPosition.set(value) value must be '' or 'oldPosition' or 'newPosition'`);
          }
          showsPosition = value;
        }
      }
    })
  }
}