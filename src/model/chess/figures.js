export default class Figures {
  /**
   * @class 
   * @alias Figures
   * @memberof Chess#
   * @classdesc This class stores same methods for all figures
   * @constructor
   */
  constructor() {}

  /**
   * @method check
   * @memberof Chess#Figures#
   * @param {Array} field chess board
   * @param {Number} x new `x` coordinate
   * @param {Number} y new `y` coordinate
   * @param {Object} position current figure position
   * @param {Object} available 
   * @param {Boolean} xray xray vision
   * @returns {Boolean} Boolean
   * @example 
   * const f = new Field()
   * const currentPosition = {x:0, y:0}
   * const available = {
   *   move: [],
   *   kill: [],
   *   check: [],
   *   wayToKing: [],
   *   cover: [],
   * };
   * this.check(f.board, 0, 1, currentPosition, available) // without xray
   * this.check(f.board, 0, 1, currentPosition, available, true) // with xray
   */
  check(field, x=0, y=0, position={}, available={}, xray=false) {
    position.x = x;
    position.y = y;
    if (field[x][y].figure !== null) {
      if (field[x][y].figure.color === this.color) {
        available.cover.push({...position})
        return true;
      }
      if (field[x][y].figure.name === 'King') {
        available.check.push({...position})
        return false; // xray for king to see what it does delete this line and make some check and available king moves 
      } 
      available.kill.push({...position});
      return xray ? false : true; /// enable WH(xray) change to false 
    }
    available.move.push({...position});
    return false;
  }

  /**
   * @method makeMove
   * @memberof Chess#Figures#
   * @param {Array} cordinates new position of figure [x, y]
   * @param {Array} field chess board
   * @param {Instance} figure figure instance
   * @returns {undefined} undefined
   * @example 
   * const f = new Field()
   * const coord = [3, 5]
   * const rook = new Rook('white', {x: 3, y: 7})
   * this.makeMove(coord, f.board, rook)
   */
  makeMove(cordinates, field, figure) {
    const moves = Object.values(this.available(field)).flat();
    const isMoveAvailable = moves.some((obj) => obj.x === cordinates[0] && obj.y === cordinates[1]);

    if (!isMoveAvailable) {
      return console.log(`wrong move ${figure.name}`);
    }

    this.moveFigure(field, figure, ...cordinates);
  }

  /**
   * @method moveFigure
   * @memberof Chess#Figures#
   * @param {Array} field chess board
   * @param {Instance} figure figure instance
   * @param {Number} x new `x` coordinate
   * @param {Number} y new `y` coordinate
   * @example
   * const f = new Field()
   * const rook = new Rook('white', {x: 3, y: 7})
   * this.moveFigure(f.board, rook, 3, 5) // moves rook on [3, 5] position
   */
  moveFigure(field, figure, x, y) {
    const old = field[ figure.position.x ][ figure.position.y ].figure;
    field[ figure.position.x ][ figure.position.y ].figure = null;
    figure.position.x = x;
    figure.position.y = y;
    field[ figure.position.x ][ figure.position.y ].figure = old;
  }
   
  /**
   * @method clearWayToKing
   * @memberof Chess#Figures#
   * @param {Object} available 
   * @returns {undefined} undefined
   */
  clearWayToKing(available) {
    if (available.check.length === 0) {
      available.wayToKing = [];
    }
  }

  /**
   * @method fillWayToKing
   * @memberof Chess#Figures#
   * @param {Object} available 
   * @param {Object} position this is object {x, y}
   * @returns {undefined} undefined
   */
  fillWayToKing(available, position) {
    if (available.check.length === 0) { 
      available.wayToKing.push({...position}) 
    }
  }
}