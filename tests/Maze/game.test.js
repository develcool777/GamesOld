import { expect, jest } from '@jest/globals';
import Game from "../../src/model/maze/game";
import Player from '../../src/model/maze/player';
import Timer from '../../src/model/timer';

const DATA = {
  gameField: [
    [1, '^@',   1, 1],
    [1,  '#', '#', 1],
    [1,    0, '#', 1],
    [1,    1, '$', 1]
  ],
  startPosition: {
    x: 0,
    y: 1
  },
  winPosition: {
    x: 3,
    y: 2
  },
  time: 10_000
}

describe('creating instance of Game', () => {
  test('instance of class Game', () => {
    expect(() => new Game('field', null, undefined, NaN)).toThrowError(new Error(`Game.constructor field must be Array`));
    expect(() => new Game(['field'], null, undefined, NaN)).toThrowError(new Error(`Game.constructor field must be 2D Array`));
    expect(() => new Game([['field'], [[[]]]], null, undefined, NaN)).toThrowError(new Error(`Game.constructor field must be 2D Array where every element of it must be: 1 or 0 or '^@' or '#' or '$'`));
    expect(() => new Game([[1, 0], [0, 1]], null, undefined, NaN)).toThrowError(new Error(`Game.constructor startPosition must be Object`));
    expect(() => new Game([[1, 0], [0, 1]], {}, undefined, NaN)).toThrowError(new Error(`Game.constructor startPosition must contain 'x' and 'y'`));
    expect(() => new Game([[1, 0], [0, 1]], {x: null, y: -1.5}, null, NaN)).toThrowError(new Error(`Game.constructor startPosition.x and startPosition.y must be positive Integers`));
    expect(() => new Game([[1, 0], [0, 1]], {x: 1, y: 0}, null, NaN)).toThrowError(new Error(`Game.constructor winPosition must be Object`));
    expect(() => new Game([[1, 0], [0, 1]], {x: 1, y: 0}, {}, NaN)).toThrowError(new Error(`Game.constructor winPosition must contain 'x' and 'y'`));
    expect(() => new Game([[1, 0], [0, 1]], {x: 1, y: 0}, {x: -1.5, y: null}, NaN)).toThrowError(new Error(`Game.constructor winPosition.x and winPosition.y must be positive Integers`));
    expect(() => new Game([[1, 0], [0, 1]], {x: 1, y: 0}, {x: 2, y: 1}, NaN)).toThrowError(new Error(`Game.constructor time must be Integer and greater than 0`));
    expect(() => new Game([[1, 0], [0, 1]], {x: 1, y: 0}, {x: 2, y: 1}, -200)).toThrowError(new Error(`Game.constructor time must be Integer and greater than 0`));
    expect(new Game(...Object.values(DATA))).toBeInstanceOf(Game);
  });

  test('properties of class Game', () => {
    expect(Object.getOwnPropertyNames(new Game(...Object.values(DATA)))).toEqual([
      'field', 'player', 'history', 'winPos', 'startPos',
      'timer', 'gameStatus','resultTime', 'result'
    ]);
  });

  test('properties values of class Game', () => {
    const g = new Game(...Object.values(DATA));
    expect(g.field).toEqual([
      [1, '^@',   1, 1],
      [1,  '#', '#', 1],
      [1,    0, '#', 1],
      [1,    1, '$', 1]
    ]);
    expect(g.player).toBeInstanceOf(Player);
    expect(g.history).toEqual([]);
    expect(g.winPos).toEqual({ x: 3, y: 2 });
    expect(g.startPos).toEqual({ x: 0, y: 1 });
    expect(g.timer).toBeInstanceOf(Timer);
    expect(g.gameStatus).toMatch('');
    expect(g.resultTime).toBe(0);
    expect(g.result).toMatch('');
  });
});

