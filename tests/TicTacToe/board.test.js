import { expect } from '@jest/globals';
import { Board } from "../../src/model/ticTacToe/minMaxAlgorithm";

describe('creating instance of Board', () => {
  const b = new Board(); 

  test('instance of class Board', () => {
    expect(new Board()).toBeInstanceOf(Board);
    expect(() => new Board('string')).toThrowError(new Error(`Board.constructor(state) state must be Array`));
    expect(() => new Board(['string'])).toThrowError(new Error(`Board.constructor(state) state length must be 9`));
    expect(() => new Board([[], 12, 12.77, {}, 'str', () => {}, null, 'str', 'str'])).toThrowError(new Error(`Board.constructor(state) every element of state must be String`));
    expect(() => new Board(['str', 'str', 'str', 'str', 'str', 'str', 'str', 'str', 'str'])).toThrowError(new Error(`Board.constructor(state) every element of state must be '' or 'x' or 'o'`));
    expect(new Board(['', '', 'x', 'o', 'x', '', '', 'o', 'x'])).toBeInstanceOf(Board);
  });

  test('properties of class Board', () => {
    expect(Object.getOwnPropertyNames(new Board)).toEqual(['state']);
  });

  test('properties values of class Board', () => {
    expect(b.state).toEqual(['', '', '', '', '', '', '', '', '']);
  });
});

describe('testing methods', () => {
  const b = new Board();

  test('isEmpty()', () => {
    expect(b.isEmpty()).toBeTruthy();
    expect(b.state = ['', '', 'o', '', 'x', '', '', '', '']).toEqual(['', '', 'o', '', 'x', '', '', '', '']);
    expect(b.isEmpty()).toBeFalsy();
  });

  test('isFull()', () => {
    expect(b.isFull()).toBeFalsy();
    expect(b.state = ['x', 'x', 'o', 'o', 'x', 'x', 'o', 'o', 'x']).toEqual(['x', 'x', 'o', 'o', 'x', 'x', 'o', 'o', 'x']);
    expect(b.isFull()).toBeTruthy();
    expect(b.state = ['', '', '', '', '', '', '', '', '']).toEqual(['', '', '', '', '', '', '', '', '']);
  });

  test('insert()', () => {
    expect(() => b.insert([], {})).toThrowError(new Error(`Board.insert(symbol, position) symbol can only be x or o!`));
    expect(() => b.insert('x', {})).toThrowError(new Error(`Board.insert(symbol, position) position must be Integer`));  
    expect(() => b.insert('x', 10)).toThrowError(new Error(`Board.insert(symbol, position) position must be in range(0, 8)`)); 
    expect(b.insert('x', 0)).toBeTruthy();
    expect(b.insert('x', 0)).toBeFalsy();
    expect(b.state).toEqual(['x', '', '', '', '', '', '', '', '']);
  });

  test('getAvailableMoves()', () => {
    expect(b.getAvailableMoves()).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(b.state = ['x', 'o', 'x', '', '', '', '', '', '']).toEqual(['x', 'o', 'x', '', '', '', '', '', '']);
    expect(b.getAvailableMoves()).toEqual([3, 4, 5, 6, 7, 8]);
    expect(b.state = ['', '', '', '', '', '', '', '', '']).toEqual(['', '', '', '', '', '', '', '', '']);
    expect(b.getAvailableMoves()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  test('isTerminal()', () => {
    // board is empty
    expect(b.isTerminal()).toBeFalsy();

    // checked but there no winner or draw
    expect(b.state = ['x', 'o', 'x', '', '', '', '', '', '']).toEqual(['x', 'o', 'x', '', '', '', '', '', '']);
    expect(b.isTerminal()).toBeFalsy();

    // horisontaly 1
    expect(b.state = ['x', 'x', 'x', 'o', 'x', '', '', '', '']).toEqual(['x', 'x', 'x', 'o', 'x', '', '', '', '']);
    expect(b.isTerminal()).toEqual({direction: 'H', row: 1, winner: 'x'});

    // horisontaly 2
    expect(b.state = ['x', 'o', 'o', 'x', 'x', 'x', '', '', '']).toEqual(['x', 'o', 'o', 'x', 'x', 'x', '', '', '']);
    expect(b.isTerminal()).toEqual({direction: 'H', row: 2, winner: 'x'});

    // horisontaly 3
    expect(b.state = ['x', 'o', 'o', 'o', 'x', 'o', 'x', 'x', 'x']).toEqual(['x', 'o', 'o', 'o', 'x', 'o', 'x', 'x', 'x']);
    expect(b.isTerminal()).toEqual({direction: 'H', row: 3, winner: 'x'});

    // vertically 1
    expect(b.state = ['x', '', '', 'x', '', 'o', 'x', 'o', '']).toEqual(['x', '', '', 'x', '', 'o', 'x', 'o', '']);
    expect(b.isTerminal()).toEqual({column: 1, direction: 'V', winner: 'x'});

    // vertically 2
    expect(b.state = ['o', 'o', '', 'x', 'o', 'o', 'x', 'o', '']).toEqual(['o', 'o', '', 'x', 'o', 'o', 'x', 'o', '']);
    expect(b.isTerminal()).toEqual({column: 2, direction: 'V', winner: 'o'});

    // vertically 3
    expect(b.state = ['o', 'x', 'x', 'x', 'o', 'x', 'x', 'o', 'x']).toEqual(['o', 'x', 'x', 'x', 'o', 'x', 'x', 'o', 'x']);
    expect(b.isTerminal()).toEqual({column: 3, direction: 'V', winner: 'x'});

    // diagonal \
    expect(b.state = ['x', '', 'o', '', 'x', '', 'o', '', 'x']).toEqual(['x', '', 'o', '', 'x', '', 'o', '', 'x']);
    expect(b.isTerminal()).toEqual({diagonal: 'main', direction: 'D', winner: 'x'});

    // diagonal /
    expect(b.state = ['x', '', 'o', '', 'o', '', 'o', '', 'x']).toEqual(['x', '', 'o', '', 'o', '', 'o', '', 'x']);
    expect(b.isTerminal()).toEqual({diagonal: 'counter', direction: 'D', winner: 'o'});

    // draw
    expect(b.state = ['x', 'o', 'x', 'o', 'x', 'x', 'o', 'x', 'o']).toEqual(['x', 'o', 'x', 'o', 'x', 'x', 'o', 'x', 'o']);
    expect(b.isTerminal()).toEqual({winner: 'draw'});
  })
});
