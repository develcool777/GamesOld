import { expect } from '@jest/globals';
import Game from '../../src/model/ticTacToe/game'

describe('creating instance of Game', () => {
  const g = new Game(); 

  test('instance of class Game', () => {
    expect(new Game()).toBeInstanceOf(Game);
  });

  test('properties of class Game', () => {
    expect(Object.getOwnPropertyNames(new Game)).toEqual(['field', 'currentPlayer', 'winner', 'gameStatus',  'winnerCells', 'moves', 'comp']);
  });

  test('properties values of class Game', () => {
    expect(g.field).toEqual([
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ]);
    expect(g.currentPlayer).toMatch('x');
    expect(g.winner).toMatch('');
    expect(g.gameStatus).toMatch('');
    expect(g.winnerCells).toEqual([]);
    expect(g.moves).toEqual([]);
    expect(g.comp).toEqual({compSide: 'o', difficulty: 'easy', playWithComputer: true, userSide: 'x'});
  });
});

describe('testing properties', () => {
  const g = new Game(); 

  test('property: field', () => {
    expect(g.field).toEqual([
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ]);
    expect(() => g.field = 'no Array').toThrowError(new Error(`field.set(value) value must be Array`));
    expect(() => g.field = [1, 2]).toThrowError(new Error(`field.set(value) length of value must be 3`));
    expect(() => g.field = ['no subarray', 'no subarray', 'no subarray']).toThrowError(new Error(`field.set(value) every element of value must be Array`));
    expect(() => g.field = [[1, []], [3], ['', 4]]).toThrowError(new Error(`field.set(value) every subarray of value must have length 3`));
    expect(() => g.field = [[1, [], {}], [3, 6, ''], ['', 4, []]]).toThrowError(new Error(`field.set(value) every element of 2D array(value) must be String`));
    expect(() => g.field = [['', 'g', 'k'], ['', 'x', 'string'], ['word', '', 'abs']]).toThrowError(new Error(`field.set(value) every element of 2D array(value) must be '' or 'x' or 'o'`));
    expect(g.field = [ ['x', '', ''], ['', 'x', ''], ['', '', 'x'] ]).toEqual([ ['x', '', ''], ['', 'x', ''],['', '', 'x'] ]);
  });

  test('property: currentPlayer', () => {
    expect(g.currentPlayer).toMatch('x');
    expect(() => g.currentPlayer = 1).toThrowError(new Error(`currentPlayer.set(value) value must be String`));
    expect(() => g.currentPlayer = "string").toThrowError(new Error(`currentPlayer.set(value) value must be 'x' or 'o'`));
    expect(g.currentPlayer = 'o').toMatch('o');
    expect(g.currentPlayer = 'x').toMatch('x');
  });

  test('property: winner', () => {
    expect(g.winner).toMatch('');
    expect(() => g.winner = 1).toThrowError(new Error(`winner.set(value) value must be String`));
    expect(() => g.winner = 'string').toThrowError(new Error(`winner.set(value) value must be 'draw' or 'x' or 'o' or ''`));
    expect(g.winner = 'draw').toMatch('draw');
    expect(g.winner = 'x').toMatch('x');
    expect(g.winner = 'o').toMatch('o');
    expect(g.winner = '').toMatch('');
  });

  test('property: gameStatus', () => {
    expect(g.gameStatus).toMatch('');
    expect(() => g.gameStatus = 1).toThrowError(new Error(`gameStatus.set(value) value must be String`));
    expect(() => g.gameStatus = 'string').toThrowError(new Error(`gameStatus.set(value) value must be 'start' or 'finish' or ''`));
    expect(g.gameStatus = 'start').toMatch('start');
    expect(g.gameStatus = 'finish').toMatch('finish');
    expect(g.gameStatus = '').toMatch('');
  });

  test('property: winnerCells', () => {
    expect(g.winnerCells).toEqual([]);
    expect(() => g.winnerCells = []).toThrowError(new Error(`Cannot set property winnerCells of #<Game> which has only a getter`));
  });

  test('property: moves', () => {
    expect(g.moves).toEqual([]);
    expect(() => g.moves = []).toThrowError(new Error(`Cannot set property moves of #<Game> which has only a getter`));
  });

  test('property: comp', () => {
    expect(g.comp).toEqual({compSide: 'o', difficulty: 'easy', playWithComputer: true, userSide: 'x'});
    expect(() => g.comp = []).toThrowError(new Error(`Cannot set property comp of #<Game> which has only a getter`));
  });
});

