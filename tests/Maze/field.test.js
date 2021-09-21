import { expect, jest } from '@jest/globals';
import Field from '../../src/model/maze/field';
import firebase from "firebase/app";
import firebaseConfig from '../../firebase.json';
firebase.initializeApp(firebaseConfig.config);
import "firebase/firestore";
const DATA = [];

beforeAll(async () => {
  const db = firebase.firestore();
  const collection = await db.collection('Maze_levels').get();
  collection.docs.forEach(doc => {
    const data = doc.data();
    data.field = data.field.map(obj => Object.values(obj).pop());
    data.level = +doc.id
    DATA.push(data)
  });
})

test('Data', async () => {
  expect(DATA).toMatchSnapshot();
});

describe('creating instance of Field', () => {
  test('instance of class Field', () => {
    expect(new Field(DATA)).toBeInstanceOf(Field);
    expect(() => new Field('very big data')).toThrowError(new Error(`Field.constructor data must be Array`));
    expect(() => new Field([null, undefined, '', []])).toThrowError(new Error(`Field.constructor every element of data must be Object`));
    expect(() => new Field([{}, {id: 0}])).toThrowError(new Error(`Field.constructor every element of data must be Object with keys: 'time', 'level', 'field', 'winPath', 'startPosition', 'endPosition'`));
    
    expect(() => new Field([{time: 'dsfd', level: ['1'], field: 'something', winPath:1, startPosition: 1.5, endPosition: 4.5}])).toThrowError(new Error(`Field.constructor every time and level must be Integer and greater than 0`));

    expect(() => new Field([{time: 15_000, level: 1, field: 'something', winPath:1, startPosition: 1.5, endPosition: 4.5}])).toThrowError(new Error(`Field.constructor every field must be Array`));
    expect(() => new Field([{time: 15_000, level: 1, field: ['something'], winPath:1, startPosition: 1.5, endPosition: 4.5}])).toThrowError(new Error(`Field.constructor every field must be 2D Array`));
    expect(() => new Field([{time: 15_000, level: 1, field: [[86756], [2], ['sd']], winPath:1, startPosition: 1.5, endPosition: 4.5}])).toThrowError(new Error(`Field.constructor every field must be 2D Array where every element of it must be: 1 or 0`));

    expect(() => new Field([{time: 15_000, level: 1, field: [[1, 0, 1], [1, 0, 1], [1, 0, 1]], winPath:1, startPosition: null, endPosition: 4.5}])).toThrowError(new Error(`Field.constructor every startPosition must be Object`));
    expect(() => new Field([{time: 15_000, level: 1, field: [[1, 0, 1], [1, 0, 1], [1, 0, 1]], winPath:1, startPosition: {}, endPosition: 4.5}])).toThrowError(new Error(`Field.constructor every startPosition must be Object with keys: 'x', 'y'`));
    expect(() => new Field([{time: 15_000, level: 1, field: [[1, 0, 1], [1, 0, 1], [1, 0, 1]], winPath:1, startPosition: {x: [], y: null}, endPosition: 4.5}])).toThrowError(new Error(`Field.constructor every startPosition must have Integer value on keys: 'x', 'y'`));
    expect(() => new Field([{time: 15_000, level: 1, field: [[1, 0, 1], [1, 0, 1], [1, 0, 1]], winPath:1, startPosition: {x: 0, y: 0}, endPosition: 4.5}])).toThrowError(new Error(`Field.constructor every startPosition must point to a 0 on field`));

    expect(() => new Field([{time: 15_000, level: 1, field: [[1, 0, 1], [1, 0, 1], [1, 0, 1]], winPath:1, startPosition: {x: 0, y: 1}, endPosition: null}])).toThrowError(new Error(`Field.constructor every endPosition must be Object`));
    expect(() => new Field([{time: 15_000, level: 1, field: [[1, 0, 1], [1, 0, 1], [1, 0, 1]], winPath:1, startPosition: {x: 0, y: 1}, endPosition: {}}])).toThrowError(new Error(`Field.constructor every endPosition must be Object with keys: 'x', 'y'`));
    expect(() => new Field([{time: 15_000, level: 1, field: [[1, 0, 1], [1, 0, 1], [1, 0, 1]], winPath:1, startPosition: {x: 0, y: 1}, endPosition: {x: [], y: null}}])).toThrowError(new Error(`Field.constructor every endPosition must have Integer value on keys: 'x', 'y'`));
    expect(() => new Field([{time: 15_000, level: 1, field: [[1, 0, 1], [1, 0, 1], [1, 0, 1]], winPath:1, startPosition: {x: 0, y: 1}, endPosition: {x: 0, y: 0}}])).toThrowError(new Error(`Field.constructor every endPosition must point to a 0 on field`));

    expect(() => new Field([{time: 15_000, level: 1, field: [[1, 0, 1], [1, 0, 1], [1, 0, 1]], winPath:1, startPosition: {x: 0, y: 1}, endPosition: {x: 2, y: 1}}])).toThrowError(new Error(`Field.constructor every winPath must be Array`));
    expect(() => new Field([{time: 15_000, level: 1, field: [[1, 0, 1], [1, 0, 1], [1, 0, 1]], winPath:[null, undefined, []], startPosition: {x: 0, y: 1}, endPosition: {x: 2, y: 1}}])).toThrowError(new Error(`Field.constructor every winPath element must be Object`));
    expect(() => new Field([{time: 15_000, level: 1, field: [[1, 0, 1], [1, 0, 1], [1, 0, 1]], winPath:[{}, {id:0}], startPosition: {x: 0, y: 1}, endPosition: {x: 2, y: 1}}])).toThrowError(new Error(`Field.constructor every winPath element must be Object with keys: 'x', 'y'`));
    expect(() => new Field([{time: 15_000, level: 1, field: [[1, 0, 1], [1, 0, 1], [1, 0, 1]], winPath:[{x:null, y: ''}], startPosition: {x: 0, y: 1}, endPosition: {x: 2, y: 1}}])).toThrowError(new Error(`Field.constructor every winPath element must have Integer value on keys: 'x', 'y'`));
    expect(() => new Field([{time: 15_000, level: 1, field: [[1, 0, 1], [1, 0, 1], [1, 0, 1]], winPath:[{x:0, y: 1}, {x:1, y: 1}, {x:2, y: 0}], startPosition: {x: 0, y: 1}, endPosition: {x: 2, y: 1}}])).toThrowError(new Error(`Field.constructor every winPath must store path from startPosition to endPosition`));
  });

  test('properties of class Field', () => {
    expect(Object.getOwnPropertyNames(new Field(DATA))).toEqual(['data', 'level']);
  });

  test('properties values of class Field', () => {
    const f = new Field(DATA);
    expect(f.level).toBe(1);
    expect(f.data).toMatchSnapshot();
  });
});

