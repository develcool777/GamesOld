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
   * @property {String} whoMoves - shows who moves
   * @property {Object} selectedCell - stores the instance of selected [`Cell`]{@link Chess#Cell}
   * @property {Boolean} isCheck - value is `true` if there is a check, otherwise `false`
   * @property {Boolean} isCheckmate - value is `true` if there is a checkmate, otherwise `false`
   * @property {Boolean} isStalemate - value is `true` if there is a stalemate, otherwise `false`
   * @property {Boolean} isPawnPromotion - value is `true` if pawn is ready to promote, otherwise `false`
   * @property {Object} enPassant - value is `null` if there is no pawn to capture on enPassant move, otherwise coordinates{x, y} of pawn
   * @property {Number} materialRatio - value is `Integer`, shows who have material advantage, if value greater than 0, white have advantage, otherwise black
   * @property {String} gameStatus - shows game status
   * @property {String} gameResult - shows game result
   */
  constructor() {
    const field = new Field();
    const playerBlack = new Player('up', 'black');
    const playerWhite = new Player('down', 'white');
    let defendMoves = [];
    let whoMoves = 'white';
    let selectedCell = null;
    let isCheck = false;
    let isCheckmate = false;
    let isStalemate = false;
    let isPawnPromotion = false;
    let enPassant = null;
    let materialRatio = 0;
    let gameStatus = '';
    let gameResult = '';
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

      enPassant: {
        get: () => enPassant,
        set: (value) => {
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

      gameStatus: {
        get: () => gameStatus,
        set: (value) => {
          if (typeof value !== 'string') {
            throw Error(`Game.gameStatus.set(value) value must be String`);
          }
          if (!['', 'start', 'finish'].includes(value)) {
            throw Error(`Game.gameStatus.set(value) value must be '' or 'start' or 'finish'`);
          }
          gameStatus = value;
        }
      },

      gameResult: {
        get: () => gameResult,
        set: (value) => {
          if (typeof value !== 'string') {
            throw Error(`Game.gameResult.set(value) value must be String`);
          }
          gameResult = value;
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
    this.field.createBoard();
  }

  /**
   * @method clearField
   * @memberof Chess#Game#
   * @description Sets figures to initial positions and sets all class properties to initial value 
   * @returns {undefined} undefined
   * @example this.clearField()
   */
  clearField() {
    this.field.clearBoard();
    this.playerWhite.side = 'down';
    this.playerBlack.side = 'up';
    this.selectedCell = null;
    this.enPassant = null;
    this.whoMoves = 'white';
    this.defendMoves = [];
    this.isCheckmate = false;
    this.isStalemate = false;
    this.isCheck = false;
    this.gameStatus = '';
    this.gameResult = '';
    this.createField();
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
   * @async
   * @method makeHistory
   * @memberof Chess#Game#
   * @description Makes history by pushing `obj` to `historyOfMoves`
   * @param {String} whoMoved - shows who moved 'white' or 'black' or ''(at the begining of game);
   * @param {Object} historyNotation
   * @returns {undefined} undefined
   * @throws Error - if `whoMoved` is not String
   * @throws Error - if `whoMoved` is not 'white' or 'black' or ''
   * @example await this.makeHistory()
   */
  async makeHistory(whoMoved, historyNotation) {
    if (typeof whoMoved !== 'string') {
      throw Error(`Game.makeHistory(whoMoved) whoMoved must be String`);
    }
    if (!['', 'white', 'black'].includes(whoMoved)) {
      throw Error(`Game.makeHistory(whoMoved) whoMoved must be 'white' or 'black' or ''`);
    }
    const obj = {
      whoMoved: whoMoved,
      isCheck: this.isCheck,
      isCheckmate: this.isCheckmate,
      isStalemate: this.isStalemate,
      enPassant: this.enPassant === null ? null : Object.assign({}, this.enPassant),
      playerWhiteSide: this.playerWhite.side,
      playerBlackSide: this.playerBlack.side,
      notation: historyNotation,
      materialRatio: this.materialRatio
    }
    await this.field.makeHistory(obj); 
  }

  /**
   * @async
   * @method showHistory
   * @memberof Chess#Game#
   * @description Shows move in history by index 
   * @param {Number} index - history index
   * @returns {undefined} undefined
   * @throws Error - if `index` is not Integer
   * @example await this.showHistory(0)
   */
  async showHistory(index) {
    if (!Number.isInteger(index)) {
      throw Error(`Game.showHistory(index) index must be Integer`);
    }

    const history = await this.field.showHistory(index);
    this.isCheckmate = history.isCheckmate;
    this.isCheck = history.isCheck;
    this.isStalemate = history.isStalemate;
    this.playerWhite.side = history.playerWhiteSide;
    this.playerBlack.side = history.playerBlackSide;
    this.materialRatio = history.materialRatio;
    // this.calcMaterialRatio(this.field.board);
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
    });
    this.selectedCell = cell;
    cell.isSelected = true;
  }

  /**
   * @method clickOnCellForMove
   * @memberof Chess#Game# 
   * @param {Instance} cell instance of [`Cell`]{@link Chess#Cell}
   * @description If figure was clicked calls [`clickOnFigure`]{@link Chess#Game#clickOnFigure}
   * to display available moves, next call of `clickOnCellForMove` will move figure on new position 
   * if that position is available for chosen figure, 
   * after will check for check, check defense, check checkmate, check stalemate
   * @returns {undefined} undefined
   * @example 
   * const cell = new Cell('white', {x: 0, y: 0})
   * const cell2 = new Cell('black', {x: 1, y: 0})
   * const rook = new Rook('white', {x: 0, y: 0})
   * cell.figure = rook
   * this.clickOnCellForMove(cell); // shows available moves for rook
   * this.clickOnCellForMove(cell2); // moves rook on {x: 1, y: 0} position
   */
  clickOnCellForMove(cell) {
    const posX = cell.position.x;
    const posY = cell.position.y;
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
      cell.isSelected = false;
      return;
    }

    const figure = this.selectedCell.figure;
    const copyData = this.copyDataForNotation(cell, figure);
    const oldPosition = Object.assign({}, figure.position);

    if (cell.isAvailableFor === 'castle') {
      figure.makeCastle([posX, posY], this.field.board);
    }
    else if (cell.isAvailableFor === 'enPassant') {
      figure.makeEnPassant([posX, posY], this.enPassant, this.field.board);
      this.enPassant = null;
    }
    else {
      figure.makeMove([posX, posY], this.field.board);
      if (this.enPassant !== null) {
        const pos = this.enPassant;
        this.field.board[pos.x][pos.y].figure.enPassant = false; // pawn
        this.enPassant = null;
      }
      if (figure.name === 'Pawn' && figure.enPassant) {
        this.enPassant = Object.assign({}, figure.position);
      }
      if (this.isCheck) {
        this.isCheck = false;
      }
    }

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        this.field.board[i][j].showsPosition = '';
      }
    }
    this.field.board[oldPosition.x][oldPosition.y].showsPosition = 'oldPosition';
    this.field.board[figure.position.x][figure.position.y].showsPosition = 'newPosition';
    this.selectedCell.isSelected = false;
    this.selectedCell = null;

    const whoMovesOld = this.whoMoves;
    this.whoMoves = this.whoMoves === 'white' ? 'black' : 'white';

    this.checkPawnPromotion(figure);
    if (this.isPawnPromotion) { 
      this.dataForPromotionNotation = [...copyData];
      return; // return to make promotion move
    } 

    this.calcMaterialRatio(this.field.board);
    this.checkForCheck(figure);
    this.checkForStalemate();
    this.clearAvailableMove();
    const notation = this.historyNotation(...copyData);
    this.makeHistory(whoMovesOld, notation);
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
        cell.isSelected = false;
      })
    })
  }

  /**
   * @method checkPawnPromotion
   * @memberof Chess#Game#
   * @param {Instance} figure instance of figure
   * @description Checks is pawn ready to promote, returns `true` if ready, otherwise `false`
   * @returns {undefined} undefined
   * @example 
   * const pawn = new Pawn('white' {x: 7, y: 0})
   * this.checkPawnPromotion(pawn) // pawn is ready to promote
   */
  checkPawnPromotion(figure) {
    if (figure.name !== 'Pawn' || !figure.promotion) {
      return
    }
    const x = figure.position.x;
    const y = figure.position.y
    this.isPawnPromotion = true;
    this.field.board[x][y].isAvailableFor = 'promotion';
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
    let {default: figure} = await import(`@/model/chess/figures/${name}`);
    const fig = new figure(color, position, player.side); 
    this.isPawnPromotion = false;
    field[position.x][position.y].figure = fig;
    field[position.x][position.y].isAvailableFor = '';

    this.calcMaterialRatio(field);
    this.checkForCheck(fig);
    this.checkForStalemate();
    this.clearAvailableMove();
    const notation = this.historyNotation(...this.dataForPromotionNotation, fig);
    delete this.dataForPromotionNotation;
    this.makeHistory(color, notation);
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
    if (this.isCheckmate) { this.isCheck = false }
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
   * @param {Instance} king instance of King
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

    const preventCastlingMoves = [...attackMoves, ...attackCovers, ...AllOtherKingMoves.move];

    // one available castling
    if (kingMovesWhenCastling.length === 2) {
      const dontAllowCastle = kingMovesWhenCastling.some(move => preventCastlingMoves.some(amove => amove.x === move.x && amove.y === move.y));
      if (dontAllowCastle) {
        AllKingMoves.castle = [];
      }
    }

    // two available castling
    if (kingMovesWhenCastling.length === 4) {
      const splitInParts = [kingMovesWhenCastling.slice(0, 2), kingMovesWhenCastling.slice(2)];
      const dontAllowCastle = splitInParts.map(part => {
        return part.some(move => preventCastlingMoves.some(amove => amove.x === move.x && amove.y === move.y));
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

    const enPos = this.enPassant;
    // left
    const leftFigure = this.field.board[pos.x][pos.y - 1]?.figure || null;
    const lpos = leftFigure?.position.x === enPos.x && leftFigure?.position.y === enPos.y;
    if (leftFigure?.name === 'Pawn' && leftFigure?.color !== pawn.color && lpos) {
      return {
        x: pos.x + (pawn.side === 'down' ? -1 : 1),
        y: pos.y - 1
      }
    } 
    // right
    const rightFigure = this.field.board[pos.x][pos.y + 1]?.figure || null;
    const rpos = rightFigure?.position.x === enPos.x && rightFigure?.position.y === enPos.y;
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
    const isAnalyze = this.gameStatus === 'finish'

    this.playerWhite.side = this.playerWhite.side === 'up' ? 'down' : 'up';
    this.playerBlack.side = this.playerWhite.side === 'up' ? 'down' : 'up';

    this.field.flipBoard(this.field.board, this.enPassant, this.playerWhite.side, this.playerBlack.side, isAnalyze);
    this.field.isBoardFlipped = !this.field.isBoardFlipped;
    this.isCheck && !isAnalyze && this.checkDefense();
  }

  /**
   * @method startGame
   * @memberof Chess#Game#
   * @description Starts the game
   * @returns {undefined} undefined
   * @example this.startGame()
   */
  startGame() {
    this.gameStatus = 'start';
    this.makeHistory('');
  }

  /**
   * @method finishGame
   * @memberof Chess#Game#
   * @description Finishes the game
   * @returns {undefined} undefined
   * @example this.finishGame()
   */
  finishGame() {
    this.gameStatus = 'finish';
  }

  /**
   * @async
   * @method returnMove
   * @memberof Chess#Game#
   * @description Returns move
   * @returns {undefined} undefined
   * @example await this.returnMove()
   */
  async returnMove() {
    if (this.gameStatus !== 'start' || this.isPawnPromotion) {
      return;
    }

    const prevMove = await this.field.returnMove();
    this.isCheck = prevMove.isCheck;
    this.isCheckmate = prevMove.isCheckmate;
    this.isStalemate = prevMove.isStalemate;
    this.enPassant = prevMove.enPassant;
    this.whoMoves = ['', 'black'].includes(prevMove.whoMoved) ? 'white' : 'black';
    this.playerWhite.side = prevMove.playerWhiteSide
    this.playerBlack.side = prevMove.playerBlackSide

    this.calcMaterialRatio(this.field.board);
  }

  /**
   * @method copyDataForNotation
   * @memberof Chess#Game#
   * @param {Instance} cell - instance of [`Cell`]{@link Chess#Cell} 
   * @param {Instance} figure - instance of Figure
   * @returns {Array} Array
   * @example 
   * const cell = new Cell('white', {x:0, y:0});
   * const rook = new Rook('white', {x:0, y:0}, 'up');
   * const copyData = this.copyDataForNotation(cell, rook);
   */
  copyDataForNotation(cell, figure) {
    const copyCell = {};
    copyCell.isAvailableFor = cell.isAvailableFor;
    copyCell.position = Object.assign({}, cell.position);

    const copyFigure = {};
    copyFigure.name = figure.name;
    copyFigure.color = figure.color;
    copyFigure.position = Object.assign({}, figure.position);

    return [copyCell, copyFigure];
  }

  /**
   * @method historyNotation
   * @memberof Chess#Game#
   * @description Makes history notation 
   * @param {Object} cell 
   * @param {Object} figure 
   * @param {Instance|null} promotionFigure 
   * @returns {Object} Object
   */
  historyNotation(cell, figure, promotionFigure=null) {
    const isFlipped = this.field.isBoardFlipped;
    const x = cell.position.x;
    const y = cell.position.y;
    const letter = String.fromCharCode(isFlipped ? 104 - y : 97 + y); // 104(h) 97(a)
    const number = isFlipped ? x + 1 : 8 - x;

    const figureName = figure.name.toLowerCase();
    const newPosition = `${letter}${number}`;

    let notation = {};
    notation.showFigure = true;
    notation.color = figure.color;
    notation.figure = `chess-${figureName}`;

    if (figureName === 'pawn') {
      const vertical = String.fromCharCode(isFlipped ? 104 - figure.position.y : 97 + figure.position.y);
      notation.move = ['kill', 'enPassant'].includes(cell.isAvailableFor) ? `${vertical}x${newPosition}` : `${newPosition}`;
      notation.showFigure = false;
    }
    else if (figureName === 'king' && cell.isAvailableFor === 'castle') {
      notation.move = [2, 5].includes(y) ? 'O-O-O' : `O-O`;
      notation.showFigure = false;
    }
    else {
      notation.move =  cell.isAvailableFor === 'kill' ? `x${newPosition}` : `${newPosition}`
    }

    if (promotionFigure !== null) {
      notation.move += `=`;
      notation.promotionFigure = `chess-${promotionFigure.name.toLowerCase()}`;
    }

    notation.isCheck = this.isCheck;
    notation.isCheckmate = this.isCheckmate;
    notation.isStalemate = this.isStalemate;

    return notation;
  }

  /**
   * @method getAllHistoryNotation
   * @memberof Chess#Game#
   * @description Returns array of notations [[whiteMove, blackMove], [whiteMove]]
   * @returns {Array} Array
   * @example const notations = this.getAllHistoryNotation()
   */
  getAllHistoryNotation() {
    if (this.field.historyOfMoves === 1) { return } 
    const historyNotation = this.field.historyOfMoves.slice(1).reduce((acc, obj) => {
      const object = {...obj.notation};
      object.index = obj.index;
      object.materialRatio = obj.materialRatio;
      acc.push(object);
      return acc;
    }, []);

    const chunks = function(array, size) {
      const result = [];
      while (array.length) {
        result.push(array.splice(0, size));
      }
      return result;
    };

    return chunks(historyNotation, 2);
  }

  /**
   * @method isGameFinished
   * @memberof Chess#Game#
   * @description Decides if game finished or not
   * @returns {undefined} undefined
   * @example this.isGameFinished()
   */
  isGameFinished() {
    if (this.isCheckmate || this.isStalemate) {
      this.finishGame();
    }
    if (this.isCheckmate) {
      const winnerColor = this.whoMoves === 'white' ? 'black' : 'white';
      this.gameResult = `Player with ${winnerColor} figures won`;
    }
    if (this.isStalemate) {
      this.gameResult = `It's a draw`;
    }
  }
} 