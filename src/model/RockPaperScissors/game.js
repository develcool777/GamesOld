/**
 * @namespace RockPaperScissors
 */

export default class Game {
  /**
   * @class
   * @alias Game
   * @memberof RockPaperScissors#
   * @classdesc This class represents logic of RockPaperScissors game
   * @property {Number} userScore - shows user score in game(how many times user win)
   * @property {Number} computerScore - shows computer score in game(how many times computer win)
   * @property {Array} history - stores array of elements, where element is result of battle
   * between user and comp in format {userMove: 'r', compMove: 'p', result: 'comp', userScore: 0, compScore: 1}
   */
  constructor() {
    let userScore = 0;
    let computerScore = 0;
    const history = [];
    Object.defineProperties(this, {
      userScore: {
        get: () => userScore,
        set: (value) => {
          if (!Number.isInteger(value)) {
            throw Error(`userScore.set() value must be integer`);
          }
          userScore = value;
        } 
      },
      computerScore: {
        get: () => computerScore,
        set: (value) => {
          if (!Number.isInteger(value)) {
            throw Error(`computerScore.set() value must be integer`);
          }
          computerScore = value;
        } 
      },
      history: {
        get: () => history
      }
    })
  }
  /**
   * @method log
   * @memberof RockPaperScissors#Game#
   * @description shows value of all class properties in console
   * @returns {undefined}
   * @example this.log
   */
  get log() {
    return console.log({
      userScore: this.userScore,
      compScore: this.computerScore,
      history: this.history
    });
  }

  /**
   * @method withoutDrawMode
   * @memberof RockPaperScissors#Game#
   * @param {String} user - user choice ('r' for Rock, 'p' for Paper, 's' for Scissors)
   * @throws Error - if `user` value is not ('r' or 'p' or 's')
   * @description Computer can not choose the same item as user(ex. user choose rock, 
   * so computer will choose between paper and scissors)
   * @returns {Object}
   * @example const moves = this.withoutDrawMode('r') // {user: 'r', comp: 'p'}
   */
  withoutDrawMode(user='') {
    if (!['r', 'p', 's'].includes(user)) {
      throw Error(`Game.withoutDrawMode(user='') user must be 'r' or 'p' or 's'`);
    }
    const compMoves = ['r', 'p', 's'];
    const index = compMoves.indexOf(user);
    compMoves.splice(index,1);
    const comp = compMoves[Math.floor(Math.random() * compMoves.length)]
    return {user, comp};
  }

  /**
   * @method impossibleMode
   * @memberof RockPaperScissors#Game#
   * @param {String} user - user choice ('r' for Rock, 'p' for Paper, 's' for Scissors)
   * @throws Error - if `user` value is not ('r' or 'p' or 's')
   * @description Computer chooses the best move against user(ex. user chooses rock, so computer will choose paper)
   * @returns {Object}
   * @example const moves = this.impossibleMode(r) // {user: 'r', comp: 'p'}
   */
  impossibleMode(user='') {
    if (!['r', 'p', 's'].includes(user)) {
      throw Error(`Game.impossibleMode(user='') user must be 'r' or 'p' or 's'`);
    }
    if (user === 'r') { 
      return {user: 'r', comp: 'p'};
    }
    if (user === 'p') { 
      return {user: 'p', comp: 's'};
    }
    if (user === 's') { 
      return {user: 's', comp: 'r'};
    }
  }

  /**
   * @method easyMode
   * @memberof RockPaperScissors#Game#
   * @param {String} user - user choice ('r' for Rock, 'p' for Paper, 's' for Scissors)
   * @throws Error - if `user` value is not ('r' or 'p' or 's')
   * @description computer chooses the worst move against user(ex. user chooses rock, so computer will choose scissors)
   * @returns {Object}
   * @example const moves = this.easyMode('r') // {user: 'r', comp: 's'}
   */
  easyMode(user='') {
    if (!['r', 'p', 's'].includes(user)) {
      throw Error(`Game.easyMode(user='') user must be 'r' or 'p' or 's'`);
    }
    if (user === 'r') { 
      return {user: 'r', comp: 's'};
    }
    if (user === 'p') { 
      return {user: 'p', comp: 'r'};
    }
    if (user === 's') { 
      return {user: 's', comp: 'p'};
    }
  }

  /**
   * @method normalGame
   * @memberof RockPaperScissors#Game#
   * @param {String} user - user choice ('r' for Rock, 'p' for Paper, 's' for Scissors)
   * @throws Error - if `user` value is not ('r' or 'p' or 's')
   * @description computer chooses random move against user
   * @returns {Object}
   * @example const moves = this.normalGame('r')
   */
  normalGame(user='') {
    if (!['r', 'p', 's'].includes(user)) {
      throw Error(`Game.normalGame(user='') user must be 'r' or 'p' or 's'`);
    }
    const compMoves = ['r', 'p', 's'];
    const comp = compMoves[Math.floor(Math.random() * compMoves.length)]
    return {user, comp};
  }


