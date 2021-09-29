import Player from "./player";
import Field from "./field";

/**
 * @namespace Chess
 */

export default class Game {
  /**
   * @class
   * @alias Game
   * @memberof Chess#
   * @classdesc This class represents logic of chess game
   * @constructor
   * @property {Instance} field - instance of [`Field`]{@link Chess#Field}
   * @property {Instance} playerWhite - instance of [`Field`]{@link Chess#Player}, white side
   * @property {Instance} playerBlack - instance of [`Field`]{@link Chess#Player}, black side
   * @property {Array} defendMoves - array defend moves
   * @property {Array} historyOfMoves - array of all moves that were made during the game
   * @property {String} whoMoves - shows who moves
   * @property {Object} selectedCell - stores the instance of selected [`Cell`]{@link Chess#Cell}
   * @property {Object} oldPosition - object{x, y} of old position 
   * @property {Object} newPosition - object{x, y} of new position
   * @property {Boolean} isCheck - value is `true` if there is a check, otherwise `false`
   * @property {Boolean} isCheckmate - value is `true` if there is a checkmate, otherwise `false`
   * @property {Boolean} isStalemate - value is `true` if there is a stalemate, otherwise `false`
   * @property {Boolean} isPawnPromotion - value is `true` if pawn is ready to promote, otherwise `false`
   * @property {Object} enPassant - value is `null` if there is no pawn to capture on enPassant move, otherwise coordinates{x, y} of pawn
   * @property {Number} materialRatio - value is `Integer`, shows who have material advantage, if value greater than 0, white have advantage, otherwise black
   * @property {Boolean} isBoardFlipped - value is `false` if black side is `up` and white is `down`, otherwise true
   */
  constructor() {
    const field = new Field();
    const playerBlack = new Player('up', 'black');
    const playerWhite = new Player('down', 'white');
    let defendMoves = [];
    let historyOfMoves = [];
    let whoMoves = 'white';
    let selectedCell = null;
    let oldPosition = null;
    let newPosition = null;
    let isCheck = false;
    let isCheckmate = false;
    let isStalemate = false;
    let isPawnPromotion = false;
    let enPassant = null;
    let materialRatio = 0;
    let isBoardFlipped = false;
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
          selectedCell = value;
        }
      },
      oldPosition: {
        get: () => oldPosition,
        set: (value) => {
          if (value !== null && Object.keys(value).join('') !== 'xy') {
            throw Error(`Game.oldPosition.set(value) value must be null or Object with keys 'x' and 'y'`);
          }
          oldPosition = value;
        }
      },
      newPosition: {
        get: () => newPosition,
        set: (value) => {
          if (value !== null && Object.keys(value).join('') !== 'xy') {
            throw Error(`Game.newPosition.set(value) value must be null or Object with keys 'x' and 'y'`);
          }
          newPosition = value;
        }
      },
      isCheck: {
        get: () => isCheck,
        set: (value) => {
          if (typeof value !== 'boolean') {
            throw Error(`Game.isCheck.set(value) value must be Boolean`);
          }
          isCheck = value;
        }
      },
      isCheckmate: {
        get: () => isCheckmate,
        set: (value) => {
          if (typeof value !== 'boolean') {
            throw Error(`Game.isCheckmate.set(value) value must be Boolean`);
          }
          isCheckmate = value;
        }
      },
      isStalemate: {
        get: () => isStalemate,
        set: (value) => {
          if (typeof value !== 'boolean') {
            throw Error(`Game.isStalemate.set(value) value must be Boolean`);
          }
          isStalemate = value;
        }
      },
      isPawnPromotion: {
        get: () => isPawnPromotion,
        set: (value) => {
          if (typeof value !== 'boolean') {
            throw Error(`Game.isCheck.set(value) value must be Boolean`);
          }
          isPawnPromotion = value;
        }
      },
      defendMoves: {
        get: () => defendMoves,
        set: (value) => {
          if (!Array.isArray(value)) {
            throw Error(`Game.defendMoves.set(value) value must be Array`);
          }
          defendMoves = value;
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
      enPassant: {
        get: () => enPassant,
        set: (value) => {
          if (typeof value !== 'object') {
            throw Error(`Game.enPassant.set(value) value must be Object or null`);
          }
          enPassant = value;
        } 
      },
      materialRatio: {
        get: () => materialRatio,
        set: (value) => {
          if (!Number.isInteger(value)) {
            throw Error(`Game.materialRatio.set(value) value must be Integer`);
          }
          materialRatio = value;
        }
      },
      isBoardFlipped: {
        get: () => isBoardFlipped,
        set: (value) => {
          if (typeof value !== 'boolean') {
            throw Error(`Game.isBoardFlipped.set(value) value must be Boolean`);
          }
          isBoardFlipped = value;
        }
      }
    });
  }

  /**
   * @method createField
   * @memberof Chess#Game#
   * @description Creates field 
   * @returns {undefined} undefined
   * @example this.createField()
   */
  createField() {
    this.field.createField();
  }

  /**
   * @method clearField
   * @memberof Chess#Game#
   * @description Sets figures to initial positions and sets all class properties to initial value 
   * @returns {undefined} undefined
   * @example this.clearField()
   */
  clearField() {
    this.field.clearField();
    this.selectedCell = null;
    this.oldPosition = null;
    this.newPosition = null;
    this.whoMoves = 'white';
    this.historyOfMoves = [];
    this.defendMoves = [];
    this.isCheckmate = false;
    this.isStalemate = false;
    this.isCheck = false;
    this.createFigures();
  }

  /**
   * @method createFigures
   * @memberof Chess#Game#
   * @description Creates white and black figures and sets them to initial position
   * @returns {undefined} undefined
   * @example this.createFigures()
   */
  createFigures() {
    this.playerWhite.createPositions();
    this.playerWhite.createFigures(this.field.board);

    this.playerBlack.createPositions();
    this.playerBlack.createFigures(this.field.board);
    this.calcMaterialRatio(this.field.board);
  }

  /**
   * @method makeHistory
   * @memberof Chess#Game#
   * @description Makes history by pushing `obj` to `historyOfMoves`
   * @returns {undefined} undefined
   * @example this.makeHistory()
   */
  makeHistory(figure, whoMoved) {
    const obj = {
      field: this.field.fieldForHistory(),
      figure: figure,
      oldPosition: this.oldPosition,
      newPosition: this.newPosition,
      whoMoved: whoMoved,
      isCheck: this.isCheck,
      isCheckmate: this.isCheckmate,
      isStalemate: this.isStalemate,
    }
    this.historyOfMoves.push(obj);
  }

  /**
   * @method historyRender
   * @memberof Chess#Game#
   * @returns {undefined} undefined
   * @example this.historyRender()
   */
  historyRender(historyOfMoves) {
    this.isCheckmate = historyOfMoves.isCheckmate;
    this.isCheck = historyOfMoves.isCheck;
    this.isStalemate = historyOfMoves.isStalemate
    this.oldPosition = historyOfMoves.oldPosition;
    this.newPosition = historyOfMoves.newPosition;
    this.calcMaterialRatio(historyOfMoves.field);
  }

  /**
   * @method clickOnFigure
   * @memberof Chess#Game#
   * @param {Instance} cell instance of [`Cell`]{@link Chess#Cell}
   * @description For chosen figure, will display all available moves 
   * @returns {undefined} undefined
   * @example 
   * const cell = new Cell('white', {x: 0, y: 0});
   * this.clickOnFigure(cell);
   */
  clickOnFigure(cell) {
    this.clearAvailableMove();

    const availableMoves = cell.figure.name === 'King' 
      ? Object.entries(this.kingMoves(cell.figure)).slice(0, 3)
      : cell.figure.name === 'Pawn' 
        ? Object.entries(this.figureMoves(cell.figure)).slice(0, 4)
        : Object.entries(this.figureMoves(cell.figure)).slice(0, 3)
    const condition = (moves, move) => moves.some(dmove => dmove.x === move.x && dmove.y === move.y);

    availableMoves.forEach((moves) => {
      if (moves[1].length > 0) {
        moves[1].forEach(move => {
          if (this.isCheck && cell.figure.name !== 'King') {
            this.field.board[move.x][move.y].isAvailableFor = condition(this.defendMoves, move) ? moves[0] : '';
            return;
          }
          this.field.board[move.x][move.y].isAvailableFor = moves[0];   
        })
      }
    })
    this.selectedCell = cell;
  }

  /**
   * @method clickOnCellForMove
   * @memberof Chess#Game# 
   * @param {Instance} cell instance of [`Cell`]{@link Chess#Cell}
   * @param {Number} x `x` coordinate of a position
   * @param {number} y `y` coordinate of a position
   * @description If figure was clicked calls [`clickOnFigure`]{@link Chess#Game#clickOnFigure}
   * to display available moves, next call of `clickOnCellForMove`  will move  figure on new position 
   * if that position is available for chosen figure, 
   * after will check for check, check defense, check checkmate, check stalemate
   * @returns {undefined} undefined
   * @example 
   * const cell = new Cell('white', {x: 0, y: 0})
   * const cell2 = new Cell('black', {x: 1, y: 0})
   * const rook = new Rook('white', {x: 0, y: 0})
   * cell.figure = rook
   * this.clickOnCellForMove(cell, 0, 0); // shows available moves for rook
   * this.clickOnCellForMove(cell2, 1, 0); // moves rook on {x: 1, y: 0} position
   */
  clickOnCellForMove(cell, x, y) {
    if (this.isCheckmate || this.isStalemate) { return }

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
      figure.makeCastle([x,y], this.field.board);
    }
    else if (cell.isAvailableFor === 'enPassant') {
      figure.makeEnPassant([x,y], this.enPassant, this.field.board);
      this.enPassant = null;
    }
    else {
      figure.makeMove([x,y], this.field.board);
      if (this.enPassant !== null) {
        this.field.board[this.enPassant.x][this.enPassant.y].figure.enPassant = false; // pawn
        this.enPassant = null;
      }
      if (figure.name === 'Pawn' && figure.enPassant) {
        this.enPassant = figure.position;
      }
      if (this.isCheck) {
        this.isCheck = false;
      }
    }

    this.newPosition = Object.assign({}, figure.position);
    this.selectedCell = null;
    const whoMovesOld = this.whoMoves;
    this.whoMoves = this.whoMoves === 'white' ? 'black' : 'white';

    const isPromotion = this.checkPawnPromotion(figure, x, y);
    if (isPromotion) { return } // return to make promotion move

    this.calcMaterialRatio(this.field.board);
    this.checkForCheck(figure);
    this.checkForStalemate();
    this.clearAvailableMove();
    this.makeHistory(figure, whoMovesOld);
  }

  /**
   * @method clearAvailableMove
   * @memberof Chess#Game#
   * @description Clears available moves of a figure 
   * @returns {undefined} undefined
   * @example this.clearAvailableMove()
   */
  clearAvailableMove() {
    this.field.board.forEach((row, ) => {
      row.forEach((cell, ) => {
        if (this.isCheck && cell.isAvailableFor === 'check') { return }
        if (this.isPawnPromotion && cell.isAvailableFor === 'promotion') { return }
        cell.isAvailableFor = '';
      })
    })
  }

  /**
   * @method checkPawnPromotion
   * @memberof Chess#Game#
   * @param {Instance} figure instance of figure
   * @param {Number} x `x` coordinate of a position
   * @param {Number} y `y` coordinate of a position
   * @description Checks is pawn ready to promote, returns `true` if ready, otherwise `false`
   * @returns {Boolean} Boolean
   * @example 
   * const pawn = new Pawn('white' {x: 7, y: 0})
   * this.checkPawnPromotion(pawn, 7, 0) // pawn is ready to promote
   */
  checkPawnPromotion(figure, x, y) {
    if (figure.name !== 'Pawn' || !figure.promotion) {
      return false;
    }

    this.isPawnPromotion = true;
    this.field.board[x][y].isAvailableFor = 'promotion';
    return true;
  }

  /**
   * @async
   * @method pawnPromotion
   * @memberof Chess#Game#
   * @param {Instance} field chess board 
   * @param {String} figureName name of figure
   * @param {Object} position 
   * @returns {undefined} undefined
   * @description Makes pawn promotion
   * @example 
   * const f = new Field()
   * await this.pawnPromotion(f, 'Queen', {x: 0, y: 0});
   */
  async pawnPromotion(field, figureName, position) {
    const color = figureName.substring(0, 5);
    const player = color === this.playerWhite.color ? this.playerWhite : this.playerBlack;
    const name = figureName.substring(5).toLowerCase();
    let {default: figure} = await import(`@/model/chess/figures/${name}`)
    const fig = new figure(color, position, player.side); 
    this.isPawnPromotion = false;
    field[position.x][position.y].figure = fig;
    field[position.x][position.y].isAvailableFor = '';

    this.calcMaterialRatio(field);
    this.checkForCheck(fig);
    this.checkForStalemate();
    this.clearAvailableMove();
    this.makeHistory(fig, color);
  }

  /**
   * @method checkForCheck
   * @memberof Chess#Game#
   * @param {Instance} figure instance of figure
   * @description Checks if there is a check(king is under attack)
   * @returns {undefined} undefined
   * @example 
   * const rook = new Rook('white', {x: 0, y: 0})
   * this.checkForCheck(rook);
   */
  checkForCheck(figure) {
    // determine player who make check
    const playerAttack = figure.color === this.playerWhite.color ? this.playerWhite : this.playerBlack;
    const playerDefend = playerAttack.color === 'white' ? this.playerBlack : this.playerWhite;

    const allAvailableChecks = playerAttack.allAvailableMoves(this.field.board, 'check');
    const KingPosition = playerDefend.getKing(this.field.board).position;

    // is it check?
    this.isCheck = allAvailableChecks.length > 0;
    if (!this.isCheck) { return }

    this.field.board[KingPosition.x][KingPosition.y].isAvailableFor = 'check';
    this.checkDefense();
    this.checkForCheckmate();
  }

  /**
   * @method checkDefense
   * @memberof Chess#Game#
   * @description Checks how figures can defend the king
   * @returns {undefined} undefined
   * @example this.checkDefense()
   */
  checkDefense() {
    const playerDefend = this.whoMoves === 'white' ? this.playerWhite : this.playerBlack;
    const playerAttack = playerDefend.color === 'white' ? this.playerBlack : this.playerWhite;
    const attackFigures = playerAttack.getAttackFigures(this.field.board);
    // if there are 2 attack figures, so in this case king must move, figures can't defend king
    if (attackFigures.length > 1) {
      this.defendMoves = [];
      return;
    }

    const checkMoves = attackFigures[0].available(this.field.board).wayToKing;
    const allMoves = playerDefend.checkDefendMoves(this.figureMoves.bind(this), this.field.board);
    // defendMoves from figure that made check
    this.defendMoves = allMoves.filter(move => checkMoves.some(amove => amove.x === move.x && amove.y === move.y));
  }

  /**
   * @method checkForCheckmate
   * @memberof Chess#Game#
   * @description Checks if there is a checkmate
   * @returns {undefined} undefined
   * @example this.checkForCheckmate()
   */
  checkForCheckmate() {
    const playerDefend = this.whoMoves === 'white' ? this.playerWhite : this.playerBlack;
    const king = playerDefend.getKing(this.field.board);
    const kingMoves = this.kingMoves(king);
    const condition = this.defendMoves.length === 0 && kingMoves.move.length === 0 && kingMoves.kill.length === 0;

    this.isCheckmate = condition;
  }

  /**
   * @method checkForStalemate
   * @memberof Chess#Game#
   * @description Checks if there is a stalemate
   * @returns {undefined} undefined
   * @example this.checkForStalemate()
   */
  checkForStalemate() {
    if (this.isCheckmate || this.isCheck) { return }
    const playerDefend = this.whoMoves === 'white' ? this.playerWhite : this.playerBlack;
    const king = playerDefend.getKing(this.field.board);
    const kingMoves = this.kingMoves(king);
    const moves = playerDefend.allAvailableMoves(this.field.board, 'moveAndKill');
    const condition = moves.length === 0 && kingMoves.move.length === 0 && kingMoves.kill.length === 0;

    this.isStalemate = condition;
  }

  /**
   * @method kingMoves
   * @memberof Chess#Game#
   * @param {Instance} figure instance of figure
   * @description Returns all available king moves
   * @returns {Object} Object
   * @example 
   * const king = new King('white', {x: 0, y: 0})
   * this.kingMoves(king)
   */
  kingMoves(king) {
    if (king.name !== "King") { return }

    const playerDefend = king.color === this.playerWhite.color ? this.playerWhite : this.playerBlack;
    const playerAttack = playerDefend.color === 'white' ? this.playerBlack : this.playerWhite;  
    const attackMoves = playerAttack.allAvailableMoves(this.field.board, 'move');
    const attackCovers = playerAttack.allAvailableMoves(this.field.board, 'cover');
    const AllKingMoves = playerDefend.kingMoves(this.field.board);

    AllKingMoves.move = AllKingMoves.move.filter(move => !attackMoves.some(amove => amove.x === move.x && amove.y === move.y));
    AllKingMoves.kill = AllKingMoves.kill.filter(move => !attackCovers.some(amove => amove.x === move.x && amove.y === move.y));

    // case when other king is near
    const AllOtherKingMoves = playerAttack.kingMoves(this.field.board);
    AllKingMoves.move = AllKingMoves.move.filter(move => !AllOtherKingMoves.move.some(amove => amove.x === move.x && amove.y === move.y));
    AllKingMoves.kill = AllKingMoves.kill.filter(move => !AllOtherKingMoves.cover.some(amove => amove.x === move.x && amove.y === move.y));

    // case with pawns
    const AllPawnsKills = playerAttack.allAvailableMoves(this.field.board, 'pawn');
    AllKingMoves.move = AllKingMoves.move.filter(move => !AllPawnsKills.some(amove => amove.x === move.x && amove.y === move.y));


    // case with castling 
    if (this.isCheck) {
      AllKingMoves.castle = [];
      return AllKingMoves;
    }

    const kingMovesWhenCastling = [];
    if (AllKingMoves.castle.length > 0) {
      const pos = king.position;
      AllKingMoves.castle.forEach(obj => {
        if (obj.y > pos.y) {
          for (let i = pos.y + 1; i <= obj.y; i++) {
            kingMovesWhenCastling.push({x: obj.x, y: i});
          }
        } else {
          for (let i = pos.y - 1; i >= obj.y; i--) {
            kingMovesWhenCastling.push({x: obj.x, y: i});
          }
        }
      })
    }
    // no available castling
    if (kingMovesWhenCastling.length === 0) {
      return AllKingMoves;
    }
    // one available castling
    if (kingMovesWhenCastling.length === 2) {
      const dontAllowCastle = kingMovesWhenCastling.some(move => attackMoves.some(amove => amove.x === move.x && amove.y === move.y));
      if (dontAllowCastle) {
        AllKingMoves.castle = [];
      }
    }
    // two available castling
    if (kingMovesWhenCastling.length === 4) {
      const splitInParts = [kingMovesWhenCastling.slice(0, 2), kingMovesWhenCastling.slice(2)];
      const dontAllowCastle = splitInParts.map(part => {
        return part.some(move => attackMoves.some(amove => amove.x === move.x && amove.y === move.y));
      })
      AllKingMoves.castle = dontAllowCastle.reduce((acc, bool, i) => {
        if (bool === false) {
          acc.push(AllKingMoves.castle[i]);
        }
        return acc
      }, []);
    }
  
    return AllKingMoves;
  }

  /**
   * @method figureMoves
   * @memberof Chess#Game#
   * @param {Instance} figure instance of figure
   * @description Returns all available figure moves
   * @returns {Object} Object
   * @example 
   * const rook = new Rook('white', {x: 0, y: 0})
   * this.figureMoves(rook)
   */
  figureMoves(figure) {
    if (figure.name === 'King') { return }
    // enPassant 
    const enPassant = this.checkEnPassant(figure);
    let figureMove = figure.available(this.field.board);
    if (enPassant !== null) {
      figureMove.enPassant.push(enPassant);
    }

    const playerDefend = figure.color === this.playerWhite.color ? this.playerWhite : this.playerBlack;
    const playerAttack = playerDefend.color === 'white' ? this.playerBlack : this.playerWhite;

    // if figure defend king: no move or kill the attack figure
    const attackFigures = playerAttack.getAttackFigures(this.field.board, true);

    if (attackFigures.length === 0) { return figureMove }

    attackFigures.forEach(attackFigure => {
      const wayToKing = attackFigure.available(this.field.board, true).wayToKing;

      const defenders = wayToKing.slice(1).reduce((acc, obj) => {
        const defendFigure = this.field.board[obj.x][obj.y].figure; 
        if (defendFigure === null) { return acc }
        if (attackFigure.color !== defendFigure.color) {
          acc.push(defendFigure);
        }
        return acc;
      }, [])

      // this is check 
      if (defenders.length === 0) { return }

      // there are 2 or more defenders
      if (defenders.length > 1) { return }

      if (figure.position.x !== defenders[0].position.x || figure.position.y !== defenders[0].position.y ) {
        return;
      }

      figureMove.move = figureMove.move.filter(move => wayToKing.some(amove => amove.x === move.x && amove.y === move.y));
      figureMove.kill = figureMove.kill.filter(move => wayToKing.some(amove => amove.x === move.x && amove.y === move.y));

      // only for pawns
      if (figureMove?.enPassant?.length === 1) {
        figureMove.enPassant = [];
      }
    });

    return figureMove;
  }

  /**
   * @method checkEnPassant
   * @memberof Chess#Game#
   * @param {Instance} pawn instance of [`Pawn`]{@link Chess#Figures#Pawn#} 
   * @description Checks if `pawn` can make enPassant move, if not returns `null` otherwise {x, y}
   * @returns {Object} Object
   * @example 
   * const pawn = new Pawn('white', {x: 6, y: 0})
   * this.checkEnPassant(pawn)
   */
  checkEnPassant(pawn) {
    if (pawn.name !== 'Pawn') { return null }
    if (this.enPassant === null) { return null }
    const pos = pawn.position;
    if (pawn.side === 'up' && pos.x !== 4) { return null }
    if (pawn.side === 'down' && pos.x !== 3) { return null }

    // left
    const leftFigure = this.field.board[pos.x][pos.y - 1]?.figure || null;
    const lpos = leftFigure?.position.x === this.enPassant.x && leftFigure?.position.y === this.enPassant.y;
    if (leftFigure?.name === 'Pawn' && leftFigure?.color !== pawn.color && lpos) {
      return {
        x: pos.x + (pawn.side === 'down' ? -1 : 1),
        y: pos.y - 1
      }
    } 
    // right
    const rightFigure = this.field.board[pos.x][pos.y + 1]?.figure || null;
    const rpos = rightFigure?.position.x === this.enPassant.x && rightFigure?.position.y === this.enPassant.y;
    if (rightFigure?.name === 'Pawn' && leftFigure?.color !== pawn.color && rpos) {
      return  {
        x: pos.x + (pawn.side === 'down' ? -1 : 1),
        y: pos.y + 1
      }
    }
    return null;
  }

  /**
   * @method calcMaterialRatio
   * @memberof Chess#Game#
   * @description Counts how many figures each player have(except king) 
   * and calculates the cost of all player figures  
   * @returns {undefined} undefined
   * @example 
   * this.calcMaterialRatio()
   */
  calcMaterialRatio(field) {
    const cost = {
      pawn: 1,
      bishop: 3,
      knight: 3,
      rook: 5,
      queen: 9
    };
    const figuresWhite = this.playerWhite.countFigures(field);
    const figuresBlack = this.playerBlack.countFigures(field);

    const sumWhite = Object.entries(cost).reduce((acc, pair) => {
      acc += figuresWhite[pair[0]] * pair[1];
      return acc;
    }, 0);

    const sumBlack = Object.entries(cost).reduce((acc, pair) => {
      acc += figuresBlack[pair[0]] * pair[1];
      return acc;
    }, 0);

    this.materialRatio = sumWhite - sumBlack;
  }


  /**
   * @method flipBoard
   * @memberof Chess#Game#
   * @description Flips board   
   * @returns {undefined} undefined
   * @example this.flipBoard()
   */
  flipBoard() {
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

    reverse(transpose(reverse(transpose(this.field.board))));
    this.playerWhite.side = this.playerWhite.side === 'up' ? 'down' : 'up';
    this.playerBlack.side = this.playerWhite.side === 'up' ? 'down' : 'up';
    let oldChanged = false;
    let newChanged = false;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const field = this.field.board[i][j];
        // change position of figure
        if (field.figure !== null) {
          const color = field.figure.color;
          field.figure.side = color === this.playerWhite.color ? this.playerWhite.side : this.playerBlack.side;
          field.figure.position.x = i;
          field.figure.position.y = j;
        }
        // change position of oldPosition
        if (field.position.x === this.oldPosition?.x && field.position.y === this.oldPosition?.y && !oldChanged) {
          this.oldPosition.x = i;
          this.oldPosition.y = j;
          oldChanged = true;
        }
        // change position of newPosition
        if (field.position.x === this.newPosition?.x && field.position.y === this.newPosition?.y && !newChanged) {
          this.newPosition.x = i;
          this.newPosition.y = j;
          newChanged = true;
        }
        // cell
        field.position.x = i; 
        field.position.y = j;
      }
    }
    this.isBoardFlipped = !this.isBoardFlipped;
  }
}