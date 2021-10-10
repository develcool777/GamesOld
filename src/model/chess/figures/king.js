import Figures from "../figures";

export default class King extends Figures {
  /**
   * @class
   * @alias King
   * @memberof Chess#Figures#
   * @augments Figures
   * @classdesc This class represents the logic of King figure
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
      throw Error(`King.constructor color must be String`);
    }
    if (!['white', 'black'].includes(color)) {
      throw Error(`King.constructor color must be 'white' or 'black'`);
    }
    if (typeof position !== 'object' || position === null || Array.isArray(position)) {
      throw Error(`King.constructor position must be Object`);
    }
    if (['x', 'y'].every(prop => !Object.prototype.hasOwnProperty.call(position, prop))) {
      throw Error(`King.constructor position must be Object with keys x and y`);
    }
    if (typeof side !== 'string') {
      throw Error(`King.constructor side must be String`);
    }
    if (!['up', 'down'].includes(side)) {
      throw Error(`King.constructor side must be 'up' or 'down'`);
    }
    const name = 'King';
    let firstMove = true;
    Object.defineProperties(this, {
      color: {
        get: () => color
      },
      side: {
        get: () => side,
        set: (value) => {
          if (typeof value !== 'string') {
            throw Error(`King.side.set(value) value be String`);
          }
          if (!['up', 'down'].includes(value)) {
            throw Error(`King.side.set(value) value must be 'up' or 'down'`);
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
            throw Error(`King.firstMove.set() value must be Boolean`);
          }
          firstMove = value;
        }
      }
    })
  }

    /**
   * @method available
   * @memberof Chess#Figures#King#
   * @description Returns all available moves for the figure
   * @param {Array} field chess board
   * @returns {Object} {
      move: [],
      kill: [],
      check: [],
      kingPosition: {},
      cover: [],
    }
   * @example 
   * const f = new Field()
   * this.available(f.board); 
   */
  available(field) {
    const available = {
      move: [],
      kill: [],
      castle: [],
      kingPosition: this.position,
      cover: []
    };
    
    const check = (x=0, y=0) => {
      if (field[x]?.[y] === undefined) { return }
      if (field[x][y].figure !== null) {
        if (field[x][y].figure.color !== this.color) { 
          return available.kill.push({x, y}) 
        }
        return available.cover.push({x, y});
      }
      return available.move.push({x, y})
    }

    const moves = [
      {x: -1, y: 0}, {x: 1, y: 0}, // up down
      {x: 0, y: 1}, {x: 0, y: -1}, // left right
      {x: 1, y: 1}, {x: 1, y: -1}, // downRight downLeft
      {x: -1, y: 1}, {x: -1, y: -1} // upRight upLeft
    ];

    moves.forEach(move => {
      check(this.position.x + move.x, this.position.y + move.y)
    })

    // castle 
    available.castle = this.firstMove ? this.availableCastle(field) : [];
    return available; 
  }

  /**
   * @method availableCastle
   * @memberof Chess#Figures#King#
   * @description Returns array of coordinates if castling available for king, otherwise empty array
   * @param {Array} field chess board
   * @returns {Array} [{x, y}, {x1, y1}]
   * @example 
   * const f = new Field()
   * const castle = this.availableCastle(f.board)
   */
  availableCastle(field) {
    const result = [];
    const condition = this.color === 'white' && this.side === 'down' || this.color === 'black' && this.side === 'up'; 
    const movesShort = condition ? [1, 2] : [-1, -2];
    const movesLong = condition ? [-1, -2, -3] : [1, 2, 3];

    if (this.checkCastle(field, movesShort, movesShort.length)) {
      result.push({x: this.position.x, y: condition ? 6 : 1});
    }
    if (this.checkCastle(field, movesLong, movesLong.length)) {
      result.push({x: this.position.x, y: condition ? 2 : 5}); 
    }
    return result;
  }

  /**
   * @method checkCastle
   * @memberof Chess#Figures#King#
   * @param {Array} field chess board
   * @param {Array} moves array of moves that need to checked
   * @param {Number} countEmpty represents how many empty cells must be to make castling
   * @description Returns true if castling is available 
   * @returns {Boolean} Boolean
   * @example 
   * const f = new Field()
   * this.checkCastle(f.board, [1, 2], 2) // checks short castling
   * this.checkCastle(f.board, [-1, -2, -3], 3) // checks long castling
   */
  checkCastle(field, moves, countEmpty) {
    const emptyCells = moves.reduce((acc, y) => {
      if (field[this.position.x][this.position.y + y].figure === null) {
        acc++; 
      }
      return acc
    }, 0);

    if (emptyCells !== countEmpty) {
      return false;
    }

    const figure = field[this.position.x][this.position.y + moves[0] * (countEmpty + 1)].figure
    if (figure?.name !== 'Rook' || !figure.firstMove) {
      return false;
    }

    return true;
  }

  /**
   * @method makeCastle
   * @memberof Chess#Figures#King#
   * @param {Array} cordinates this is coordinates of where king must be after castling 
   * @param {Array} field chess board
   * @description Makes castling
   * @returns {undefined} undefined
   * @example 
   * const f = new Field()
   * this.makeCastle([7, 6], f.board) // short castling for white
   * this.makeCastle([7, 2], f.board) // long castling for white
   * this.makeCastle([0, 6], f.board) // short castling for black
   * this.makeCastle([0, 2], f.board) // long castling for black
   */
  makeCastle(cordinates, field) {
    const castles = this.availableCastle(field);
    const isCastleAvailable = castles.some((obj) => obj.x === cordinates[0] && obj.y === cordinates[1]);

    if (!isCastleAvailable) { return }

    // determine where is rook
    let y = cordinates[1] > this.position.y ? 7 : 0;
    const rook = field[cordinates[0]][y].figure;
    let newRookPosition = y === 0 ? [cordinates[0], 3] : [cordinates[0], 5];
    const condition = this.color === 'white' && this.side === 'down' || this.color === 'black' && this.side === 'up'; 
    if (!condition) {
      newRookPosition = y === 0 ? [cordinates[0], 2] : [cordinates[0], 4]
    } 
 
    super.moveFigure(field, rook, ...newRookPosition);
    super.moveFigure(field, this, ...cordinates);
    this.firstMove = false;
    rook.firstMove = false;
  }

  /**
   * @method makeMove
   * @memberof Chess#Figures#King#
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