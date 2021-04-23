module.exports = class Game {
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

  withoutDrawMode(user='') {
    if (!['r', 'p', 's'].includes(user)) {
      throw Error(`Game.withoutDrawMode(user='') user must be 'r' or 'p' or 's'`);
    }
    const index = ['r', 'p', 's'].indexOf(user);
    const compMoves = ['r', 'p', 's'].splice(index,1);
    const comp = compMoves[Math.floor(Math.random() * compMoves.length)]
    return {user, comp};
  }

  imposibleMode(user='') {
    if (!['r', 'p', 's'].includes(user)) {
      throw Error(`Game.imposibleMode(user='') user must be 'r' or 'p' or 's'`);
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
      console.log('DRAW');
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

  getAllWinsBymove(move='', winner='') {
    if (!['r', 'p', 's'].includes(move)) {
      throw Error(`Game.getAllWinsBymove(move='', winner='') move must be 'r' or 'p' or 's'`);
    }
    if (!['user', 'comp'].includes(winner)) {
      throw Error(`Game.getAllWinsBymove(move='', winner='') winner must be 'user' or 'comp'`);
    }
    const filteredByMove = this.history.filter(item => item.userMove === move || item.compMove === move);
    const filteredByWinner = filteredByMove.filter(item => item.result === winner);
    return filteredByWinner.length;
  }

  analytics() {
    const moves = ['r', 'p', 's'];
    const winners = ['user', 'comp'];
    return winners.reduce((acc, winner) => {
      const res = moves.reduce((obj, move) => {
        obj[move] = this.getAllWinsBymove(move, winner)
        return obj;
      }, {})
      acc[winner] = res
      return acc;
    }, {})
  }
}