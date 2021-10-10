import Pawn from '@/model/chess/figures/pawn'
import Rook from '@/model/chess/figures/rook'
import Bishop from '@/model/chess/figures/bishop'
import Queen from '@/model/chess/figures/queen'
import Knight from '@/model/chess/figures/knight'
import King from '@/model/chess/figures/king'

export default class Player {
  /**
   * @class 
   * @alias Player
   * @memberof Chess#
   * @param {String} side - side must be 'white' or 'black'
   * @classdesc This class represents logic of the player
   * @constructor
   * @throws Error - if `side` is not String
   * @throws Error - if `side` is not 'black' or 'white'
   * @property {String} side - this `side`
   * @property {Array} positions - array of figures positions which set at the beginning of the game
   */
  constructor(side, color) {
    if (typeof side !== 'string') {
      throw Error(`Player.constructor side must be String`);
    }
    if (!['up', 'down'].includes(side)) {
      throw Error(`Player.constructor side must be up or down`);
    }
    if (typeof color !== 'string') {
      throw Error(`Player.constructor color must be String`);
    }
    if (!['black', 'white'].includes(color)) {
      throw Error(`Player.constructor color must be white or black`);
    }

    let positions = [];
    Object.defineProperties(this, {
      side: {
        get: () => side,
        set: (value) => {
          if (typeof value !== 'string') {
            throw Error(`Player.side.set(value) value be String`);
          }
          if (!['up', 'down'].includes(value)) {
            throw Error(`Player.side.set(value) value must be 'up' or 'down'`);
          }
          side = value;
        } 
      },
      color: {
        get: () => color 
      },
      positions: {
        get: () => positions, 
        set: (value) => {
          if (!Array.isArray(value)) {
            throw Error(`Player.positions.set(value) value must be Array`);
          }
          positions = value;
        }
      }
    })
  }

  /**
   * @method createPositions
   * @memberof Chess#Player#
   * @description creates figures position
   * @returns {undefined} undefined
   * @example this.createPositions()
   */
  createPositions() {
    const result = [];

    for (let i = 0; i < 16; i++) {
      if (i < 8) {
        const decideX = this.side === 'down' ? 7 : 0;
        result.push({x: decideX, y: i});
      }
      else {
        const decideX = this.side === 'down' ? 6 : 1;
        result.push({x: decideX, y: i - 8});
      }
    }

    this.positions = result;
  }

  /**
   * @method createFigures
   * @memberof Chess#Player#
   * @description Creates players figures and sets them on the chess board by `this.positions` 
   * @param {Array} field chess board
   * @returns {undefined} undefined
   * @throws Error - if positions is empty array
   * @example 
   * const f = new Field()
   * this.createFigures(f.board)
   */
  createFigures(field) {
    if (this.positions.length === 0) {
      throw Error(`Player.createFigures(field) positions is empty array`);
    }
    field[this.positions[0].x][this.positions[0].y].figure = new Rook(this.color, this.positions[0], this.side);
    field[this.positions[1].x][this.positions[1].y].figure = new Knight(this.color, this.positions[1], this.side);
    field[this.positions[2].x][this.positions[2].y].figure = new Bishop(this.color, this.positions[2], this.side);
    field[this.positions[3].x][this.positions[3].y].figure = new Queen(this.color, this.positions[3], this.side);
    field[this.positions[4].x][this.positions[4].y].figure = new King(this.color, this.positions[4], this.side);
    field[this.positions[5].x][this.positions[5].y].figure = new Bishop(this.color, this.positions[5], this.side);
    field[this.positions[6].x][this.positions[6].y].figure = new Knight(this.color, this.positions[6], this.side);
    field[this.positions[7].x][this.positions[7].y].figure = new Rook(this.color, this.positions[7], this.side);

    for (let i = 8; i < 16; i++) {
      field[this.positions[i].x][this.positions[i].y].figure = new Pawn(this.color, this.positions[i], this.side);
    }
  }

