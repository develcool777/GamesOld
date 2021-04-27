export default class Game {
// module.exports = class Game {
  constructor() {
    let field = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ]
    let currentPlayer = 'x';
    let numberOfMoves = 0;
    const winner = [];
    const moves = [];
    Object.defineProperties(this, {
      field: {
        get: () => field,
        set: (value) => {
          if (!Array.isArray(value)) {
            throw Error(`field.set(value) value must be Array`);
          }
          field = value;
        }
      },
      currentPlayer: {
        get: () => currentPlayer,
        set: (value) => {
          if (typeof value !== 'string') {
            throw Error(`currentPlayer.set(value) value must be String`);
          }
          if (['x', 'o'].indexOf(value) === -1) {
            throw Error(`currentPlayer.set(value) value must be 'x' or 'o'`);
          }
          currentPlayer = value;
        }
      },
      numberOfMoves: {
        get: () => numberOfMoves,
        set: (value) => {
          if (!Number.isInteger(value)) {
            throw Error(`numberOfMoves.set(value) value must be Integer`);
          }
          numberOfMoves = value;
        }
      },
      winner: {
        get: () => winner
      },
      moves: {
        get: () => moves
      }
    })
  }
  log() {
    console.log({
      field: this.field, 
      currentPlayer: this.currentPlayer,
      winner: this.winner,
      moves: this.moves
    });
  }

  getField() {
    const match = (i, j) => {
      if (this.winner.length === 0) { return false }
      return this.winner.some(obj => {
        const arrayOfWinCells = Object.values(obj).pop();
        return arrayOfWinCells.some(pair => pair[0] === i && pair[1] === j)
      })
    }
    return this.field.map((arr, i) => {
      return arr.map((item, j) => {
        return {
          cell: item,
          winCell: match(i, j),
          coordinates: {
            x: i,
            y: j
          }
        }
      })
    }).flat();
  }

  clear() {
    this.field = this.field.map(arr => {
      return arr.map(() => {
        return '';
      });
    })
    this.currentPlayer = 'x';
    this.numberOfMoves = 0;
    this.winner.splice(0);
    this.moves.splice(0);
  }

  play(cordX, cordY) {
    if (this.winner.length > 0) { return }
    this.makeMove(this.currentPlayer, cordX, cordY);
    this.currentPlayer = this.currentPlayer === 'x' ? 'o' : 'x';
    this.numberOfMoves++;
    this.cheakWinner();
  }

  makeMove(player, cordX, cordY) {
    if (typeof player !== 'string') {
      throw Error(`Game.makeMove(player, cordX, cordY) player must be String`);
    }
    if (['x', 'o'].indexOf(player) === -1) {
      throw Error(`Game.makeMove(player, cordX, cordY) player must be 'x' or 'y`);
    }
    if (!Number.isInteger(cordX) || !Number.isInteger(cordY)) {
      throw Error(`Game.makeMove(player, cordX, cordY) cordX and cordY must be Integer`);
    }
    if (this.field[cordX][cordY] !== '') {
      return console.log('this cell is not available for move');
    }
    this.moves.push({x: cordX, y: cordY});
    this.field[cordX][cordY] = player;
  }

  returnMove() {
    if (this.numberOfMoves === 0 || this.winner.length > 0) { return }
    this.numberOfMoves--;
    const lastMove = this.moves.splice(this.moves.length - 1).pop();
    this.field[lastMove.x][lastMove.y] = '';
  }

  cheakWinner() {
    if (this.numberOfMoves < 4) { return } 
    const equals = (a,b,c) => a === b && b === c && a !== '';

    const cheak = (array, cheakColOrRow='') => {
      let coordinates;
      const result = [];
      for (let i = 0; i < array.length; i++) {
        if (cheakColOrRow === 'col') {
          coordinates = [[0, i], [1, i], [2, i]];
        }
        if (cheakColOrRow === 'row') {
          coordinates = [[i, 0], [i, 1], [i, 2]];
        }
        const values = coordinates.map((pair) => array[ pair[0] ][ pair[1] ]);
        const cheak = equals(...values);
        if (cheak) {
          const move = array[0][0];
          const obj = {};
          obj[move] = coordinates;
          result.push(obj);
          continue;
        }
        result.push(false);
      }
      const filtered = result.filter(item => item !== false);
      return filtered.length > 0 ? filtered : false;
    }

    const cheakDiagonals = array => {
      const mainCoordinates = [[0, 0], [1, 1], [2, 2]];
      const secondaryCoordinates = [[0, 2], [1, 1], [2, 0]];
      const cheaked = [mainCoordinates, secondaryCoordinates].map(item => {
        const value = item.map((pair) => array[ pair[0] ][ pair[1] ]);
        const cheakedValue = equals(...value);
        if (cheakedValue) {
          const move = array[1][1];
          const obj = {};
          obj[move] = item;
          return obj;
        }
        return false;
      })
      const filtered = cheaked.filter(item => item !== false);
      return filtered.length > 0 ? filtered : false;
    }

    const cheakedDiagonals = cheakDiagonals(this.field);
    const cheakedRows = cheak(this.field, 'row');
    const cheackedColumns = cheak(this.field, 'col');
    // console.log({cheakedDiagonals, cheakedRows: cheakedRows, cheackedColumns: cheackedColumns});

    const filtered = [cheakedDiagonals, cheakedRows, cheackedColumns].filter(item => item !== false);
    if (filtered.length > 0 ) {
      filtered.forEach(arr => {
        this.winner.push(...arr);
      })
    }
  }

  playWithComputer() {
    const computerMove = this.computerMove();
    if (computerMove === undefined) { return }
    this.play(...computerMove);
  }

  computerMove() {
    const availableMoves = (array) => {
      return array.map((arr, i) => {
        return arr.map((cell, j) => {
          if (cell === '') {
            return [i, j];
          }
          return false;
        })
      }).flat().filter(pair => pair !== false);
    }

    const moves = availableMoves(this.field);
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    return randomMove;
  }
}