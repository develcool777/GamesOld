import { expect } from '@jest/globals';
import e from 'express';
import Game from '../../src/model/memoji/game';
import Timer from '../../src/model/timer';

const DATA = [
  ["dog", "lion", "mouse", "hamster", "tiger", "fox-face"],
  30000
];

describe('creating instance of Game', () => {
  const g = new Game(...DATA);

  test('instance of class Game', () => {
    expect(new Game(...DATA)).toBeInstanceOf(Game);
    expect(() => new Game('string', {})).toThrowError(new Error(`Game.constructor arrayOfCardsName must be Array`));
    expect(() => new Game(['string', {}, [], 132, 34.5], {})).toThrowError(new Error(`Game.constructor every element in arrayOfCardsName must be typeof string`));
    expect(() => new Game(['string', 'str'], [])).toThrowError(new Error(`Game.constructor time must Integer and greater than 0`));
    expect(() => new Game(['string', 'str'], 0)).toThrowError(new Error(`Game.constructor time must Integer and greater than 0`));
  });

  test('properties of class Game', () => {
    expect(Object.getOwnPropertyNames(new Game(...DATA))).toEqual(['cards', 'cardsData', 'timer', 'gameStatus', 'resultTime', 'result', 'compare']);
  });

  test('properties values of class Game', () => {
    expect(g.cards).toEqual(['dog', 'lion', 'mouse', 'hamster', 'tiger', 'fox-face']);
    expect(g.cardsData).toEqual([]);
    expect(g.timer).toBeInstanceOf(Timer);
    expect(g.gameStatus).toMatch('');
    expect(g.resultTime).toBe(0);
    expect(g.result).toMatch('');
    expect(g.compare).toEqual([]);
  });
});

describe('testing properties', () => {
  const g = new Game(...DATA);

  test('cards', () => {
    expect(g.cards).toEqual(['dog', 'lion', 'mouse', 'hamster', 'tiger', 'fox-face']);
    expect(() => g.cards = [1, 2]).toThrowError(new Error(`Cannot set property cards of #<Game> which has only a getter`));
  });

  test('cardsData', () => {
    expect(g.cardsData).toEqual([]);
    expect(() => g.cardsData = 'string').toThrowError(new Error(`Game.cardsData.set(arr) arr must be Array`));
    expect(() => g.cardsData = ['string', 45, 6.7, null]).toThrowError(new Error(`Game.cardsData.set(arr) every element of arr must be Object`));
    expect(() => g.cardsData = [{s: 1}, {g: 55.4}, {cards: ['vbeb']}]).toThrowError(new Error(`Game.cardsData.set(arr) every element of arr must be Object with keys: 'id', 'name', 'class', 'isMatch', 'isFlipped'`));
    expect(() => g.cardsData = [{id: -1, name: 2.8, class: null, isMatch: 0, isFlipped: 'no'}]).toThrowError(new Error(`Game.cardsData.set(arr) every Object of arr must have Integer value and be positive, on key 'id'`));
    expect(() => g.cardsData = [{id: 0, name: NaN, class: null, isMatch: 0, isFlipped: 'no'}]).toThrowError(new Error(`Game.cardsData.set(arr) every Object of arr must have String value on key 'name'`));
    expect(() => g.cardsData = [{id: 0, name: 'name', class: null, isMatch: 0, isFlipped: 'no'}]).toThrowError(new Error(`Game.cardsData.set(arr) every Object of arr must have String value on key 'class'`));
    expect(() => g.cardsData = [{id: 0, name: 'name', class: 'class', isMatch: 0, isFlipped: 'no'}]).toThrowError(new Error(`Game.cardsData.set(arr) every Object of arr must have null or Boolean value on key 'isMatch'`));
    expect(() => g.cardsData = [{id: 0, name: 'name', class: 'class', isMatch: null, isFlipped: 'no'}]).toThrowError(new Error(`Game.cardsData.set(arr) every Object of arr must have null or Boolean value on key 'isFlipped'`));
    expect(g.cardsData = [{id: 0, name: 'name', class: 'class', isMatch: null, isFlipped: true}]).toEqual([{id: 0, name: 'name', class: 'class', isMatch: null, isFlipped: true}]);
    g.cardsData.splice(0);
    expect(g.cardsData).toEqual([]);
  });

  test('timer', () => {
    expect(g.timer).toBeInstanceOf(Timer);
    expect(() => g.timer = []).toThrowError(new Error(`Cannot set property timer of #<Game> which has only a getter`));
  });

  test('gameStatus', () => {
    expect(g.gameStatus).toMatch('');
    expect(() => g.gameStatus = []).toThrowError(new Error(`Game.gameStatus.set(value) value must be String`));
    expect(() => g.gameStatus = 'string').toThrowError(new Error(`Game.gameStatus.set(value) value must be '' or 'start' or 'finish' or 'stop'`));
    expect(g.gameStatus = 'start').toMatch('start');
    expect(g.gameStatus = 'stop').toMatch('stop');
    expect(g.gameStatus = 'finish').toMatch('finish');
    expect(g.gameStatus = '').toMatch('');
  });

  test('resultTime', () => {
    expect(g.resultTime).toBe(0);
    expect(() => g.resultTime = null).toThrowError(new Error(`Game.resultTime.set(value) value must be positive Integer`));
    expect(() => g.resultTime = -1).toThrowError(new Error(`Game.resultTime.set(value) value must be positive Integer`));
    expect(g.resultTime = 1).toBe(1);
    expect(g.resultTime = 0).toBe(0);
  });

  test('result', () => {
    expect(g.result).toMatch('');
    expect(() => g.result = null).toThrowError(new Error(`Game.result.set(value) value must be String`));
    expect(() => g.result = 'string').toThrowError(new Error(`Game.result.set(value) value must be '' or 'Lost' or 'Won'`));
    expect(g.result = 'Won').toMatch('Won');
    expect(g.result = 'Lost').toMatch('Lost');
    expect(g.result = '').toMatch('');
  });

  test('compare', () => {
    expect(g.compare).toEqual([]);
    expect(() => g.compare = null).toThrowError(new Error(`Cannot set property compare of #<Game> which has only a getter`));
  });
});

