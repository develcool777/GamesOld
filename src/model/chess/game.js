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
    let whoMoves = 'white';
    let selectedCell = null;
    let oldPosition = null;
    let newPosition = null;
    let isCheck = false;
    let isPawnPromotion = false;
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
      whoMoves: {
        get: () => whoMoves,
        set: (value) => {
          if (typeof value !== 'string') {
            throw Error(`Game.whoMoves.set(value) value must be String`);
          }
          if (!['white', 'black'].includes(value)) {
            throw Error(`Game.whoMoves.set(value) value must be 'white' or 'black'`);
          }
          whoMoves = value;
        }
      },
      selectedCell: {
        get: () => selectedCell,
        set: (value) => {
          // here must awsome check for value 
          selectedCell = value;
        }
      },
      oldPosition: {
        get: () => oldPosition,
        set: (value) => {
          // here must awsome check for value 
          oldPosition = value;
        }
      },
      newPosition: {
        get: () => newPosition,
        set: (value) => {
          // here must awsome check for value 
          newPosition = value;
        }
      },
      isCheck: {
        get: () => isCheck,
        set: (value) => {
          // here must awsome check for value 
          isCheck = value;
        }
      },
      isPawnPromotion: {
        get: () => isPawnPromotion,
        set: (value) => {
          // here must awsome check for value 
          isPawnPromotion = value;
        }
      }
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
    this.selectedCell = cell;
  }

  clickOnCellForMove(cell, x, y) {
    // call clickOnFigure if figure was clicked
    if (cell.figure !== null && cell.isAvailableFor !== 'kill') {
      if (cell.figure.color !== this.whoMoves) { return }
      this.clickOnFigure(cell);
      return;
    }
    // if figure was clicked but new click was not on available moves
    if (cell.isAvailableFor === '') { 
      this.clearAvailableMove();
      this.selectedCell = null;
      return;
    }

    const figure = this.selectedCell.figure
    this.oldPosition = Object.assign({}, figure.position);

    if (cell.isAvailableFor === 'castle') {
      figure.makeCastle([x,y], this.field.board)
    } else {
      figure.makeMove([x,y], this.field.board);
      this.whoMoves = this.whoMoves === 'white' ? 'black' : 'white';
    }

    this.newPosition = Object.assign({}, figure.position);
    this.selectedCell = null;

    this.checkPawnPromotion(figure, x, y);
    this.checkForCheck(figure);
    this.clearAvailableMove();
  }

  clearAvailableMove() {
    this.field.board.forEach((row, ) => {
      row.forEach((cell, ) => {
        if (this.isCheck && cell.isAvailableFor === 'check') { return }
        if (this.isPawnPromotion && cell.isAvailableFor === 'promotion') { return }
        cell.isAvailableFor = '';
      })
    })
  }

  checkPawnPromotion(figure, x, y) {
    if (figure.name !== 'Pawn') {
      return;
    }

    if (figure.promotion) {
      this.isPawnPromotion = true;
      this.field.board[x][y].isAvailableFor = 'promotion';
    }
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
    this.isPawnPromotion = false;
    field[position.x][position.y].figure = fig;
    field[position.x][position.y].isAvailableFor = '';
  }

  checkForCheck(figure) {
    // determine player who make check
    const playerAttack = figure.color === this.playerWhite.side ? this.playerWhite : this.playerBlack;
    const playerDefend = playerAttack.side === 'white' ? this.playerBlack : this.playerWhite;

    const allAvailableMoves = playerAttack.allAvailableMoves(this.field.board);
    const allKingMoves = playerDefend.kingMoves(this.field.board);
    // console.log(allAvailableMoves, allKingMoves);
    
    // is it check?
    const kingPosition = allKingMoves.kingPosition;
    this.isCheck = allAvailableMoves.some(move => move.x === kingPosition.x && move.y === kingPosition.y);
    if (!this.isCheck) { return }

    this.field.board[kingPosition.x][kingPosition.y].isAvailableFor = 'check';

  }

  // checkDefendNoves(attackFigure, sideDefend='') {

  // }

}