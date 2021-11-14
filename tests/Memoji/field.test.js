import { expect } from '@jest/globals';
import Field from '../../src/model/memoji/field';
import { fireStore } from '../../src/firebase';
import { collection, getDocs } from "firebase/firestore";
const DATA = [];

test('fetch Data', async () => {
  const reference = collection(fireStore, 'Memoji_levels');
  const levels = await getDocs(reference);
  levels.docs.forEach(doc => {
    const data = doc.data();
    data.level = +doc.id;
    DATA.push(data)
  })
  expect(DATA).toEqual([
    {"cards": ["dog", "lion"], "level": 1, "time": 10000},
    {"cards": ["dog", "lion", "mouse", "hamster", "tiger", "fox-face"], "level": 2, "time": 30000},
    {"cards": ["poop", "smiling-imp", "alien", "skull", "japanese-goblin", "new-moon-with-face", "gorilla", "ghost"], "level": 3, "time": 60000},
    {"cards": ["apple", "pizza", "bacon", "pancakes", "tangerine", "avocado", "watermelon", "strawberry", "pineapple", "hamburger"], "level": 4, "time": 120000},
    {"cards": ["desktop-computer", "keyboard", "telephone-receiver", "video-game", "headphones", "microphone", "printer", "camera-flash", "camera", "computer", "pager", "iphone", "tv", "radio"], "level": 5, "time": 180000}
  ]);
});

describe('creating instance of Field', () => {
  const f = new Field(DATA);

  test('instance of class Field', () => {
    expect(new Field(DATA)).toBeInstanceOf(Field);
    expect(() => new Field('very big data')).toThrowError(new Error(`Field.constructor data must be Array`));
    expect(() => new Field([null, 24356, {}])).toThrowError(new Error(`Field.constructor every element of data must be Object`));
    expect(() => new Field([{h: 'f'}, {id: 4}, {}])).toThrowError(new Error(`Field.constructor every element of data must be Object with props: 'time', 'level', 'cards'`));
    expect(() => new Field([{time: 'dsfd', cards: {}, level: ['1']}])).toThrowError(new Error(`Field.constructor every time and level must be Integer and greater than 0`));
    expect(() => new Field([{time: 10, cards: {card: '1'}, level: 1}])).toThrowError(new Error(`Field.constructor every cards must be Array`));
    expect(() => new Field([{time: 10, cards: [{}, 23465, 23.456, 'string'], level: 1}])).toThrowError(new Error(`Field.constructor every cards item must be String`));
  });

  test('properties of class Field', () => {
    expect(Object.getOwnPropertyNames(new Field(DATA))).toEqual(['data', 'level']);
  });

  test('properties values of class Field', () => {
    expect(f.level).toBe(1);
    expect(f.data).toEqual([
      {"cards": ["dog", "lion"], "level": 1, "time": 10000},
      {"cards": ["dog", "lion", "mouse", "hamster", "tiger", "fox-face"], "level": 2, "time": 30000},
      {"cards": ["poop", "smiling-imp", "alien", "skull", "japanese-goblin", "new-moon-with-face", "gorilla", "ghost"], "level": 3, "time": 60000},
      {"cards": ["apple", "pizza", "bacon", "pancakes", "tangerine", "avocado", "watermelon", "strawberry", "pineapple", "hamburger"], "level": 4, "time": 120000},
      {"cards": ["desktop-computer", "keyboard", "telephone-receiver", "video-game", "headphones", "microphone", "printer", "camera-flash", "camera", "computer", "pager", "iphone", "tv", "radio"], "level": 5, "time": 180000}
    ]);
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
    expect(f.data).toEqual([
      {"cards": ["dog", "lion"], "level": 1, "time": 10000},
      {"cards": ["dog", "lion", "mouse", "hamster", "tiger", "fox-face"], "level": 2, "time": 30000},
      {"cards": ["poop", "smiling-imp", "alien", "skull", "japanese-goblin", "new-moon-with-face", "gorilla", "ghost"], "level": 3, "time": 60000},
      {"cards": ["apple", "pizza", "bacon", "pancakes", "tangerine", "avocado", "watermelon", "strawberry", "pineapple", "hamburger"], "level": 4, "time": 120000},
      {"cards": ["desktop-computer", "keyboard", "telephone-receiver", "video-game", "headphones", "microphone", "printer", "camera-flash", "camera", "computer", "pager", "iphone", "tv", "radio"], "level": 5, "time": 180000}
    ]);
    expect(() => f.data = 'string').toThrowError(new Error(`Cannot set property data of #<Field> which has only a getter`));
  });
});

