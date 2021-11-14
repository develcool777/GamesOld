import { expect } from '@jest/globals';
import Cell from '../../src/model/chess/cell';
import Rook from '../../src/model/chess/figures/rook';

describe('creating instance of Cell', () => {
  test('instance of class Cell', () => {
    expect(() => new Cell(null, null)).toThrowError(new Error(`Cell.constructor color must be String`));
    expect(() => new Cell('null', null)).toThrowError(new Error(`Cell.constructor color must be 'white' or 'black'`));
    expect(() => new Cell('white', null)).toThrowError(new Error(`Cell.constructor position must be Object`));
    expect(() => new Cell('white', [])).toThrowError(new Error(`Cell.constructor position must be Object`));
    expect(() => new Cell('white', {})).toThrowError(new Error(`Cell.constructor position must be Object with keys x and y`));
    expect(new Cell('white', {x: 0, y: 1})).toBeInstanceOf(Cell);
  });

  test('properties of class Cell', () => {
    expect(Object.getOwnPropertyNames(new Cell('white', {x: 0, y: 1}))).toEqual([
      'color', 'figure', 'position', 'isAvailableFor', 'isSelected', 'showsPosition'
    ]);
  });

  test('properties values of class Cell', () => {
    const c = new Cell('white', {x: 0, y: 1});
    expect(c.color).toMatch('white');
    expect(c.position).toEqual({x: 0, y: 1});
    expect(c.showsPosition).toMatch('');
    expect(c.isAvailableFor).toMatch('');
    expect(c.isSelected).toBeFalsy();
    expect(c.figure).toBeNull();
  });
});

describe('testing properties', () => {
  const c = new Cell('white', {x: 0, y: 1});

  test('color', () => {
    expect(c.color).toMatch('white');
    expect(() => c.color = 'black').toThrowError(new Error(`Cannot set property color of #<Cell> which has only a getter`));
  });

  test('position', () => {
    expect(c.position).toEqual({x: 0, y: 1});
    expect(() => c.position = {x: 0, y: 2}).toThrowError(new Error(`Cannot set property position of #<Cell> which has only a getter`));
  });

  test('isAvailableFor', () => {
    expect(c.isAvailableFor).toMatch('');
    expect(() => c.isAvailableFor = null).toThrowError(new Error(`Cell.isAvailableFor.set(value) value must be String`));
    expect(() => c.isAvailableFor = 'null').toThrowError(new Error(`Cell.isAvailableFor.set(value) value must be '' or 'move' or 'kill' or 'castle' or 'promotion' or 'check' or 'checkMate' or 'wayToKing' or 'enPassant'`));
    expect(c.isAvailableFor = 'move').toMatch('move');
    expect(c.isAvailableFor = 'kill').toMatch('kill');
    expect(c.isAvailableFor = 'castle').toMatch('castle');
    expect(c.isAvailableFor = 'promotion').toMatch('promotion');
    expect(c.isAvailableFor = 'check').toMatch('check');
    expect(c.isAvailableFor = 'checkMate').toMatch('checkMate');
    expect(c.isAvailableFor = 'wayToKing').toMatch('wayToKing');
    expect(c.isAvailableFor = 'enPassant').toMatch('enPassant');
  });

  test('showsPosition', () => {
    expect(c.showsPosition).toMatch('');
    expect(() => c.showsPosition = null).toThrowError(new Error(`Cell.showsPosition.set(value) value must be String`));
    expect(() => c.showsPosition = 'null').toThrowError(new Error(`Cell.showsPosition.set(value) value must be '' or 'oldPosition' or 'newPosition'`));
    expect(c.showsPosition = 'oldPosition').toMatch('oldPosition');
    expect(c.showsPosition = 'newPosition').toMatch('newPosition');
  });

  test('isSelected', () => {
    expect(c.isSelected).toBeFalsy();
    expect(() => c.isSelected = null).toThrowError(new Error(`Cell.isSelected.set(value) value must be Boolean`));
    expect(c.isSelected = true).toBeTruthy();
  })

  test('figure', () => {
    expect(c.figure).toBeNull();
    expect(c.figure = new Rook('white', {x: 0, y: 1}, 'up')).toBeInstanceOf(Rook);
  })
});