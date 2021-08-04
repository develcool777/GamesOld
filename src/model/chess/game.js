import Player from "./player";
import Field from "./field";

export default class Game {
  constructor() {
    const field = new Field();
    const playerWhite = new Player('white');
    const playerBlack = new Player('black');
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
      }
    })
  }

  createField() {
    this.field.createField();
  }

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

  createFigures() {
    this.playerWhite.createPositions();
    this.playerWhite.createFigures(this.field.board);

    this.playerBlack.createPositions();
    this.playerBlack.createFigures(this.field.board);
  }

  makeHistory(typeOfMove="", figure, whoMoved) {
    const obj = {
      figure: figure,
      oldPosition: this.oldPosition,
      newPosition: this.newPosition,
      typeOfMove: typeOfMove,
      whoMoved: whoMoved
    }
    this.historyOfMoves.push(obj);
  }

  clickOnFigure(cell) {
    this.clearAvailableMove();

    const availableMoves = cell.figure.name === 'King' 
      ? Object.entries(this.kingMoves(cell.figure)).slice(0, 3)
      : Object.entries(this.figureMoves(cell.figure)).slice(0, 3)
    const condition = (moves, move) => moves.some(dmove => dmove.x === move.x && dmove.y === move.y);

    availableMoves.forEach((moves) => {
      if (moves[1].length > 0) {
        moves[1].forEach(move => {
          if (this.isCheck && cell.figure.name !== 'King') {
            this.field.board[move.x][move.y].isAvailableFor = condition(this.defendMoves, move) ? moves[0] : "";
            return;
          }
          this.field.board[move.x][move.y].isAvailableFor = moves[0];   
        })
      }
    })
    this.selectedCell = cell;
  }

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
    } else {
      figure.makeMove([x,y], this.field.board);
      if (this.isCheck) {
        this.isCheck = false;
      }
    }


    this.newPosition = Object.assign({}, figure.position);
    this.makeHistory(cell.isAvailableFor, figure, this.whoMoves);
    this.selectedCell = null;
    this.whoMoves = this.whoMoves === 'white' ? 'black' : 'white';

    this.checkPawnPromotion(figure, x, y);
    this.checkForCheck(figure);
    this.checkForStalemate();
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

  async pawnPromotion(field, figureName, position) {
    const color = figureName.substring(0, 5);
    const name = figureName.substring(5).toLowerCase();
    let {default: figure} = await import(`@/model/chess/figures/${name}`)
    const fig = new figure(color, position);
    this.isPawnPromotion = false;
    field[position.x][position.y].figure = fig;
    field[position.x][position.y].isAvailableFor = '';
    this.checkForCheck(fig);

  }

  checkForCheck(figure) {
    // determine player who make check
    const playerAttack = figure.color === this.playerWhite.side ? this.playerWhite : this.playerBlack;
    const playerDefend = playerAttack.side === 'white' ? this.playerBlack : this.playerWhite;

    const allAvailableChecks = playerAttack.allAvailableMoves(this.field.board, 'check');
    const KingPosition = playerDefend.getKing(this.field.board).position;

    // is it check?
    this.isCheck = allAvailableChecks.length > 0;
    if (!this.isCheck) { return }

    this.field.board[KingPosition.x][KingPosition.y].isAvailableFor = 'check';
    this.checkDefense();
    this.checkForCheckmate();
  }

  checkDefense() {
    const playerDefend = this.whoMoves === 'white' ? this.playerWhite : this.playerBlack;
    const playerAttack = playerDefend.side === 'white' ? this.playerBlack : this.playerWhite;
    const attackFigures = playerAttack.getAttackFigures(this.field.board);

    if (attackFigures.length > 1) {
      this.defendMoves = [];
      return;
    }

    const checkMoves = attackFigures[0].available(this.field.board).wayToKing;
    const allMoves = playerDefend.allAvailableMoves(this.field.board, 'moveAndKill');
    // defendMoves from figure that made check
    this.defendMoves = allMoves.filter(move => checkMoves.some(amove => amove.x === move.x && amove.y === move.y));
  }

  checkForCheckmate() {
    const playerDefend = this.whoMoves === 'white' ? this.playerWhite : this.playerBlack;
    const king = playerDefend.getKing(this.field.board);
    const kingMoves = this.kingMoves(king);
    const condition = this.defendMoves.length === 0 && kingMoves.move.length === 0 && kingMoves.kill.length === 0;

    this.isCheckmate = condition;
  }

  checkForStalemate() {
    if (this.isCheckmate || this.isCheck) { return }
    const playerDefend = this.whoMoves === 'white' ? this.playerWhite : this.playerBlack;
    const king = playerDefend.getKing(this.field.board);
    const kingMoves = this.kingMoves(king);
    const moves = playerDefend.allAvailableMoves(this.field.board, 'moveAndKill');
    const condition = moves.length === 0 && kingMoves.move.length === 0 && kingMoves.kill.length === 0;

    this.isStalemate = condition;
  }

  kingMoves(king) {
    if (king.name !== "King") { return }

    const playerDefend = king.color === this.playerWhite.side ? this.playerWhite : this.playerBlack;
    const playerAttack = playerDefend.side === 'white' ? this.playerBlack : this.playerWhite;  
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
    // const AllPawnsCovers = playerAttack.allAvailableMoves(this.field.board, 'cover');
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

    if (kingMovesWhenCastling.length === 0) {
      return AllKingMoves;
    }

    if (kingMovesWhenCastling.length === 2) {
      const dontAllowCastle = kingMovesWhenCastling.some(move => attackMoves.some(amove => amove.x === move.x && amove.y === move.y));
      if (dontAllowCastle) {
        AllKingMoves.castle = [];
      }
    }

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

  figureMoves(figure) {
    if (figure.name === "King") { return }
    let figureMove = figure.available(this.field.board);
    // console.log({who: this.whoMoves});

    const playerDefend = figure.color === this.playerWhite.side ? this.playerWhite : this.playerBlack;
    const playerAttack = playerDefend.side === 'white' ? this.playerBlack : this.playerWhite;

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
      // console.log(figure.position, defenders, defenders[0]);
      if (figure.position.x !== defenders[0].position.x || figure.position.y !== defenders[0].position.y ) {
        return;
      }

      figureMove.move = figureMove.move.filter(move => wayToKing.some(amove => amove.x === move.x && amove.y === move.y));
      figureMove.kill = figureMove.kill.filter(move => wayToKing.some(amove => amove.x === move.x && amove.y === move.y));
    })

    return figureMove;
  }

}