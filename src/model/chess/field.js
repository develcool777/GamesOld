import Cell from './cell'

export default class Field {
  /**
   * @class
   * @alias Field
   * @memberof Chess#
   * @classdesc This class have methods to create chess board
   * @constructor
   * @property {Array} board - this is matrix where every element is instance of [`Cell`]{@link Chess#Cell}
   */
  constructor() {
    const board = [];
    Object.defineProperties(this, {
      board: {
        get: () => board
      }
    })
  }

  /**
   * @method createField
   * @memberof Chess#Field#
   * @description Creates chess board
   * @returns {undefined} undefined
   * @example this.createField()
   */
  createField() {
    for (let i=0; i<8; i++) {
      const row = [];
      for (let j=0; j<8; j++) {
        if (i % 2 === 0) {
          row.push(new Cell( j % 2 === 0 ? 'white' : 'black', {x: i, y: j}))
        } else {
          row.push(new Cell( j % 2 === 0 ? 'black' : 'white', {x: i, y: j}))
        }
      }
      this.board.push(row);
    }
  }

  /**
   * @method clearField
   * @memberof Chess#Field#
   * @description Clears the chess board from figures
   * @returns {undefined} undefined
   * @throws Error - if `this.board` is Empty
   * @example this.clearField()
   */
  clearField() {
    if (this.board.length === 0) {
      throw Error(`Field.clearField() board is empty`);
    }
    this.board.forEach((row, x) => {
      row.forEach((_, y) => {
        this.board[x][y].isAvailableFor = '';
        this.board[x][y].figure = null;
      })
    });
  }
}