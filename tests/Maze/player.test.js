import { expect, jest } from '@jest/globals';
import Player from '../../src/model/maze/player';

describe('creating instance of Player', () => {
  test('instance of class Player', () => {
    expect(() => new Player([], {})).toThrowError(new Error(`Player.constructor x must be positive Integer`));
    expect(() => new Player(1, -1)).toThrowError(new Error(`Player.constructor y must be positive Integer`));
    expect(new Player(1, 0)).toBeInstanceOf(Player);
  });

  test('properties of class Player', () => {
    expect(Object.getOwnPropertyNames(new Player(0, 0))).toEqual(['x', 'y']);
  });

  test('properties values of class Player', () => {
    const p = new Player(1, 1);
    expect(p.x).toBe(1);
    expect(p.y).toBe(1);
  });
});

describe('testing properties', () => {
  const p = new Player(1, 1);

  test('x', () => {
    expect(p.x).toBe(1);
    expect(() => p.x = []).toThrowError(new Error(`Player.x.set() value must be positive Integer`));
    expect(p.x = 0).toBe(0);
  });

  test('y', () => {
    expect(p.y).toBe(1);
    expect(() => p.y = []).toThrowError(new Error(`Player.y.set() value must be positive Integer`));
    expect(p.y = 0).toBe(0);
  });
});

describe('testing methods', () => {
  const p = new Player(1, 1);

  test('log', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    expect(p.log).toBeUndefined();
    expect(console.log.mock.calls[0][0]).toEqual({x: 1, y: 1});
    spy.mockRestore();
  });

  test('getPosition()', () => {
    expect(p.getPosition()).toEqual[1, 1];
  });

  test('moveRight()', () => {
    expect(p.moveRight()).toBeUndefined();
    expect(p.y).toBe(2);
    expect(p.getPosition()).toEqual[1, 2];
  });

  test('moveLeft()', () => {
    expect(p.moveLeft()).toBeUndefined();
    expect(p.y).toBe(1);
    expect(p.getPosition()).toEqual[1, 1];
  });

  test('moveUp()', () => {
    expect(p.moveUp()).toBeUndefined();
    expect(p.x).toBe(0);
    expect(p.getPosition()).toEqual[0, 1];
  });

  test('moveDown()', () => {
    expect(p.moveDown()).toBeUndefined();
    expect(p.x).toBe(1);
    expect(p.getPosition()).toEqual[1, 1];
  });
});