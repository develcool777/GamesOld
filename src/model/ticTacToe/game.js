import { minMax, Board } from './minMaxAlgorithm';

export default class Game {
  constructor() {
    let field = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ]
    let currentPlayer = 'x';
    let winner = '';
    const resultAfterCheakWinner = [];
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
      winner: {
        get: () => winner,
        set: (value) => {
          if (typeof value !== 'string') {
            throw Error(`winner.set(value) value must be String`);
          }
          winner = value;
        }
      },
      resultAfterCheakWinner: {
        get: () => resultAfterCheakWinner
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
      resultAfterCheakWinner: this.resultAfterCheakWinner,
      winner: this.winner,
      moves: this.moves
    });
  }

  getField() {
    const match = (i, j) => {
      if (this.resultAfterCheakWinner.length === 0) { return false }
      return this.resultAfterCheakWinner.some(obj => {
        const arrayOfWinCells = Object.values(obj).pop();
        return arrayOfWinCells.some(pair => pair[0] === i && pair[1] === j)
      })
    }
    return this.field.map((arr, i) => {
      return arr.map((item, j) => {
        return {
          currentPlayer: this.currentPlayer,
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
    this.resultAfterCheakWinner.splice(0);
    this.moves.splice(0);
    this.winner = '';
  }

  play(cordX, cordY) {
    if (this.resultAfterCheakWinner.length > 0) { return }
    this.makeMove(this.currentPlayer, cordX, cordY);
    this.currentPlayer = this.currentPlayer === 'x' ? 'o' : 'x';
    this.cheakWinner(this.field);
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
    this.moves.push({player, x: cordX, y: cordY});
    this.field[cordX][cordY] = player;
  }

  returnMove(withComp=false, compFirstMove=false) {
    if (this.moves.length === 0 || this.resultAfterCheakWinner.length > 0 || this.moves.length === 9) { return }
    let amountOfMoves = 1;
    if (withComp) {
      amountOfMoves = 2; 
    } 
    if (compFirstMove && this.moves.length <= 2) {
      amountOfMoves = 0;    
    }
    const lastMoves = this.moves.splice(this.moves.length - amountOfMoves).reverse()
    lastMoves.forEach(move => {
      this.currentPlayer = move.player;
      this.field[move.x][move.y] = '';
    })

  }

  cheakWinner(field) {
    if (this.moves.length < 4) { return } 
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
        const cheakedValue = equals(...values);
        if (cheakedValue) {
          const move = values[0];
          const obj = {};
          obj[move] = coordinates;
          result.push(obj);
        }
      }
      return result.length > 0 ? result : false;
    }

    const cheakDiagonals = array => {
      const mainCoordinates = [[0, 0], [1, 1], [2, 2]];
      const secondaryCoordinates = [[0, 2], [1, 1], [2, 0]];
      const cheaked = [mainCoordinates, secondaryCoordinates].map(coord => {
        const value = coord.map((pair) => array[ pair[0] ][ pair[1] ]);
        const cheakedValue = equals(...value);
        if (cheakedValue) {
          const move = array[1][1];
          const obj = {};
          obj[move] = coord;
          return obj;
        }
        return false;
      })
      const filtered = cheaked.filter(item => item !== false);
      return filtered.length > 0 ? filtered : false;
    }
    // console.log(field);
    const cheakedDiagonals = cheakDiagonals(field);
    const cheakedRows = cheak(field, 'row');
    const cheackedColumns = cheak(field, 'col');
    // console.log({cheakedDiagonals, cheakedRows: cheakedRows, cheackedColumns: cheackedColumns});

    const filtered = [cheakedDiagonals, cheakedRows, cheackedColumns].filter(item => item !== false).flat();
    console.log({filtered});
    if (filtered.length > 0 ) {
      filtered.forEach(arr => {
        this.resultAfterCheakWinner.push(arr);
      })
      this.winner = Object.keys(filtered.pop()).pop();
    }
    if (this.moves.length === 9 && this.winner === '') {
      this.winner = `It's a draw`;
    }
  }

  playWithComputer(difficulty='easy') {
    const computerMove = difficulty === 'hard' ? this.computerMoveClever() : this.computerMoveRandom();
    if (computerMove === undefined) { return }
    this.play(...computerMove);
  }

  computerMoveClever() {
    const convertedToArray = this.field.flat();
    const b = new Board(convertedToArray);
    const m = new minMax();
    const maximizing = this.currentPlayer === 'x' ? true : false;
    const bestMove = m.getBestMove(b, maximizing);
    return [Math.floor(bestMove / 3), bestMove % 3];
  }

  computerMoveRandom() {
    const moves = this.availableMoves(this.field);
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    return randomMove;
  }

  availableMoves(array) {
    return array.map((arr, i) => {
      return arr.map((cell, j) => {
        if (cell === '') {
          return [i, j];
        }
        return false;
      })
    }).flat().filter(pair => pair !== false);
  }
}