describe('testing methods', () => {
  const g = new Game(...DATA);

  test('log', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    expect(g.log).toBeUndefined();
    expect(console.log.mock.calls[0][0]).toEqual({ 
      cards: ["dog", "lion", "mouse", "hamster", "tiger", "fox-face"], 
      cardsData: [],
      compare: [],
      timer: new Timer(DATA[1]),
      gameStatus: '',
      resultTime: 0,
      result: '',
    });
    spy.mockRestore();
  });

  test('setCardData()', () => {
    expect(g.cardsData).toEqual([]);
    expect(g.setCardData()).toBeUndefined();
    expect(g.cardsData).toHaveLength(12);
    expect(g.cardsData.map(obj => obj.name).sort()).toEqual([
      "dog", "dog",
      "fox-face", "fox-face",
      "hamster", "hamster",
      "lion", "lion",
      "mouse", "mouse",
      "tiger", "tiger"
    ]);
  });

  test('shuffleCards()', () => {
    const spy = jest.spyOn(Math, 'random').mockImplementation(() => 0.5);
    expect(() => g.shuffleCards('string')).toThrowError(new Error(`Game.shuffleCards(arr) arr must be Array`));
    const arr = [1, 2, 3, 4, 5, 6];
    expect(g.shuffleCards(arr)).toMatchSnapshot();
    spy.mockRestore()
  });

  test('checkMatch()', () => {
    expect(g.checkMatch()).toBeUndefined();
    const data = [
      {"class": "ec ec-fox-face img", "id": 0, "isFlipped": null, "isMatch": null, "name": "fox-face"},
      {"class": "ec ec-dog img", "id": 1, "isFlipped": null, "isMatch": null, "name": "dog"}
    ]
    data.forEach(element => g.compare.push(element));
    expect(g.compare).toHaveLength(2);
    expect(g.compare).toEqual(data);
    expect(g.checkMatch()).toBeFalsy();
    
    g.compare.splice(0);
    expect(g.compare).toEqual([]);

    const data2 = [
      {"class": "ec ec-lion img", "id": 0, "isFlipped": null, "isMatch": null, "name": "lion"},
      {"class": "ec ec-lion img", "id": 1, "isFlipped": null, "isMatch": null, "name": "lion"}
    ]
    data2.forEach(element => g.compare.push(element));
    expect(g.compare).toHaveLength(2);
    expect(g.compare).toEqual(data2);
    expect(g.checkMatch()).toBeTruthy();
    expect(g.compare).toEqual([]);
  });

  test('checkWin()', () => {
    expect(g.checkWin()).toBeFalsy();
    g.cardsData.forEach((_, i) => g.cardsData[i].isMatch = true);
    expect(g.checkWin()).toBeTruthy();
    expect(g.closeCards()).toBeUndefined();
  });

  test('clickOnCard()', () => {
    expect(() => g.clickOnCard([])).toThrowError(new Error(`Game.clickOnCard(card) card must be Object`));
    expect(() => g.clickOnCard('string')).toThrowError(new Error(`Game.clickOnCard(card) card must be Object`));
    expect(() => g.clickOnCard({card: 'zero'})).toThrowError(new Error(`Game.clickOnCard(card) card must be Object with keys: 'id', 'name', 'class', 'isMatch', 'isFlipped'`));
    expect(g.clickOnCard({"class": "ec ec-lion img", "id": 0, "isFlipped": null, "isMatch": null, "name": "lion"})).toBeTruthy();
    expect(g.compare).toHaveLength(1);
    expect(g.clickOnCard({"class": "ec ec-dog img", "id": 1, "isFlipped": null, "isMatch": null, "name": "dog"})).toBeTruthy();
    expect(g.compare).toHaveLength(2);
    expect(g.clickOnCard({"class": "ec ec-fox-face img", "id": 2, "isFlipped": null, "isMatch": null, "name": "fox-face"})).toBeFalsy();
    g.compare.splice(0);
    expect(g.compare).toEqual([]);
  });

  test('reset()', () => {
    expect(() => g.reset([])).toThrowError(new Error(`Game.reset(card) card must be Object`));
    expect(() => g.reset('string')).toThrowError(new Error(`Game.reset(card) card must be Object`));
    expect(() => g.reset({card: 'zero'})).toThrowError(new Error(`Game.reset(card) card must be Object with keys: 'id', 'name', 'class', 'isMatch', 'isFlipped'`)); 
    g.cardsData[0].isFlipped = true;
    g.cardsData[0].isMatch = false;
    expect(g.reset(g.cardsData[0])).toBeUndefined();
    expect(g.cardsData[0].isFlipped).toBeNull();
    expect(g.cardsData[0].isMatch).toBeNull();
  });

  test('closeCards()', () => {
    g.cardsData.forEach((_, i) => {
      expect(g.cardsData[i].isFlipped = true).toBeTruthy();
      expect(g.cardsData[i].isMatch = false).toBeFalsy();
    });
    expect(g.closeCards()).toBeUndefined();
    g.cardsData.forEach((_, i) => {
      expect(g.cardsData[i].isFlipped).toBeNull();
      expect(g.cardsData[i].isMatch).toBeNull();
    });
  });

  test('clean()', () => {
    expect(g.clean()).toBeUndefined();
  });

  test('showOrHideHint()', () => {
    expect(() => g.showOrHideHint('string')).toThrowError(new Error(`Game.showOrHideHint(bool) bool must be Boolean`));
    expect(g.showOrHideHint(true)).toBeUndefined();
    expect(g.cardsData[0].isMatch = true).toBeTruthy();
    g.cardsData.forEach((_, i) => expect(g.cardsData[i].isFlipped).toBeTruthy());
    expect(g.showOrHideHint(false)).toBeUndefined();
    g.cardsData.forEach((_, i) => {
      if (i === 0) {
        return expect(g.cardsData[i].isFlipped).toBeTruthy();
      }
      expect(g.cardsData[i].isFlipped).toBeFalsy()
    });
  });

  test('startGame()', () => {
    expect(g.startGame()).toBeUndefined();
    expect(g.gameStatus).toMatch('start');
    g.timer.stop();
  }); 

  test('pauseGame()', () => {
    expect(g.pauseGame()).toBeUndefined();
    expect(g.gameStatus).toMatch('stop');
  });

  test('gameFinished()', () => {
    expect(() => g.gameFinished([])).toThrowError(new Error(`Game.gameFinished(str) str must be String`));
    expect(() => g.gameFinished('string')).toThrowError(new Error(`Game.gameFinished(str) str must be 'Won' or 'Lost'`));
    expect(g.gameFinished('Won')).toBeUndefined();
    expect(g.gameStatus).toMatch('finish');
    expect(g.result).toMatch('Won');
  });
});

 