describe('testing properties', () => {
  const f = new Field(DATA);

  test('level', () => {
    expect(f.level).toBe(1);
    expect(() => f.level = 'string').toThrowError(new Error(`Field level.set() value must be Integer`));
    expect(f.level = 2).toBe(2);
  });

  test('data', () => {
    expect(f.data).toMatchSnapshot();
    expect(() => f.data = 'string').toThrowError(new Error(`Cannot set property data of #<Field> which has only a getter`));
  });
});

describe('testing methods', () => {
  const f = new Field(DATA);

  test('log', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    expect(f.log).toBeUndefined();
    expect(console.log.mock.calls[0][0]).toMatchSnapshot();
    spy.mockRestore()
  });

  test('render()', () => {
    expect(() => f.render('str', {}, null)).toThrowError(new Error(`Field.render(gameField, isPath, isHint) gameField must be Array`));
    expect(() => f.render(['str'], {}, null)).toThrowError(new Error(`Field.render(gameField, isPath, isHint) gameField must be 2D Array`));
    expect(() => f.render([['str']], {}, null)).toThrowError(new Error(`Field.render(gameField, isPath, isHint) gameField every element must be: 1, 0, '*', '$', '@', '#', '^', '^@', '$@', '#@', '#*'`));
    const gameField = [
     [1,  '^',    0,  1],
     [1, '#*', '#@',  1],
     [1,  '*',  '#',  1],
     [1,  '$',  '#',  1]
    ];
    const gameField2 = [
      [1, '^@',   0,   1],
      [1,  '#',  '#',  1],
      [1,  '*',  '#',  1],
      [1,  '$',  '#',  1]
    ];
    const gameField3 = [
      [1,  '@',   0,   1],
      [1,  '#',  '#',  1],
      [1,  '*',  '#',  1],
      [1, '$@',  '#',  1]
     ];
    expect(() => f.render(gameField, {}, null)).toThrowError(new Error(`Field.render(gameField, isPath, isHint) isPath must be Boolean`));
    expect(() => f.render(gameField, false, null)).toThrowError(new Error(`Field.render(gameField, isPath, isHint) isHint must be Boolean`));
    expect(f.render(gameField, false, false)).toMatchSnapshot();
    expect(f.render(gameField2, true, false)).toMatchSnapshot();
    expect(f.render(gameField3, false, true)).toMatchSnapshot();
    expect(f.render(gameField, true, true)).toMatchSnapshot();
  });

  test('dataForGame()', () => {
    expect(f.level).toBe(1);
    expect(f.dataForGame()).toEqual([
      [
        [1, 1, 1, 1, 1, 1],
        [1, '^@', 1, '#', '#', '$'],
        [1, '#', 1, '#', 1, 1],
        [1, '#', '#', '#', 0, 1],
        [1, 1, 1, 1, 0, 1],
        [1, 1, 1, 1, 1, 1]
      ], 
      {x: 1, y: 1}, 
      {x: 1, y: 5}, 
      15000
    ]);
    expect(f.level = 2).toBe(2);
    expect(f.dataForGame()).toMatchSnapshot();
    expect(f.level = 3).toBe(3);
    expect(f.dataForGame()).toMatchSnapshot();
    expect(f.level = 4).toBe(4);
    expect(f.dataForGame()).toMatchSnapshot();
    expect(f.level = 1).toBe(1);
  });

  test('dataForCurrentLevel()', () => {
    expect(f.level).toBe(1);
    expect(f.dataForCurrentLevel()).toMatchSnapshot();
    expect(f.level = 2).toBe(2);
    expect(f.dataForCurrentLevel()).toMatchSnapshot();
    expect(f.level = 3).toBe(3);
    expect(f.dataForCurrentLevel()).toMatchSnapshot();
    expect(f.level = 4).toBe(4);
    expect(f.dataForCurrentLevel()).toMatchSnapshot();
    expect(f.level = 1).toBe(1);
  });

  test('changeLevel()', () => {
    expect(f.level).toBe(1);
    expect(() => f.changeLevel('string')).toThrowError(new Error(`Field.changeLevel(value) value must be Integer`));
    expect(() => f.changeLevel(5)).toThrowError(new Error(`Field.changeLevel(value) value must be 1 or -1`));
    expect(f.changeLevel(-1)).toBeFalsy();
    expect(f.changeLevel(1)).toBeTruthy();
    expect(f.changeLevel(-1)).toBeTruthy();
    expect(f.level).toBe(1);
  });

  test('amountOfLevels()', () => {
    expect(f.amountOfLevels()).toBe(4);
  });
});