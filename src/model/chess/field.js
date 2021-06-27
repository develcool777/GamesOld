/* eslint-disable no-empty */
import Cell from './cell'
export default class Field {
// const Cell = require("./cell");
// module.exports = class Field {
  constructor() {
    const field = [];
    Object.defineProperties(this, {
      field: {
        get: () => field
      }
    })
  }

  createField() {
    // console.log(this.field)
    for (let i=0; i<8; i++) {
      const row = [];
      for (let j=0; j<8; j++) {
        if (i % 2 === 0) {
          row.push(new Cell( j % 2 === 0 ? 'white' : 'black'))
        } else {
          row.push(new Cell( j % 2 === 0 ? 'black' : 'white'))
        }
      }
      this.field.push(row);
    }
    // console.log(this.field[1][0].color, this.field[1][1].color, this.field[1][2].color)
    // console.log(JSON.stringify(this.field, null, 2))
  }
}