  /**
   * @method getKing
   * @memberof Chess#Player#
   * @param {Array} field chess board
   * @description Returns player king
   * @returns {Instance} Instance
   * @example 
   * const f = new Field()
   * const king = this.getKing(f.board)
   */
  getKing(field) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const cell = field[i][j];
        if (cell?.figure?.name === 'King' && cell?.figure?.color === this.color) {
          return cell.figure;
        }
      }
    }
  }

  /**
   * @method kingMoves
   * @memberof Chess#Player#
   * @param {Array} field chess board
   * @description Returns king available moves
   * @returns {Object} Object
   * @example 
   * const f = new Field()
   * const kingMoves = this.kingMoves(f.board)
   */
  kingMoves(field) {
    const king = this.getKing(field);
    const available = king.available(field);
    return available;
  }

  /**
   * @method countFigures
   * @memberof Chess#Player#
   * @param {Array} field chess board
   * @description Counts all figure that player have except king
   * @returns {Object} Object
   * @example 
   * const f = new Field()
   * const figures = this.countFigures(f.board)
   */
  countFigures(field) {
    let obj = {
      all: {
        quantity: 0,
        figures: []
      },
      pawn: 0,
      queen: 0,
      bishop: 0,
      knight: 0,
      rook: 0,
    }

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const cell = field[i][j];
        const figure = cell.figure;
        if (figure?.name === 'Pawn' && figure?.color === this.color) {
          obj.pawn++;
        }
        if (figure?.name === 'Queen' && figure?.color === this.color) {
          obj.queen++;
        }
        if (figure?.name === 'Rook' && figure?.color === this.color) {
          obj.rook++;
        }
        if (figure?.name === 'Knight' && figure?.color === this.color) {
          obj.knight++;
        }
        if (figure?.name === 'Bishop' && figure?.color === this.color) {
          obj.bishop++;
        }
        if (figure?.color === this.color && figure?.name !== 'King') {
          obj.all.quantity++;
          obj.all.figures.push(figure);
        }
      }
    }
    return obj;
  }

  /**
   * @method allAvailableMoves
   * @memberof Chess#Player#
   * @param {Array} field chess board 
   * @param {String} whatType Describes which type of moves need to get
   * @param {Boolean} xray if value `true` enables xray vision, otherwise not
   * @description Returns array of available figures moves
   * @returns {Array} Array
   * @throws Error - if `whatType` is not String
   * @throws Error - if `whatType` is not 'all' or 'check' or 'kill' or 'move' or 'moveAndKill' or 'cover' or 'pawn'
   * @throws Error - if `xray` is not Boolean
   * @example 
   * const f = new Field()
   * const allMoves = this.allAvailableMoves(f.board, 'move')
   */
  allAvailableMoves(field, whatType='', xray=false) {
    if (typeof whatType !== 'string') {
      throw Error(`Player.allAvailableMoves(field, whatType, xray) whatType must be String`)
    }
    if (!['all', 'check', 'kill', 'move', 'moveAndKill', 'cover', 'pawn'].includes(whatType)) {
      throw Error(`Player.allAvailableMoves(field, whatType, xray) whatType must be 'all' or 'check' or 'kill' or 'move' or 'moveAndKill' or 'cover' or 'pawn'`);
    }
    if (typeof xray !== 'boolean') {
      throw Error(`Player.allAvailableMoves(field, whatType, xray) xray must be Boolean`);
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
  /**
   * @method checkDefendMoves
   * @memberof Chess#Player#
   * @param {Function} callback pass only this [`figureMoves`]{@link Chess#Game#figureMoves} function
   * @param {Array} field chess board
   * @description Gets all available moves and kills
   * @returns {Array} Array
   * @example 
   * const g = new Game()
   * const f = new Field()
   * const defendMoves = this.checkDefendMoves(g.figureMoves.bind(this), f.board)
   */
  checkDefendMoves(callback, field) {
    const allFigures = this.countFigures(field);
    const figures = allFigures.all.figures;
    const availableDefendMoves = figures.reduce((acc, figure) => {
      const moves = callback(figure);
      if (moves.move.length > 0) {
        acc.push(...moves.move);
      } 
      if (moves.kill.length > 0) {
        acc.push(...moves.kill);
      } 
      return acc;
    }, []);
    return availableDefendMoves;
  }

  /**
   * @method getAttackFigures
   * @memberof Chess#Player#
   * @param {Array} field chess board
   * @param {Boolean} xray xray vision
   * @description Get figures moves
   * @returns {Array} Array
   * @example 
   * const f = new Field()
   * const attackFigures = this.getAttackFigures(f.board) // without xray
   * const attackFigures = this.getAttackFigures(f.board, true) // with xray
   */
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