describe('testing properties', () => {
  const g = new Game(...Object.values(DATA));

  test('field', () => {
    expect(g.field).toEqual([
      [1, '^@',   1, 1],
      [1,  '#', '#', 1],
      [1,    0, '#', 1],
      [1,    1, '$', 1]
    ]);
    expect(() => g.field = null).toThrowError(new Error(`Game.field.set(matrix) matrix must be Array`));
    expect(() => g.field = [null]).toThrowError(new Error(`Game.field.set(matrix) matrix must be 2D Array`));
    expect(() => g.field = [[null, NaN, '1', '0']]).toThrowError(new Error(`Game.field.set(matrix) matrix must be 2D Array where every element of it must be: 1 or 0 or '^@' or '#' or '$'`));
    expect(g.field = [[1, 0, 1], [1, 0, 1]]).toEqual([[1, 0, 1], [1, 0, 1]]);
  });

  test('player', () => {
    expect(g.player).toBeInstanceOf(Player);
    expect(() => g.player = null).toThrowError(new Error(`Cannot set property player of #<Game> which has only a getter`));
  });

  test('history', () => {
    expect(g.history).toEqual([]);
    expect(() => g.history = {}).toThrowError(new Error(`Game.history.set(arr) arr must be Array`));
    expect(g.history = [{}, {}]).toEqual([{}, {}]);
  });

  test('winPos', () => {
    expect(g.winPos).toEqual({ x: 3, y: 2 });
    expect(() => g.winPos = null).toThrowError(new Error(`Cannot set property winPos of #<Game> which has only a getter`));
  });

  test('startPos', () => {
    expect(g.startPos).toEqual({ x: 0, y: 1 });
    expect(() => g.startPos = null).toThrowError(new Error(`Cannot set property startPos of #<Game> which has only a getter`));
  });

  test('player', () => {
    expect(g.timer).toBeInstanceOf(Timer);
    expect(() => g.timer = null).toThrowError(new Error(`Cannot set property timer of #<Game> which has only a getter`));
  });

  test('gameStatus', () => {
    expect(g.gameStatus).toMatch('');
    expect(() => g.gameStatus = undefined).toThrowError(new Error(`Game.gameStatus.set(value) value must be String`));
    expect(() => g.gameStatus = 'undefined').toThrowError(new Error(`Game.gameStatus.set(value) value must be '' or 'start' or 'finish' or 'stop'`));
    expect(g.gameStatus = 'start').toMatch('start');
    expect(g.gameStatus = 'stop').toMatch('stop');
    expect(g.gameStatus = 'finish').toMatch('finish');
    expect(g.gameStatus = '').toMatch('');
  });

  test('resultTime', () => {
    expect(g.resultTime).toBe(0);
    expect(() => g.resultTime = []).toThrowError(new Error(`Game.resultTime.set(value) value must be positive Integer`));
    expect(() => g.resultTime = -1).toThrowError(new Error(`Game.resultTime.set(value) value must be positive Integer`));
    expect(g.resultTime = 250).toBe(250);
  });

  test('result', () => {
    expect(g.result).toMatch('');
    expect(() => g.result = undefined).toThrowError(new Error(`Game.result.set(value) value must be String`));
    expect(() => g.result = 'undefined').toThrowError(new Error(`Game.result.set(value) value must be '' or 'Lost' or 'Won'`));
    expect(g.result = 'Lost').toMatch('Lost');
    expect(g.result = 'Won').toMatch('Won');
    expect(g.result = '').toMatch('');
  });
});