  /**
   * @method play
   * @memberof RockPaperScissors#Game#
   * @param {String} user - user choice ('r' for Rock, 'p' for Paper, 's' for Scissors)
   * @param {String} comp - computer choice ('r' for Rock, 'p' for Paper, 's' for Scissors)
   * @throws 
   * Error - if `user` value is not ('r' or 'p' or 's')
   * Error - if `comp` value is not ('r' or 'p' or 's')
   * @description Determines who won or it's a draw, also pushes result of the play in `this.history` 
   * @returns {undefined}
   * @example this.play('r', 'p');
   */
  play(user='', comp='') {
    if (!['r', 'p', 's'].includes(user)) {
      throw Error(`Game.cheak(user='', comp='') user must be 'r' or 'p' or 's'`);
    }
    if (!['r', 'p', 's'].includes(comp)) {
      throw Error(`Game.cheak(user='', comp='') comp must be 'r' or 'p' or 's'`);
    }
    let winner;
    if (user === comp) {
      winner = 'draw';
    } else {
      const win = this.check(user, comp);
      winner = win === user ? 'user' : 'comp';
      this.calculateScore(winner);
    }
    const result = {
      userMove: user,
      compMove: comp,
      result: winner,
      userScore: this.userScore,
      compScore: this.computerScore
    }
    this.history.push(result);
  }

  /**
   * @method clean
   * @memberof RockPaperScissors#Game#
   * @description Sets all class properties to initial value
   * @returns {undefined}
   * @example this.clean()
   */
  clean() {
    this.userScore = 0;
    this.computerScore = 0;
    this.history.splice(0);
  }

  /**
   * @method calculateScore
   * @memberof RockPaperScissors#Game#
   * @param {String} winner must be 'user' or 'comp'
   * @throws Error - if value of `winner` is not 'user' or 'comp'
   * @description Increase score depending on `winner` value(if winner is user then `this.userScore++`, otherwise `this.computerScore++`) 
   * @returns {undefined}
   * @example this.calculateScore('user')
   */ 
  calculateScore(winner='') {
    if (!['user', 'comp'].includes(winner)) {
      throw Error(`Game.calculateScore(winner='') winner must be 'user' or 'comp'`);
    }
    if (winner === 'user') { this.userScore++ } 
    else { this.computerScore++ }
  }

  /**
   * @method check
   * @memberof RockPaperScissors#Game#
   * @param {String} i1 must be 'r' or 'p' or 's'
   * @param {String} i2 must be 'r' or 'p' or 's'
   * @description Determines who won i1 or i2
   * @returns {String}
   * @example const result = this.check('r', 'p') // wins 'p', because 'p' covers 'r'
   */
  check(i1, i2) {
    if (i1 === 'r' && i2 === 's' || i1 === 's' && i2 === 'r') {
      return 'r';
    }
    if (i1 === 'p' && i2 === 's' || i1 === 's' && i2 === 'p') {
      return 's';
    }
    if (i1 === 'p' && i2 === 'r' || i1 === 'r' && i2 === 'p') {
      return 'p';
    }
  }

  /**
   * @method getAllWinsByMove
   * @memberof RockPaperScissors#Game#
   * @param {String} move must be 'r' or 'p' or 's'
   * @param {String} winner must be 'user' or 'comp'
   * @throws 
   * Error - if `move` is not 'r' or 'p' or 's'
   * Error - if `winner` is not 'user' or 'comp'
   * @description Searches in `this.history` and returns quantity of wins by `winner` with `move` 
   * @returns {Number}
   * @example const userWins = this.getAllWinsByMove('r', 'user') // returns number of user wins by rock
   */
  getAllWinsByMove(move='', winner='') {
    if (!['r', 'p', 's'].includes(move)) {
      throw Error(`Game.getAllWinsBymove(move='', winner='') move must be 'r' or 'p' or 's'`);
    }
    if (!['user', 'comp'].includes(winner)) {
      throw Error(`Game.getAllWinsBymove(move='', winner='') winner must be 'user' or 'comp'`);
    }
    const filtered = this.history.filter(item => {
      if (item.result === winner) {
        if (winner === 'comp' && item.compMove === move) {
          return item;
        }
        if (winner === 'user' && item.userMove === move) {
          return item;
        }
      }
    });
    return filtered.length;
  }

  /**
   * @method getAllDrawsByMove
   * @memberof RockPaperScissors#Game#
   * @param {String} move must be 'r' or 'p' or 's'
   * @throws Error - if `move` is not 'r' or 'p' or 's'
   * @description returns number of draws by `move`
   * @returns {Number}
   * @example const draws = this.getAllDrawsByMove('r') // returns number of draws by rock
   */
  getAllDrawsByMove(move='') {
    if (!['r', 'p', 's'].includes(move)) {
      throw Error(`Game.getAllDrawsByMove(move='') move must be 'r' or 'p' or 's'`);
    }
    const filtered = this.history.filter(item => item.result === 'draw' && item.userMove === move && item.compMove === move);
    return filtered.length;
  }

  /**
   * @method analytics
   * @memberof RockPaperScissors#Game#
   * @description Returns object with analitics {
   *  comp: {r: 0, p: 0, s: 0},
   *  draws: {r: 0, p: 0, s: 0},
   *  user: {r: 0, p: 0, s: 0}
   * }, shows how many times user and comp wins, also draws (by rock, paper, scissors)
   * @returns {Object}
   * @example const analytic = this.analytics()
   */
  analytics() {
    const moves = ['r', 'p', 's'];
    const winners = ['user', 'comp'];
    const wins = winners.reduce((acc, winner) => {
      const res = moves.reduce((obj, move) => {
        obj[move] = this.getAllWinsByMove(move, winner)
        return obj;
      }, {})
      acc[winner] = res;
      return acc;
    }, {});
    const draws = moves.reduce((acc, move) => {
      acc[move] = this.getAllDrawsByMove(move);
      return acc;
    }, {})
    return Object.assign(wins, {draws});
  }
}