describe('testing methods', () => {
  const f = new Field(DATA);

  test('log', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    expect(f.log).toBeUndefined();
    expect(console.log.mock.calls[0][0]).toEqual({ 
      CurrentLevel: 1,
      data: [
        {"cards": ["dog", "lion"], "level": 1, "time": 10000},
        {"cards": ["dog", "lion", "mouse", "hamster", "tiger", "fox-face"], "level": 2, "time": 30000},
        {"cards": ["poop", "smiling-imp", "alien", "skull", "japanese-goblin", "new-moon-with-face", "gorilla", "ghost"], "level": 3, "time": 60000},
        {"cards": ["apple", "pizza", "bacon", "pancakes", "tangerine", "avocado", "watermelon", "strawberry", "pineapple", "hamburger"], "level": 4, "time": 120000},
        {"cards": ["desktop-computer", "keyboard", "telephone-receiver", "video-game", "headphones", "microphone", "printer", "camera-flash", "camera", "computer", "pager", "iphone", "tv", "radio"], "level": 5, "time": 180000}
      ],
    });
    spy.mockRestore();
  });

  test('getCardsForGame()', () => {
    expect(f.level).toBe(1);
    expect(f.getCardsForGame()).toEqual(["dog", "lion"]);
    expect(f.level = 2).toBe(2);
    expect(f.getCardsForGame()).toEqual(["dog", "lion", "mouse", "hamster", "tiger", "fox-face"]);    
    expect(f.level = 3).toBe(3);
    expect(f.getCardsForGame()).toEqual(["poop", "smiling-imp", "alien", "skull", "japanese-goblin", "new-moon-with-face", "gorilla", "ghost"]);  
    expect(f.level = 4).toBe(4);
    expect(f.getCardsForGame()).toEqual(["apple", "pizza", "bacon", "pancakes", "tangerine", "avocado", "watermelon", "strawberry", "pineapple", "hamburger"]);  
    expect(f.level = 5).toBe(5);
    expect(f.getCardsForGame()).toEqual(["desktop-computer", "keyboard", "telephone-receiver", "video-game", "headphones", "microphone", "printer", "camera-flash", "camera", "computer", "pager", "iphone", "tv", "radio"]);  
    expect(f.level = 1).toBe(1);
  });

  test('time()', () => {
    expect(f.level).toBe(1);
    expect(f.time()).toBe(10_000);
    expect(f.level = 2).toBe(2);
    expect(f.time()).toBe(30_000);    
    expect(f.level = 3).toBe(3);
    expect(f.time()).toBe(60_000);  
    expect(f.level = 4).toBe(4);
    expect(f.time()).toBe(120_000);  
    expect(f.level = 5).toBe(5);
    expect(f.time()).toBe(180_000);  
    expect(f.level = 1).toBe(1);
  });

  test('changeLevel()', () => {
    expect(f.level).toBe(1);
    expect(() => f.changeLevel('string')).toThrowError(new Error(`Field.changeLevel(value) value must be Integer`));
    expect(f.changeLevel(-1)).toBeFalsy();
    expect(f.changeLevel(2)).toBeTruthy();
    expect(f.changeLevel(3)).toBeTruthy();
    expect(f.changeLevel(4)).toBeTruthy();
    expect(f.changeLevel(5)).toBeTruthy();
    expect(f.changeLevel(6)).toBeFalsy();
    expect(f.changeLevel(1)).toBeTruthy();
    expect(f.level).toBe(1);
  });

  test('amountOfLevels()', () => {
    expect(f.amountOfLevels).toBe(5);
  });
});



