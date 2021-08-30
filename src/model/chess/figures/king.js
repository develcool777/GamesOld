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
   * @constructor
   * @property {String} color - this `color`
   * @property {Object} position - this `position`
   * @property {String} name - name of the figure
   * @property {Boolean} firstMove - if rook have not made move yet, the value is `true` otherwise `false`
   * @throws Error - if `color` is not String
   * @throws Error - if `color` is not 'white' or 'black'
   * @throws Error - if `position` is Object with keys: 'x' and 'y'
   */
  constructor(color, position) {
    super();

    if (typeof color !== 'string') {
      throw Error(`King.constructor color must be String`);
    }
    if (!['white', 'black'].includes(color)) {
      throw Error(`King.constructor color must be 'white' or 'black'`);
    }
    if (Object.keys(position).join('') !== 'xy') {
      throw Error(`King.constructor position must be Object with keys x and y`);
    }
    const name = 'King';
    let firstMove = true;
    Object.defineProperties(this, {
      color: {
        get: () => color
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
      wayToKing: [],
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
      if (field[x] === undefined || field[x][y] === undefined) { return }
      if (field[x][y].figure !== null) {
        if (field[x][y].figure.color !== this.color) { available.kill.push({x, y}) }
        available.cover.push({x, y});
        return;
      }
      available.move.push({x, y})
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

    // if this is not King first move 
    if (!this.firstMove) {
      return available;
    }

    // castle 
    available.castle = this.availableCastle(field);
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
    const result = []
    const movesShort = [1, 2];
    const movesLong = [-1, -2, -3];
    if (this.checkCastle(field, movesShort, movesShort.length)) {
      result.push({x: this.position.x, y: 6});
    }
    if (this.checkCastle(field, movesLong, movesLong.length)) {
      result.push({x: this.position.x, y: 2}); 
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
    if (figure.name !== 'Rook') {
      return false;
    }

    if (!figure.firstMove) {
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
    const sign = cordinates[1] > this.position.y ? 1 : -2;
    const rook = field[cordinates[0]][cordinates[1] + sign].figure;
    const newRookPosition = sign < 0 ? [cordinates[0], 3] : [cordinates[0], 5];

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