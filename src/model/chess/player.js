import Pawn from '@/model/chess/figures/pawn'
import Rook from '@/model/chess/figures/rook'
import Bishop from '@/model/chess/figures/bishop'
import Queen from '@/model/chess/figures/queen'
import Knight from '@/model/chess/figures/knight'
import King from '@/model/chess/figures/king'

export default class Player {
  constructor(side) {
    if (typeof side !== 'string') {
      throw Error(`Cell.constructor side must be String`);
    }
    if (!['black', 'white'].includes(side)) {
      throw Error(`Cell.constructor side must be white or black`);
    }

    let positions = [];
    let isCheck = false;
    Object.defineProperties(this, {
      side: {
        get: () => side 
      },
      positions: {
        get: () => positions, 
        set: (value) => {
          if (!Array.isArray(value)) {
            throw Error(`Player.positions.set(value) value must be Array`);
          }
          positions = value;
        }
      },
      isCheck: {
        get: () => isCheck,
        set: (value) => {
          if (typeof value !== 'boolean') {
            throw Error(`Player.isCheck.set(value) value must be Array`);
          }
        }
      }
    })
  }

  createPositions() {
    const result = [];

    for (let i = 0; i < 16; i++) {
      if (i < 8) {
        const decide = this.side === 'white' ? 7 : 0;
        result.push({x: decide, y: i});
      }
      else {
        const decide = this.side === 'white' ? 6 : 1;
        result.push({x: decide, y: i - 8});
      }
    }

    this.positions = result;
    return result;
  }

  createFigures(field) {
    field[this.positions[0].x][this.positions[0].y].figure = new Rook(this.side, this.positions[0]);
    field[this.positions[1].x][this.positions[1].y].figure = new Knight(this.side, this.positions[1]);
    field[this.positions[2].x][this.positions[2].y].figure = new Bishop(this.side, this.positions[2]);
    field[this.positions[3].x][this.positions[3].y].figure = new Queen(this.side, this.positions[3]);
    field[this.positions[4].x][this.positions[4].y].figure = new King(this.side, this.positions[4]);
    field[this.positions[5].x][this.positions[5].y].figure = new Bishop(this.side, this.positions[5]);
    field[this.positions[6].x][this.positions[6].y].figure = new Knight(this.side, this.positions[6]);
    field[this.positions[7].x][this.positions[7].y].figure = new Rook(this.side, this.positions[7]);

    for (let i = 8; i < 16; i++) {
      field[this.positions[i].x][this.positions[i].y].figure = new Pawn(this.side, this.positions[i]);
    }
  }

  getKing(field) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const cell = field[i][j];
        if (cell.figure !== null) {
          const figure = cell.figure;
          if (figure.name === 'King' && figure.color === this.side) {
            return figure;
          }
        }
      }
    }
  }

  kingMoves(field) {
    const king = this.getKing(field);
    const available = king.available(field);
    return available;
  }

  countFigures(field) {
    let obj = {
      all: {
        quantity: 0,
        figures: []
      },
      pawns: 0,
      queen: 0,
      bishops: 0,
      knights: 0,
      rooks: 0,
    }

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const cell = field[i][j];
        if (cell.figure !== null) {
          const figure = cell.figure;
          if (figure.name === 'Pawn' && figure.color === this.side) {
            obj.pawns++;
          }
          if (figure.name === 'Queen' && figure.color === this.side) {
            obj.queen++;
          }
          if (figure.name === 'Rook' && figure.color === this.side) {
            obj.rooks++;
          }
          if (figure.name === 'Knight' && figure.color === this.side) {
            obj.knights++;
          }
          if (figure.name === 'Bishop' && figure.color === this.side) {
            obj.bishops++;
          }
          if (figure.color === this.side && figure.name !== 'King') {
            obj.all.quantity++;
            obj.all.figures.push(figure);
          }
        }
      }
    }
    return obj;
  }

  allAvailableMoves(field, whatType='', xray=false) {
    if (typeof whatType !== 'string') {
      throw Error(`Player.allAvailableMoves(field, whatType) whatType must be String`)
    }
    if (!['all', 'check', 'kill', 'move', 'moveAndKill', 'cover', 'pawn'].includes(whatType)) {
      throw Error(`Player.allAvailableMoves(field, whatType) whatType must be 'all' or 'check' or 'kill' or 'move' or 'moveAndKill' or 'cover' or 'pawn'`)
    }
    const allFigures = this.countFigures(field);
    const figures = allFigures.all.figures;
    const availableMoves = figures.reduce((acc, figure) => {
      if (!['pawn', 'check', 'moveAndKill', 'cover'].includes(whatType) && figure.name === 'Pawn') { return acc }
      const moves = ['Pawn', 'Knight'].includes(figure.name) ? figure.available(field) : figure.available(field, xray);
      if (moves.move.length > 0 && ['all', 'move', 'moveAndKill'].includes(whatType)) {
        acc.push(...moves.move);
      } 
      if (moves.kill.length > 0 && ['all', 'kill', 'moveAndKill'].includes(whatType)) {
        acc.push(...moves.kill);
      } 
      if (moves.check.length > 0 && ['all', 'check'].includes(whatType)) {
        acc.push(...moves.check);
      }
      if (moves.cover.length > 0 && ['all', 'cover'].includes(whatType)) {
        acc.push(...moves.cover);
      }
      if (moves.dontAllowKingToMove !== undefined && 'pawn' === whatType) {
        acc.push(...moves.dontAllowKingToMove);
      }
      return acc;
    }, []);
    return availableMoves;
  }

  getAttackFigures(field, xray=false) {
    const allFigures = this.countFigures(field);
    const figures = allFigures.all.figures
    return figures.reduce((acc, figure) => {
      const moves = figure.available(field, xray);
      if (moves.check.length > 0) {
        acc.push(figure);
      }
      return acc;
    }, []);
  }
}