import Cell from './cell'

export default class Field {
  /**
   * @class
   * @alias Field
   * @memberof Chess#
   * @classdesc This class have methods to create chess board
   * @constructor
   * @property {Array} board - this is matrix where every element is instance of [`Cell`]{@link Chess#Cell}
   * @property {Boolean} isBoardFlipped - value is `false` if black side is `up` and white is `down`, otherwise true
   * @property {Array} historyOfMoves - array of all moves that were made during the game
   * @property {Number} historyIndex - index in `historyOfMoves`
   */
  constructor() {
    let board = [];
    let isBoardFlipped = false;
    let historyIndex = 0;
    let historyOfMoves = [];
    Object.defineProperties(this, {
      board: {
        get: () => board,
        set: (value) => {
          if (!Array.isArray(value)) {
            throw Error(`Field.board.set(value) value must be Array`);
          }
          if (!value.every(arr => Array.isArray(arr))) {
            throw Error(`Field.board.set(value) value must be 2D Array`);
          }
          if (!value.every(arr => arr.every(item => item instanceof Cell))) {
            throw Error(`Field.board.set(value) every element of value must be instance of Cell`);
          }
          board = value;
        }
      },

      isBoardFlipped: {
        get: () => isBoardFlipped,
        set: (value) => {
          if (typeof value !== 'boolean') {
            throw Error(`Field.isBoardFlipped.set(value) value must be Boolean`);
          }
          isBoardFlipped = value;
        }
      },

      historyIndex: {
        get: () => historyIndex,
        set: (value) => {
          if (!Number.isInteger(value)) {
            throw Error(`Field.historyIndex.set(value) value must be Integer`);
          }
          if (0 > value && value >= historyOfMoves.length) {
            throw Error(`Field.historyIndex.set(value) value must be in range of historyOfMoves`);
          }
          historyIndex = value;
        }
      },

      historyOfMoves: {
        get: () => historyOfMoves,
        set: (value) => {
          if (!Array.isArray(value)) {
            throw Error(`Game.historyOfMoves.set(value) value must be Array`);
          }
          historyOfMoves = value;
        }
      },
    })
  }

  /**
   * @method createBoard
   * @memberof Chess#Field#
   * @description Creates chess board
   * @returns {undefined} undefined
   * @example this.createBoard()
   */
  createBoard() {
    const board = [];
    for (let i=0; i<8; i++) {
      const row = [];
      for (let j=0; j<8; j++) {
        if (i % 2 === 0) {
          row.push(new Cell( j % 2 === 0 ? 'white' : 'black', {x: i, y: j}))
        } else {
          row.push(new Cell( j % 2 === 0 ? 'black' : 'white', {x: i, y: j}))
        }
      }
      board.push(row);
    }
    this.board = board;
  }

  /**
   * @method clearBoard
   * @memberof Chess#Field#
   * @description Clears the chess board
   * @returns {undefined} undefined
   * @throws Error - if `this.board` is Empty
   * @example this.clearBoard()
   */
  clearBoard() {
    if (this.board.length === 0) {
      throw Error(`Field.clearBoard() board is empty`);
    }
    
    this.board.splice(0);
    this.isBoardFlipped = false;
    this.historyIndex = 0;
    this.historyOfMoves.splice(0);
  }

  /**
   * @async
   * @method boardCopy
   * @memberof Chess#Field#
   * @param {Array} board - chess board
   * @description Makes copy of `board`
   * @returns {Array} Array
   * @throws Error - if `this.board` is Empty
   * @example const copyBoard = await this.boardCopy()
   */
  async boardCopy(board) {
    if (board.length === 0) {
      throw Error(`Field.fieldForHistory() board is empty`);
    }
    return await Promise.all(
      board.map(async arr => {
        return await Promise.all(arr.map(async cell => {
          const cellPosition = Object.assign({}, cell.position)
          const newCell = new Cell(cell.color, cellPosition);
          newCell.isAvailableFor = cell.isAvailableFor;
          newCell.showsPosition = cell.showsPosition;
          const figure = cell.figure;
          if (figure !== null) {
            let {default: Figure} = await import(`@/model/chess/figures/${figure.name.toLowerCase()}`);
            const position = Object.assign({}, figure.position);
            newCell.figure = new Figure(figure.color, position, figure.side);
            // restore Pawn properties
            if (newCell.figure.name === 'Pawn') {
              newCell.figure.firstMove = figure.firstMove;
              newCell.figure.promotion = figure.promotion;
              newCell.figure.enPassant = figure.enPassant;
            }

            // restore Rook properties
            if (newCell.figure.name === 'Rook') {
              newCell.figure.firstMove = figure.firstMove;
            }

            // restore King properties
            if (figure.name === 'King') {
              newCell.figure.firstMove = figure.firstMove;
            }
            return newCell;
          } 

          newCell.figure = figure;
          return newCell;
        }))
      })
    );
  }

