import { expect } from '@jest/globals';
import { Board, minMax } from '../../src/model/ticTacToe/minMaxAlgorithm';

describe('creating instance of minMax', () => {
  const m = new minMax(); 

  test('instance of class minMax', () => {
    expect(() => new minMax([])).toThrowError(new Error(`minMax.constructor(maxDepth) maxDepth must be Integer`));
    expect(new minMax()).toBeInstanceOf(minMax);
    expect(new minMax(-1)).toBeInstanceOf(minMax);
  });

  test('properties of class minMax', () => {
    expect(Object.getOwnPropertyNames(new minMax)).toEqual(['maxDepth', 'nodesMap']);
  });

  test('properties values of class minMax', () => {
    expect(m.maxDepth).toBe(-1);
    expect(m.nodesMap).toBeInstanceOf(Map);
  });
});

describe('test methods', () => {
  const m = new minMax();

  test('getBestMove()', () => {
    const b = new Board();
    expect(b.state = ['x', '', 'x', '', 'o', '', '', '', '']).toEqual(['x', '', 'x', '', 'o', '', '', '', '']);
    expect(() => m.getBestMove([])).toThrowError(new Error(`minMax.getBestMove(board, maximizing = true, callback = () => {}, depth = 0) board must be instance of Board`));
    expect(() => m.getBestMove(b, {})).toThrowError(new Error(`minMax.getBestMove(board, maximizing = true, callback = () => {}, depth = 0) maximizing must be Boolean`));
    expect(() => m.getBestMove(b, true, null)).toThrowError(new Error(`minMax.getBestMove(board, maximizing = true, callback = () => {}, depth = 0) callback must be Function`));
    expect(() => m.getBestMove(b, true, () => {}, 1.5)).toThrowError(new Error(`minMax.getBestMove(board, maximizing = true, callback = () => {}, depth = 0) depth must be Integer`));
    expect(m.getBestMove(b, false)).toBe(1);
    expect(b.state = ['x', 'o', 'x', '', 'o', '', 'o', '', 'x']).toEqual(['x', 'o', 'x', '', 'o', '', 'o', '', 'x']);
    expect(m.getBestMove(b, true)).toBe(5);
  });
});
