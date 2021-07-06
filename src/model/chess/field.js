/* eslint-disable no-empty */
import Cell from './cell'
export default class Field {
  constructor() {
    const board = [];
    Object.defineProperties(this, {
      board: {
        get: () => board
      }
    })
  }

  createField() {
    // console.log(this.field)
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
    // console.log(this.field[1][0].color, this.field[1][1].color, this.field[1][2].color)
    // console.log(JSON.stringify(this.field, null, 2))
  }
}