  /**
   * @method flipBoard
   * @memberof Chess#Field#
   * @param {Array} board - chess board
   * @param {Object} enPassant - pawn which ready for enPassant{x, y}
   * @param {String} plws - playerWhiteSide can be 'down' or 'up'
   * @param {String} plbs - playerBlackSide can be 'down' or 'up'
   * @param {Boolean} isAnalyze - if value is `true` let to change `enPassant`
   * @description Flips chess board   
   * @returns {undefined} undefined
   * @throws Error - if `board` is not Array
   * @throws Error - if `board` is not 2D Array
   * @throws Error - if every element of `board` is not instance of [`Cell`]{@link Chess#Cell}
   * @throws Error - if `plws` is not String
   * @throws Error - if `plws` is not 'up' or 'down'
   * @throws Error - if `plbs` is not String
   * @throws Error - if `plbs` is not 'up' or 'down'
   * @throws Error - if `plws` equals `plbs`
   * @throws Error - if `isAnalyze` is not Boolean
   * @example this.flipBoard()
   */
   flipBoard(board, enPassant, plws='down', plbs='up', isAnalyze=false) {
    if (!Array.isArray(board)) {
      throw Error(`Field.flipBoard() board must be Array`);
    }
    if (!board.every(arr => Array.isArray(arr))) {
      throw Error(`Field.flipBoard() board must be 2D Array`);
    }
    if (!board.every(arr => arr.every(item => item instanceof Cell))) {
      throw Error(`Field.flipBoard() every element of board must be instance of Cell`);
    }
    if (typeof plws !== 'string') {
      throw Error(`Field.flipBoard() plws must be String`);
    }
    if (!['up', 'down'].includes(plws)) {
      throw Error(`Field.flipBoard() plws must be 'up' or 'down'`);
    }
    if (typeof plbs !== 'string') {
      throw Error(`Field.flipBoard() plbs must be String`);
    }
    if (!['up', 'down'].includes(plbs)) {
      throw Error(`Field.flipBoard() plbs must be 'up' or 'down'`);
    }
    if (plws === plbs) {
      throw Error(`Field.flipBoard() plbs must not equal plws`);
    }
    if (typeof isAnalyze !== 'boolean') {
      throw Error(`Field.flipBoard() isAnalyze must be Boolean`);
    }
    const transpose = matrix => {
      for (let row = 0; row < matrix.length; row++) {
        for (let column = 0; column < row; column++) {
          let temp = matrix[row][column];
          matrix[row][column] = matrix[column][row];
          matrix[column][row] = temp;
        }
      }
      return matrix;
    }
    const reverse = matrix => matrix.map(row => row.reverse());

    reverse(transpose(reverse(transpose(board))));
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const cell = board[i][j];
        // change position of figure
        if (cell.figure !== null) {
          const color = cell.figure.color;
          cell.figure.side = color === 'white' ? plws : plbs;
          cell.figure.position.x = i;
          cell.figure.position.y = j;
          if (cell.figure.name === 'Pawn' && cell.figure.enPassant && !isAnalyze) {
            enPassant.x = i;
            enPassant.y = j;
          }
        }

        // change position of cell
        cell.position.x = i; 
        cell.position.y = j;
      }
    }
  }

  /**
   * @async
   * @method returnMove
   * @memberof Chess#Field#
   * @description Returns move, return {field, whoMoved, isCheck, isCheckmate, isStalemate, enPassant, playerWhiteSide, playerBlackSide}
   * @returns {Object} Object
   * @example const prevMove = await this.returnMove()
   */
  async returnMove() {
    if (this.historyOfMoves.length === 1) {
      return;
    }

    this.historyOfMoves.pop();
    this.historyIndex--;
    const prev = this.historyOfMoves[this.historyOfMoves.length - 1]; // .at(-1) in electron doesnt work
    const copyOfHistoryBoard = await this.boardCopy(prev.field); 
    this.isBoardFlipped && this.flipBoard(copyOfHistoryBoard, prev.enPassant, 'up', 'down');
    this.board = copyOfHistoryBoard;
    return prev;
  }

  /**
   * @async
   * @method makeHistory
   * @memberof Chess#Field#
   * @description Makes history
   * @param {Object} object - object {
   *  whoMoved, isCheck, isCheckmate, isStalemate, 
   *  enPassant, playerWhiteSide, playerBlackSide,
   *  notation, index, materialRatio
   * } 
   * @returns {undefined} undefined
   * @example
   * const obj = {
   *    whoMoved: 'white',
   *    isCheck: true,
   *    isCheckmate: false,
   *    isStalemate: false,
   *    enPassant: null,
   *    playerWhiteSide: 'down',
   *    playerBlackSide: 'up'
   *    notation: {},
   *    index: 0,
   *    materialRatio: -1
   * } 
   * await this.makeHistory(obj);
   */
  async makeHistory(object) {
    const boardCopy = await this.boardCopy(this.board); 
    this.isBoardFlipped && this.flipBoard(boardCopy, object.enPassant);

    const obj = {
      field: boardCopy,
      whoMoved: object.whoMoved,
      isCheck: object.isCheck,
      isCheckmate: object.isCheckmate,
      isStalemate: object.isStalemate,
      enPassant: object.enPassant,
      playerWhiteSide: object.playerWhiteSide,
      playerBlackSide: object.playerBlackSide,
      notation: object.notation,
      index: this.historyIndex += object.whoMoved === '' ? 0 : 1,
      materialRatio: object.materialRatio
    }

    this.historyOfMoves.push(obj);
  }

  /**
   * @async
   * @method showHistory
   * @memberof Chess#Field#
   * @param {Number} index - history index
   * @description Shows move in history by index, returns Object {
   *  whoMoved, isCheck, isCheckmate, isStalemate, 
   *  enPassant, playerWhiteSide, playerBlackSide,
   *  notation, index, materialRatio
   * }
   * @throws Error - if `index` is not Integer
   * @returns {Object} Object
   * @example await this.showHistory(0);
   */
  async showHistory(index) {
    if (!Number.isInteger(index)) {
      throw Error(`Field.showHistory(index) index must be Integer`);
    }

    this.historyIndex = index;
    const historyMove = this.historyOfMoves[this.historyIndex];
    this.board = await this.boardCopy(historyMove.field);

    this.isBoardFlipped && this.flipBoard(this.board, historyMove.enPassant); 
    return historyMove;
  }
}