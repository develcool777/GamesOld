export default class Game {
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

  log() {
    console.log({
      userScore: this.userScore,
      compScore: this.computerScore,
      history: this.history
    });
  }

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

  normalGame(user='') {
    if (!['r', 'p', 's'].includes(user)) {
      throw Error(`Game.normalGame(user='') user must be 'r' or 'p' or 's'`);
    }
    const compMoves = ['r', 'p', 's'];
    const comp = compMoves[Math.floor(Math.random() * compMoves.length)]
    return {user, comp};
  }

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
      const win = this.cheak(user, comp);
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

  clean() {
    this.userScore = 0;
    this.computerScore = 0;
    this.history.splice(0);
  }

  calculateScore(winner='') {
    if (!['user', 'comp'].includes(winner)) {
      throw Error(`Game.calculateScore(winner='') winner must be 'user' or 'comp'`);
    }
    if (winner === 'user') {
      return this.userScore++;
    }
    this.computerScore++
  }

  cheak(i1, i2) {
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

  getAllDrawsByMove(move='') {
    if (!['r', 'p', 's'].includes(move)) {
      throw Error(`Game.getAllDrawsByMove(move='') move must be 'r' or 'p' or 's'`);
    }
    const filtered = this.history.filter(item => item.result === 'draw' && item.userMove === move && item.compMove === move);
    return filtered.length;
  }

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