import Figures from "../figures";
export default class Pawn extends Figures  {
  /**
   * @class
   * @alias Pawn
   * @memberof Chess#Figures#
   * @augments Figures
   * @classdesc This class represents the logic of Pawn figure
   * @param {String} color - color of the figure
   * @param {Object} position - position of the figure 
   * @constructor
   * @property {String} color - this `color`
   * @property {Object} position - this `position`
   * @property {String} name - name of the figure
   * @property {Boolean} firstMove - if pawn have not made move yet, the value is `true` otherwise `false`
   * @property {Boolean} promotion - value will be `true` if pawn is ready for promotion otherwise `false`
   * @throws Error - if `color` is not String
   * @throws Error - if `color` is not 'white' or 'black'
   * @throws Error - if `position` is Object with keys: 'x' and 'y'
   */
  constructor(color, position) {
    super();

    if (typeof color !== 'string') {
      throw Error(`Pawn.constructor color must be String`);
    }
    if (!['white', 'black'].includes(color)) {
      throw Error(`Pawn.constructor color must be 'white' or 'black'`);
    }
    if (Object.keys(position).join('') !== 'xy') {
      throw Error(`Pawn.constructor position must be Object with keys x and y`);
    }
    const name = 'Pawn';
    let firstMove = true;
    let promotion = false;
    let enPassant = false;
    Object.defineProperties(this, {
      color: {
        get: () => color
      },
      position: {
        get: () => position
      },
      name: {
        get: () => name
      },
      firstMove: {
        get: () => firstMove,
        set: (value) => {
          if (typeof value !== 'boolean') {
            throw Error(`Pawn.firstMove.set() value must be Boolean`);
          }
          firstMove = value;
        }
      },
      promotion: {
        get: () => promotion,
        set: (value) => {
          if (typeof value !== 'boolean') {
            throw Error(`Pawn.promotion.set() value must be Boolean`);
          }
          promotion = value;
        }
      },
      enPassant: {
        get: () => enPassant,
        set: (value) => {
          if (typeof value !== 'boolean') {
            throw Error(`Pawn.enPassant.set() value must be Boolean`);
          }
          enPassant = value;
        }
      },
    })
  }


  /**
   * @method available
   * @memberof Chess#Figures#Pawn#
   * @description Returns all available moves for the figure
   * @param {Array} field chess board
   * @returns {Object} {
      move: [],
      kill: [],
      check: [],
      wayToKing: [],
      cover: [],
      dontAllowKingToMove: []
    }
   * @example 
   * const f = new Field()
   * this.available(f.board);
   */
  available(field) {
    const available = {
      move: [],
      kill: [],
      check: [],
      enPassant: [],
      wayToKing: [],
      cover: [],
      dontAllowKingToMove: [],
    }
    let move = this.color === 'white' ? -1 : 1;

    const condition = x => {
      if (this.position.x + x === field.length || this.position.x + x < 0) {
        return undefined;
      }
      return field[this.position.x + x][this.position.y].figure;
    }

    // moves
    available.move = [move, move + move].reduce((acc, item, i) => {
      const addMove = i => acc.push({ x: this.position.x + i, y: this.position.y });
      if (i === 0 && condition(item) === null) {
        addMove(item);
      }
      if (i === 1 && this.firstMove && acc.length > 0 && condition(item) === null) {
        addMove(item);
      }
      return acc;
    }, [])

    // kills
    const condition2 = (x, y) => {
      if (this.position.x + x === field.length || this.position.x + x < 0) {
        return null;
      }
      if (this.position.y + y === field.length || this.position.y + y < 0) {
        return null;
      } 
      return field[this.position.x + x][this.position.y + y].figure;
    }

    available.kill = [1, -1].reduce((acc, item) => {
      const obj = {
        x: this.position.x + move,
        y: this.position.y + item
      }

      if (condition2(move, item) !== null) {
        if (condition2(move, item).color !== this.color) {
          if (condition2(move, item).name === 'King') {
            available.check.push(obj);
            return acc;
          }
          acc.push(obj)
        } 
        else {
          available.cover.push(obj);
        }
      }

      if (obj.y !== -1 && obj.y !== 8) {
        available.dontAllowKingToMove.push(obj);
      }
      
      return acc;
    }, []);

    available.wayToKing.push({...this.position});

    return available;
  }

  /**
   * @method makeMove
   * @memberof Chess#Figures#Pawn#
   * @param {Array} cordinates - new position for figure [x, y] 
   * @param {Array} field - chess board
   * @returns {undefined} undefined 
   * @example 
   * const f = new Field()
   * this.makeMove([0, 1], f.board)
   */
  makeMove(cordinates, field) {
    super.makeMove(cordinates, field, this);

    if (this.firstMove) {
      this.firstMove = false;
      if (this.color === 'white' && this.position.x === 4) {
        this.enPassant = true;
      }
      if (this.color === 'black' && this.position.x === 3) {
        this.enPassant = true;
      }
    }
    
    this.checkPromotion(this);
  }

  /**
   * @method checkPromotion
   * @memberof Chess#Figures#Pawn#
   * @param {Instance} figure 
   * @description Checks if pawn is ready for promotion
   * @returns {undefined} undefined
   * @example this.checkPromotion(this)
   */
  checkPromotion(figure) {
    if (figure.position.x === 0 || figure.position.x === 7) {
      this.promotion = true;
    }
  }
  
  makeEnPassant(newPosition, pawnPositon, field) {
    field[pawnPositon.x][pawnPositon.y].figure = null;
    super.moveFigure(field, this, ...newPosition);
  }
}