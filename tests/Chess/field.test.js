import { expect } from '@jest/globals';
import Field from '../../src/model/chess/field';

describe('creating instance of Field', () => {
  test('instance of class Field', () => {
    expect(new Field()).toBeInstanceOf(Field);
  });

  test('properties of class Field', () => {
    expect(Object.getOwnPropertyNames(new Field())).toEqual([
      'board', 'isBoardFlipped', 'historyIndex', 'historyOfMoves',
    ]);
  });

  test('properties values of class Field', () => {
    const f = new Field();
    expect(f.board).toEqual([]);
    expect(f.isBoardFlipped).toBeFalsy();
    expect(f.historyIndex).toBe(0);
    expect(f.historyOfMoves).toEqual([]);
  });
});

describe('testing properties', () => {
  const f = new Field();

  test('board', () => {
    expect(f.board).toEqual([]);
    expect(() => f.board = null).toThrowError(new Error(`Field.board.set(value) value must be Array`));
    expect(() => f.board = [null]).toThrowError(new Error(`Field.board.set(value) value must be 2D Array`));
    expect(() => f.board = [[null]]).toThrowError(new Error(`Field.board.set(value) every element of value must be instance of Cell`));
    f.createBoard();
    expect(f.board).toMatchSnapshot()
  });

  test('isBoardFlipped', () => {
    expect(f.isBoardFlipped).toBeFalsy();
    expect(() => f.isBoardFlipped = null).toThrowError(new Error(`Field.isBoardFlipped.set(value) value must be Boolean`));
    expect(f.isBoardFlipped = true).toBeTruthy();
  });

  test('historyOfMoves', () => {
    expect(f.historyOfMoves).toEqual([]);
    expect(() => f.historyOfMoves = null).toThrowError(new Error(`Cannot set property historyOfMoves of #<Field> which has only a getter`));
  });

  test('historyIndex', () => {
    expect(f.historyIndex).toBe(0);
    expect(() => f.historyIndex = null).toThrowError(new Error(`Field.historyIndex.set(value) value must be Integer`));
  });
});

describe('testing methods', () => {
  const f = new Field();

  test('createBoard()', () => {
    expect(f.board).toEqual([]);
    expect(f.createBoard()).toBeUndefined();
    expect(f.board).toMatchSnapshot();
  });

  test('clearBoard()', () => {
    f.board.splice(0);
    expect(f.board).toEqual([]);
    expect(() => f.clearBoard()).toThrowError(new Error(`Field.clearBoard() board is empty`));
  });
  // ToDo tests :(
});