describe('testing methods', () => {
  const g = new Game(...Object.values(DATA));

  test('log', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    expect(g.log).toBeUndefined();
    expect(console.log.mock.calls[0][0]).toEqual({
      WinPosition: {x: 3, y: 2},
      field: [[1, '^@', 1, 1], [1, '#', '#', 1], [1, 0, '#', 1], [1, 1, '$', 1]],
      gameStatus: '',
      history: [],
      playerX: 0,
      playerY: 1,
      result: '',
      resultTime: 0,
      timer: {}
    })
    spy.mockRestore();
  });

  test('checkWin()', () => {
    expect(() => g.checkWin(null, NaN)).toThrowError(new Error(`Game.cheakWin(x, y) x must be Integer`));
    expect(() => g.checkWin(1, NaN)).toThrowError(new Error(`Game.cheakWin(x, y) y must be Integer`));
    expect(g.checkWin(1, 1)).toBeFalsy();
    expect(g.checkWin(3, 2)).toBeTruthy();
  });

  test('moves()', () => {
    expect(() => g.moves(null)).toThrowError(new Error(`Game.moves(move) move must be String`));
    expect(() => g.moves('string')).toThrowError(new Error(`Game.moves(move) move must be 'W' or 'A' or 'S' or 'D'`));
    expect(g.history).toEqual([]);
    expect(g.field).toEqual([[1, '^@', 1, 1], [1, '#', '#', 1], [1, 0, '#', 1], [1, 1, '$', 1]]);

    expect(g.moves('S')).toBeUndefined();
    expect(g.history).toEqual(['S']);
    expect(g.field).toEqual([[1, '^', 1, 1], [1, '#@', '#', 1], [1, 0, '#', 1], [1, 1, '$', 1]]);

    expect(g.moves('W')).toBeUndefined();
    expect(g.history).toEqual(['S', 'W']);
    expect(g.field).toEqual([[1, '^@', 1, 1], [1, '#*', '#', 1], [1, 0, '#', 1], [1, 1, '$', 1]]);

    expect(g.moves('S')).toBeUndefined();
    expect(g.history).toEqual(['S', 'W', 'S']);
    expect(g.field).toEqual([[1, '^', 1, 1], [1, '#@', '#', 1], [1, 0, '#', 1], [1, 1, '$', 1]]);

    expect(g.moves('D')).toBeUndefined();
    expect(g.history).toEqual(['S', 'W', 'S', 'D']);
    expect(g.field).toEqual([[1, '^', 1, 1], [1, '#*', '#@', 1], [1, 0, '#', 1], [1, 1, '$', 1]]);

    expect(g.moves('A')).toBeUndefined();
    expect(g.history).toEqual(['S', 'W', 'S', 'D', 'A']);
    expect(g.field).toEqual([[1, '^', 1, 1], [1, '#@', '#*', 1], [1, 0, '#', 1], [1, 1, '$', 1]]);
    expect(g.clean()).toBeUndefined();
  });

  test('draw()', () => {
    expect(g.field).toEqual([
      [1, '^@',   1, 1],
      [1,  '#', '#', 1],
      [1,    0, '#', 1],
      [1,    1, '$', 1]
    ]);
    expect(() => g.draw(null, -1, 1.5, NaN)).toThrowError(new Error(`Game.draw(xPrev, yPrev, xCurrent, yCurrent) xPrev must be positive Integer`));
    expect(() => g.draw(0, -1, 1.5, NaN)).toThrowError(new Error(`Game.draw(xPrev, yPrev, xCurrent, yCurrent) yPrev must be positive Integer`));
    expect(() => g.draw(0, 0, 1.5, NaN)).toThrowError(new Error(`Game.draw(xPrev, yPrev, xCurrent, yCurrent) xPrev, yPrev must not point to 1 or undefined on field`));
    expect(() => g.draw(0, 1, 1.5, NaN)).toThrowError(new Error(`Game.draw(xPrev, yPrev, xCurrent, yCurrent) xCurrent must be positive Integer`));
    expect(() => g.draw(0, 1, 1, NaN)).toThrowError(new Error(`Game.draw(xPrev, yPrev, xCurrent, yCurrent) yCurrent must be positive Integer`));
    expect(() => g.draw(0, 1, 1, 10)).toThrowError(new Error(`Game.draw(xPrev, yPrev, xCurrent, yCurrent) xCurrent, yCurrent must not point to 1 or undefined on field`));
    expect(g.draw(0, 1, 0, 1)).toBeFalsy();
    expect(g.draw(0, 1, 1, 1)).toBeTruthy();
    expect(g.field).toEqual([[1, '^', 1, 1], [1, '#@', '#', 1], [1, 0, '#', 1], [1, 1, '$', 1]]);
    expect(g.draw(1, 1, 2, 1)).toBeTruthy();
    expect(g.field).toEqual([[1, '^', 1, 1], [1, '#*', '#', 1], [1, '@', '#', 1], [1, 1, '$', 1]]);
    expect(g.draw(2, 1, 2, 2)).toBeTruthy();
    expect(g.field).toEqual([[1, '^', 1, 1], [1, '#*', '#', 1], [1, '*', '#@', 1], [1, 1, '$', 1]]);
    expect(g.draw(2, 2, 3, 2)).toBeTruthy();
    expect(g.field).toEqual([[1, '^', 1, 1], [1, '#*', '#', 1], [1, '*', '#*', 1], [1, 1, '$@', 1]]);
  });

  test('clean()', () => {
    g.history.push('S', 'W', 'A', 'D');
    expect(g.history).toEqual(['S', 'W', 'A', 'D']);
    expect(g.field ).toEqual([
      [1, '^', 1, 1], [1, '#*', '#', 1], [1, '*', '#*', 1], [1, 1, '$@', 1]
    ]);
    expect(g.gameStatus = 'finish').toMatch('finish');
    expect(g.resultTime = 10_000).toBe(10_000);
    expect(g.result = 'Won').toMatch('Won');
    expect(g.clean()).toBeUndefined();
    expect(g.field).toEqual([
      [1, '^@',   1, 1],
      [1,  '#', '#', 1],
      [1,    0, '#', 1],
      [1,    1, '$', 1]
    ]);
    expect(g.history).toEqual([]);
    expect(g.gameStatus).toMatch('');
    expect(g.resultTime).toBe(0);
    expect(g.result).toMatch('');
  });

  test('startGame()', () => {
    expect(g.startGame()).toBeUndefined();
    expect(g.gameStatus).toMatch('start');
    g.timer.stop();
  }); 

  test('stopGame()', () => {
    expect(g.stopGame()).toBeUndefined();
    expect(g.gameStatus).toMatch('stop');
  });

  test('gameFinished()', () => {
    expect(() => g.gameFinished([])).toThrowError(new Error(`Game.gameFinished(str) str must be String`));
    expect(() => g.gameFinished('string')).toThrowError(new Error(`Game.gameFinished(str) str must be 'Won' or 'Lost'`));
    expect(g.gameFinished('Won')).toBeUndefined();
    expect(g.gameStatus).toMatch('finish');
    expect(g.result).toMatch('Won');
    expect(g.startGame()).toBeUndefined();
    expect(g.gameFinished('Lost')).toBeUndefined();
    expect(g.gameStatus).toMatch('finish');
    expect(g.result).toMatch('Lost');
  });
});