describe('testing methods', () => {
  const g = new Game();

  test('log', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    expect(g.log).toBeUndefined();
    expect(console.log.mock.calls[0][0]).toEqual({ 
      comp: {compSide: 'o', difficulty: 'easy', playWithComputer: true, userSide: 'x'},
      currentPlayer: 'x',
      field: [ ['', '', ''], ['', '', ''], ['', '', ''] ],
      moves: [],
      gameStatus: '',
      winner: '',
      winnerCells: []
    });
    spy.mockRestore();
  });

  test('getFieldForDraw()', () => {
    expect(g.getFieldForDraw()).toEqual([
      {
        cell: '',
        coordinates: {
          x: 0,
          y: 0,
        },
        currentPlayer: 'x',
        winCell: false,
      },
      {
        cell: '',
        coordinates: {
          x: 0,
          y: 1,
        },
        currentPlayer: 'x',
        winCell: false,
      },
      {
        cell: '',
        coordinates: {
          x: 0,
          y: 2,
        },
        currentPlayer: 'x',
        winCell: false,
      },
      {
        cell: '',
        coordinates: {
          x: 1,
          y: 0,
        },
        currentPlayer: 'x',
        winCell: false,
      },
      {
        cell: '',
        coordinates: {
          x: 1,
          y: 1
        },
        currentPlayer: 'x',
        winCell: false,
      },
      {
        cell: '',
        coordinates: {
          x: 1,
          y: 2,
        },
        currentPlayer: 'x',
        winCell: false,
      },
      {
        cell: '',
        coordinates: {
          x: 2,
          y: 0,
        },
        currentPlayer: 'x',
        winCell: false,
      },
      {
        cell: '',
        coordinates: {
          x: 2,
          y: 1,
        },
        currentPlayer: 'x',
        winCell: false,
      },
      {
        cell: '',
        coordinates: {
          x: 2,
          y: 2,
        },
        currentPlayer: 'x',
        winCell: false,
      },
    ]);
    expect(g.field = [ ['x', 'o', ''], ['o', 'x', 'x'], ['o', '', 'x'] ]).toEqual([ ['x', 'o', ''], ['o', 'x', 'x'], ['o', '', 'x'] ]);
    g.winnerCells.push([0, 0], [1, 1], [2, 2]);
    expect(g.winnerCells).toHaveLength(3)
    expect(g.getFieldForDraw()).toEqual([
      {
        cell: 'x',
        coordinates: {
          x: 0,
          y: 0,
        },
        currentPlayer: 'x',
        winCell: true,
      },
      {
        cell: 'o',
        coordinates: {
          x: 0,
          y: 1,
        },
        currentPlayer: 'x',
        winCell: false,
      },
      {
        cell: '',
        coordinates: {
          x: 0,
          y: 2,
        },
        currentPlayer: 'x',
        winCell: false,
      },
      {
        cell: 'o',
        coordinates: {
          x: 1,
          y: 0,
        },
        currentPlayer: 'x',
        winCell: false,
      },
      {
        cell: 'x',
        coordinates: {
          x: 1,
          y: 1
        },
        currentPlayer: 'x',
        winCell: true,
      },
      {
        cell: 'x',
        coordinates: {
          x: 1,
          y: 2,
        },
        currentPlayer: 'x',
        winCell: false,
      },
      {
        cell: 'o',
        coordinates: {
          x: 2,
          y: 0,
        },
        currentPlayer: 'x',
        winCell: false,
      },
      {
        cell: '',
        coordinates: {
          x: 2,
          y: 1,
        },
        currentPlayer: 'x',
        winCell: false,
      },
      {
        cell: 'x',
        coordinates: {
          x: 2,
          y: 2,
        },
        currentPlayer: 'x',
        winCell: true,
      },
    ]);
  });

  test('clear()', () => {
    expect(g.clear()).toBeTruthy();
    expect(g.field).toEqual([
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ]);
    expect(g.currentPlayer).toMatch('x');
    expect(g.winner).toMatch('');
    expect(g.winnerCells).toEqual([]);
    expect(g.moves).toEqual([]);
    expect(g.gameStatus).toMatch('');
  });

  test('play()', () => {
    expect(() => g.play('6', 12.45)).toThrowError(new Error(`Game.play(cordX, cordY) cordX and cordY must be Integer`));
    expect(() => g.play(12345, 150)).toThrowError(new Error(`Game.play(cordX, cordY) cordX and cordY must be in range(0, 2)`));
    expect(g.play(0, 0)).toBeTruthy();
    expect(g.play(0, 0)).toBeFalsy(); 
    expect(g.play(0, 1)).toBeTruthy();
    expect(g.play(1, 1)).toBeTruthy();
    expect(g.play(0, 2)).toBeTruthy();
    expect(g.play(2, 2)).toBeTruthy();
    expect(g.play(1, 0)).toBeFalsy(); 
    expect(g.currentPlayer).toMatch('o');
    expect(g.winner).toMatch('x');
    expect(g.winnerCells).toEqual([[0, 0], [1, 1], [2, 2]]); 
    expect(g.moves).toEqual([
      {
        player: 'x',
        x: 0,
        y: 0,
      },
      {
        player: 'o',
        x: 0,
        y: 1,
      },
      {
        player: 'x',
        x: 1,
        y: 1,
      },
      {
        player: 'o',
        x: 0,
        y: 2,
      },
      {
        player: 'x',
        x: 2,
        y: 2,
      },
    ]);
    expect(g.clear()).toBeTruthy();
  });

  test('returnMove()', () => {
    // field is empty
    expect(g.field).toEqual([['', '', ''], ['', '', ''], ['', '', '']]);
    expect(g.returnMove()).toBeFalsy();

    // there is a win
    expect(g.play(0, 0)).toBeTruthy();
    expect(g.play(0, 1)).toBeTruthy();
    expect(g.play(1, 1)).toBeTruthy();
    expect(g.play(0, 2)).toBeTruthy();
    expect(g.play(2, 0)).toBeTruthy();
    expect(g.play(2, 2)).toBeTruthy();
    expect(g.play(1, 0)).toBeTruthy();
    expect(g.winner).toMatch('x');
    expect(g.returnMove()).toBeFalsy();
    expect(g.clear()).toBeTruthy();

    // playing with comp, case 1
    expect(g.play(0, 0)).toBeTruthy();
    expect(g.play(0, 1)).toBeTruthy();
    expect(g.play(1, 1)).toBeTruthy();
    expect(g.play(0, 2)).toBeTruthy();
    expect(g.play(2, 0)).toBeTruthy();
    expect(g.play(2, 2)).toBeTruthy();
    expect(g.comp.playWithComputer = true).toBeTruthy();
    expect(g.moves).toHaveLength(6);
    expect(g.currentPlayer).toMatch('x');
    expect(g.field).toEqual([['x', 'o', 'o'], ['', 'x', ''], ['x', '','o']]);
    expect(g.returnMove()).toBeTruthy();
    expect(g.currentPlayer).toMatch('x');
    expect(g.field).toEqual([['x', 'o', 'o'], ['', 'x', ''], ['', '','']]);
    expect(g.moves).toHaveLength(4);
    expect(g.clear()).toBeTruthy();

    // playing with comp, case 2
    expect(g.play(0, 0)).toBeTruthy();
    expect(g.comp.playWithComputer = true).toBeTruthy();
    expect(g.comp.compSide = 'x').toMatch('x');
    expect(g.comp.userSide = 'o').toMatch('o');
    expect(g.field).toEqual([['x', '', ''], ['', '', ''], ['', '','']]);
    expect(g.moves).toHaveLength(1);
    expect(g.returnMove()).toBeTruthy();
    expect(g.field).toEqual([['x', '', ''], ['', '', ''], ['', '','']]);
    expect(g.moves).toHaveLength(1);
    expect(g.clear()).toBeTruthy();

    // playing with user
    expect(g.play(0, 0)).toBeTruthy();
    expect(g.play(0, 1)).toBeTruthy();
    expect(g.play(1, 1)).toBeTruthy();
    expect(g.comp.playWithComputer = false).toBeFalsy();
    expect(g.field).toEqual([['x', 'o', ''], ['', 'x', ''], ['', '','']]);
    expect(g.moves).toHaveLength(3);
    expect(g.returnMove()).toBeTruthy();
    expect(g.field).toEqual([['x', 'o', ''], ['', '', ''], ['', '','']]);
    expect(g.moves).toHaveLength(2);
    expect(g.clear()).toBeTruthy();
  });

  test('checkWinner()', () => {
    expect(g.moves).toHaveLength(0)
    expect(g.checkWinner()).toBeFalsy();

    expect(g.play(0, 1)).toBeTruthy();
    expect(g.play(1, 1)).toBeTruthy();
    expect(g.play(0, 2)).toBeTruthy();
    expect(g.moves).toHaveLength(3);
    expect(g.checkWinner()).toBeFalsy();
    expect(g.clear()).toBeTruthy();

    // first column 
    [[0, 0], [1, 1], [1, 0], [2, 2], [2, 0]].forEach(move => {
      expect(g.play(...move)).toBeTruthy();
    })
    expect(g.winner).toMatch('x');
    expect(g.winnerCells).toEqual([[0, 0], [1, 0], [2, 0]]);
    expect(g.gameStatus).toMatch('finish');
    expect(g.clear()).toBeTruthy();

    // second column 
    [[0, 1], [1, 0], [1, 1], [2, 2], [2, 1]].forEach(move => {
      expect(g.play(...move)).toBeTruthy();
    })
    expect(g.winner).toMatch('x');
    expect(g.winnerCells).toEqual([[0, 1], [1, 1], [2, 1]]);
    expect(g.gameStatus).toMatch('finish');
    expect(g.clear()).toBeTruthy();

    // third column 
    [[0, 1], [0, 2], [1, 1], [1, 2], [2, 0], [2, 2]].forEach(move => {
      expect(g.play(...move)).toBeTruthy();
    })
    expect(g.winner).toMatch('o');
    expect(g.winnerCells).toEqual([[0, 2], [1, 2], [2, 2]]);
    expect(g.gameStatus).toMatch('finish');
    expect(g.clear()).toBeTruthy();

    // first row
    [[0, 0], [1, 2], [0, 1], [1, 0], [0, 2]].forEach(move => {
      expect(g.play(...move)).toBeTruthy();
    })
    expect(g.winner).toMatch('x');
    expect(g.winnerCells).toEqual([[0, 0], [0, 1], [0, 2]]);
    expect(g.gameStatus).toMatch('finish');
    expect(g.clear()).toBeTruthy();

    // second row
    [[1, 0], [0, 2], [1, 1], [0, 1], [1, 2]].forEach(move => {
      expect(g.play(...move)).toBeTruthy();
    })
    expect(g.winner).toMatch('x');
    expect(g.winnerCells).toEqual([[1, 0], [1, 1], [1, 2]]);
    expect(g.gameStatus).toMatch('finish');
    expect(g.clear()).toBeTruthy();

    // third row
    [[2, 0], [0, 2], [2, 1], [0, 1], [2, 2]].forEach(move => {
      expect(g.play(...move)).toBeTruthy();
    })
    expect(g.winner).toMatch('x');
    expect(g.winnerCells).toEqual([[2, 0], [2, 1], [2, 2]]);
    expect(g.gameStatus).toMatch('finish');
    expect(g.clear()).toBeTruthy();

    // diagonal \
    [[0, 0], [0, 2], [1, 1], [0, 1], [2, 2]].forEach(move => {
      expect(g.play(...move)).toBeTruthy();
    })
    expect(g.winner).toMatch('x');
    expect(g.winnerCells).toEqual([[0, 0], [1, 1], [2, 2]]);
    expect(g.gameStatus).toMatch('finish');
    expect(g.clear()).toBeTruthy();

    // diagonal /
    [[0, 2], [1, 2], [1, 1], [0, 1], [2, 0]].forEach(move => {
      expect(g.play(...move)).toBeTruthy();
    })
    expect(g.winner).toMatch('x');
    expect(g.winnerCells).toEqual([[0, 2], [1, 1], [2, 0]]);
    expect(g.gameStatus).toMatch('finish');
    expect(g.clear()).toBeTruthy();

    // draw
    [[0, 0], [1, 1], [2, 0], [1, 0], [1, 2], [0, 1], [2, 1], [2, 2], [0, 2]].forEach(move => {
      expect(g.play(...move)).toBeTruthy();
    })
    expect(g.winner).toMatch('draw');
    expect(g.winnerCells).toEqual([]);
    expect(g.gameStatus).toMatch('finish');
    expect(g.clear()).toBeTruthy();
  });

  test('playWithComputer()', () => {
    [[0, 0], [1, 2], [0, 1], [1, 0], [0, 2]].forEach(move => {
      expect(g.play(...move)).toBeTruthy();
    });
    expect(g.playWithComputer()).toBeFalsy();
    expect(g.clear()).toBeTruthy();

    expect(g.comp.difficulty = 'easy').toMatch('easy');
    expect(g.playWithComputer()).toBeTruthy();
    expect(g.playWithComputer()).toBeTruthy();
    expect(g.playWithComputer()).toBeTruthy();
    expect(g.moves).toHaveLength(3);
    expect(g.clear()).toBeTruthy();

    expect(g.comp.difficulty = 'hard').toMatch('hard');
    expect(g.playWithComputer()).toBeTruthy();
    expect(g.playWithComputer()).toBeTruthy();
    expect(g.playWithComputer()).toBeTruthy();
    expect(g.moves).toHaveLength(3);
    expect(g.clear()).toBeTruthy();
  });

  test('computerMoveClever()', () => {
    expect(g.computerMoveClever()).toHaveLength(2);
  });

  test('computerMoveRandom()', () => {
    const spy = jest.spyOn(Math, 'random').mockImplementation(() => 0.5);
    expect(g.computerMoveRandom()).toEqual([1, 1]);
    expect(g.play(...[1, 1])).toBeTruthy();
    expect(g.computerMoveRandom()).toEqual([1, 2]);
    expect(spy).toHaveBeenCalled();
    expect(g.clear()).toBeTruthy();
    spy.mockRestore();
  });

  test('availableMoves()', () => {
    expect(g.availableMoves()).toEqual([[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]]);
    expect(g.availableMoves()).toHaveLength(9);
    expect(g.play(...[1, 1])).toBeTruthy();
    expect(g.play(...[0, 2])).toBeTruthy();
    expect(g.play(...[2, 1])).toBeTruthy();
    expect(g.availableMoves()).toEqual([[0, 0], [0, 1], [1, 0], [1, 2], [2, 0], [2, 2]]);
    expect(g.availableMoves()).toHaveLength(6);
    expect(g.clear()).toBeTruthy();
  });

  test('startGame()', () => {
    expect(g.startGame()).toBeUndefined();
    expect(g.gameStatus).toMatch('start');
    expect(g.currentPlayer).toMatch('x');
    expect(g.clear()).toBeTruthy();

    expect(g.comp.playWithComputer = true).toBeTruthy();
    expect(g.comp.compSide = 'x').toMatch('x');
    expect(g.comp.userSide = 'o').toMatch('o');
    expect(g.startGame()).toBeUndefined();
    expect(g.gameStatus).toMatch('start');
    expect(g.moves).toHaveLength(1);
    expect(g.currentPlayer).toMatch('o');
    expect(g.clear()).toBeTruthy();
  });

  test('finishGame()', () => {
    expect(g.finishGame()).toBeUndefined();
    expect(g.gameStatus).toMatch('finish');
  });
});