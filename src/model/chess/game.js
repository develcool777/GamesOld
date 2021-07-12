import Player from "./player";
import Field from "./field";
import Rook from '@/model/chess/figures/rook'
import Bishop from '@/model/chess/figures/bishop'
import Queen from '@/model/chess/figures/queen'
import Knight from '@/model/chess/figures/knight'
export default class Game {
  constructor() {
    const field = new Field();
    const playerWhite = new Player('white');
    const playerBlack = new Player('black');
    Object.defineProperties(this, {
      field: {
        get: () => field
      },
      playerWhite: {
        get: () => playerWhite
      },
      playerBlack: {
        get: () => playerBlack
      },
    })
  }

  createField() {
    this.field.createField();
  }

  createFigures() {
    this.playerWhite.createPositions();
    this.playerWhite.createFigures(this.field.board);

    this.playerBlack.createPositions();
    this.playerBlack.createFigures(this.field.board);
  }

  clickOnFigure(cell) {
    this.clearAvailableMove();
    const availableMoves = Object.entries(cell.figure.available(this.field.board));
    availableMoves.forEach((moves) => {
      if (moves[1].length > 0) {
        moves[1].forEach(move => {
          this.field.board[move.x][move.y].isAvailableFor = moves[0] 
        })
      }
    })
  }

  clearAvailableMove() {
    this.field.board = this.field.board.map((row, ) => {
      return row.map((cell, ) => {
        // if (cell.isAvailableFor === 'check') {
        //   return cell;
        // }
        cell.isAvailableFor = '';
        return cell;
      })
    })
  }

  pawnPromotion(field, figureName, position) {
    const color = figureName.substring(0, 5);
    const name = figureName.substring(5);
    let fig;
    if (name === 'Queen') {
      fig = new Queen(color, position)
    }
    if (name === 'Rook') {
      fig = new Rook(color, position)
    }
    if (name === 'Bishop') {
      fig = new Bishop(color, position)
    }
    if (name === 'Knight') {
      fig = new Knight(color, position)
    }
    field[position.x][position.y].figure = fig;
    field[position.x][position.y].isAvailableFor = '';
  }
}