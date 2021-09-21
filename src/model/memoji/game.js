import Timer from "../timer";
/**
 * @namespace Memoji
 */

export default class Game {
  /**
   * @class 
   * @alias Game
   * @memberof Memoji#
   * @classdesc This class represents logic of Memoji game
   * @constructor
   * @param {Array} arrayOfCardsName - array of cards name
   * @param {Number} time - time in milliseconds(30000ms = 30s)
   * @property {Array} cardsData - array of cards data, every element is object{id: 0, name: 'fox', class: 'ec ec-fox img', isMatch: null, isFlipped: null}
   * @property {Array} cards - this is `arrayOfCardsName`
   * @property {Array} compare - this is array that stores only two elements(card that was selected) to check if they are the same
   * @property {Instance} timer - instance of [`Timer`]{@link Timer}
   * @property {String} gameStatus - Shows game status
   * @property {Number} resultTime - stores time in milliseconds that was need to complete the game
   * @property {String} result - stores result of the game('Won' or 'Lost') 
   * @throws Error - if `arrayOfCardsName` is not Array 
   * @throws Error - if every element of `arrayOfCardsName` is not String
   * @throws Error - if `time` is not Integer and lower than 0
   */
  constructor(arrayOfCardsName, time) {
    if (!Array.isArray(arrayOfCardsName)) {
      throw Error(`Game.constructor arrayOfCardsName must be Array`);
    }
    if (!arrayOfCardsName.every(item => typeof item === 'string')) {
      throw Error(`Game.constructor every element in arrayOfCardsName must be typeof string`);
    }
    if (!Number.isInteger(time) || time < 1) {
      throw Error(`Game.constructor time must Integer and greater than 0`);
    }
    let cardsData = [];
    const compare = [];
    const timer = new Timer(time);
    let gameStatus = '';
    let resultTime = 0;
    let result = '';
    Object.defineProperties(this, {
      cards: {
        get: () => arrayOfCardsName
      },
      cardsData: {
        get: () => cardsData,
        set: (arr) => {
          if (!Array.isArray(arr)) {
            throw Error(`Game.cardsData.set(arr) arr must be Array`);
          }
          if (!arr.every(obj => typeof obj === 'object' && obj !== null)) {
            throw Error(`Game.cardsData.set(arr) every element of arr must be Object`);
          }
          if (!arr.every(obj => ['id', 'name', 'class', 'isMatch', 'isFlipped'].every(prop => Object.prototype.hasOwnProperty.call(obj, prop)))) {
            throw Error(`Game.cardsData.set(arr) every element of arr must be Object with keys: 'id', 'name', 'class', 'isMatch', 'isFlipped'`);
          }
          if (!arr.every(obj => Number.isInteger(obj.id) && obj.id >= 0)) {
            throw Error(`Game.cardsData.set(arr) every Object of arr must have Integer value and be positive, on key 'id'`);
          }
          if (!arr.every(obj => typeof obj.name === 'string')) {
            throw Error(`Game.cardsData.set(arr) every Object of arr must have String value on key 'name'`);
          }
          if (!arr.every(obj => typeof obj.class === 'string')) {
            throw Error(`Game.cardsData.set(arr) every Object of arr must have String value on key 'class'`);
          }
          if (!arr.every(obj => obj.isMatch === null || typeof obj.isMatch === 'boolean')) {
            throw Error(`Game.cardsData.set(arr) every Object of arr must have null or Boolean value on key 'isMatch'`);
          }
          if (!arr.every(obj => obj.isFlipped === null || typeof obj.isFlipped === 'boolean')) {
            throw Error(`Game.cardsData.set(arr) every Object of arr must have null or Boolean value on key 'isFlipped'`);
          }
          cardsData = arr;
        }
      },
      timer: {
        get: () => timer
      },
      gameStatus: {
        get: () => gameStatus,
        set: (value) => {
          if (typeof value !== 'string') {
            throw Error(`Game.gameStatus.set(value) value must be String`);
          }
          if (!['', 'start', 'stop', 'finish'].includes(value)) {
            throw Error(`Game.gameStatus.set(value) value must be '' or 'start' or 'finish' or 'stop'`);
          }
          gameStatus = value;
        }
      },
      resultTime: {
        get: () => resultTime,
        set: (value) => {
          if (!Number.isInteger(value) || value < 0) {
            throw Error(`Game.resultTime.set(value) value must be positive Integer`);
          }
          resultTime = value;
        }
      },
      result: {
        get: () => result,
        set: (value) => {
          if (typeof value !== 'string') {
            throw Error(`Game.result.set(value) value must be String`);
          }
          if (!['', 'Won', 'Lost'].includes(value)) {
            throw Error(`Game.result.set(value) value must be '' or 'Lost' or 'Won'`);
          }
          result = value;
        }
      },
      compare: {
        get: () => compare
      }
    })
  }

  /**
   * @method log
   * @memberof Memoji#Game#
   * @description Shows in console all fields of class
   * @returns {undefined} undefined
   * @example this.log
   */
  get log() {
    return console.log({
      cards: this.cards, 
      cardsData: this.cardsData,
      compare: this.compare,
      timer: this.timer,
      gameStatus: this.gameStatus,
      resultTime: this.resultTime,
      result: this.result
    });
  }

  /**
   * @method setCardData
   * @memberof Memoji#Game#
   * @description This method set `this.cardsData`
   * @returns {undefined} undefined
   * @example this.setCardData()
   */
  setCardData() {
    const doubled = this.cards.concat(this.cards);
    this.shuffleCards(doubled);
    this.cardsData = doubled.map((item, i) => {
      const obj = {
        id: i,
        name: item,
        class: `ec ec-${item} img`,
        isMatch: null,
        isFlipped: null
      }
      return obj;
    })
  }

  /**
   * @method shuffleCards
   * @memberof Memoji#Game#
   * @param {Array} arr Array of cards
   * @description Returns shuffled array
   * @throws Error - if `arr` is not Array 
   * @returns {Array} Array
   * @example const shuffled = this.shuffleCards(array);
   */
  shuffleCards(arr) {
    if (!Array.isArray(arr)) {
      throw Error(`Game.shuffleCards(arr) arr must be Array`);
    }
    return arr.sort(() => 0.5 - Math.random());
  }

  /**
   * @method checkMatch
   * @memberof Memoji#Game#
   * @param {Object} card1 first card
   * @param {Object} card2 second card
   * @description If name of cards are the same return true, otherwise false
   * @returns {Boolean} Boolean
   * @example const isMatch = this.checkMatch(card1, card2);
   */
  checkMatch() {
    if (this.compare.length < 2) { return }
    const [card1, card2] = this.compare;

    if (card1.name === card2.name) {
      [card1.id, card2.id].forEach(id => {
        this.cardsData[id].isMatch = true;
        this.cardsData[id].isFlipped = true;
      })
      this.compare.splice(0);
      return true;
    }
    [card1.id, card2.id].forEach(id => {
      this.cardsData[id].isFlipped = true;
      this.cardsData[id].isMatch = false;
    })
    return false;
  }

  /**
   * @method checkWin
   * @memberof Memoji#Game#
   * @description Checks if all cards are matched
   * @returns {Boolean} Boolean
   * @example const isWin = this.checkWin();
   */
  checkWin() {
    return this.cardsData.every(item => item.isMatch === true);
  }

  /**
   * @method clickOnCard
   * @memberof Memoji#Game#
   * @param {Object} card card that was clicked
   * @description When card was clicked sets `card.isFlipped` to `true` and adds to `compare`,
   * returns `true` in case of success, otherwise `false`
   * @throws Error - if `card` is not Object
   * @throws Error - if `card` is not Object with keys: 'id', 'name', 'class', 'isMatch', 'isFlipped'
   * @returns {Boolean} Boolean
   * @example this.clickOnCard(card)
   */
  clickOnCard(card) {
    if (typeof card !== 'object' || card === null || Array.isArray(card)) {
      throw Error(`Game.clickOnCard(card) card must be Object`);
    }
    if (!['id', 'name', 'class', 'isMatch', 'isFlipped'].every(prop => Object.prototype.hasOwnProperty.call(card, prop))) {
      throw Error(`Game.clickOnCard(card) card must be Object with keys: 'id', 'name', 'class', 'isMatch', 'isFlipped'`);
    }  
    if (this.compare.length === 2) { return false }
    this.cardsData[card.id].isFlipped = true;
    this.compare.push(card);
    return true;
  }

  /**
   * @method reset
   * @memberof Memoji#Game#
   * @param {Object} card card that was clicked
   * @description Sets `card.isFlipped` and `card.isMatch` to `null`
   * @throws Error - if `card` is not Object
   * @throws Error - if `card` is not Object with keys: 'id', 'name', 'class', 'isMatch', 'isFlipped'
   * @returns {undefined} undefined
   * @example this.reset(card)
   */
  reset(card) {
    if (typeof card !== 'object' || card === null || Array.isArray(card)) {
      throw Error(`Game.reset(card) card must be Object`);
    }
    if (!['id', 'name', 'class', 'isMatch', 'isFlipped'].every(prop => Object.prototype.hasOwnProperty.call(card, prop))) {
      throw Error(`Game.reset(card) card must be Object with keys: 'id', 'name', 'class', 'isMatch', 'isFlipped'`);
    }
    this.cardsData[card.id].isFlipped = null;
    this.cardsData[card.id].isMatch = null;
  }

  /**
   * @method closeCards
   * @memberof Memoji#Game#
   * @description Closes cards 
   * @returns {undefined} undefined
   * @example this.closeCards()
   */
  closeCards() {
    this.cardsData.forEach(card => {
      this.reset(card);
    })
  }

  /**
   * @method clean
   * @memberof Memoji#Game#
   * @description After game, shuffles cards and sets all class properties to initial value
   * @returns {undefined} undefined
   * @example this.clean()
   */
  clean() {
    this.shuffleCards(this.cardsData);
    this.cardsData = this.cardsData.map((card, i) => {
      card.id = i;
      return card;
    })
    this.timer.reset();
    this.gameStatus = '';
    this.compare.splice(0);
    this.result = ''
    this.resultTime = 0;
  }

  /**
   * @method showOrHideHint
   * @memberof Memoji#Game#
   * @param {Boolean} bool
   * @description Hides or shows unmatched cards
   * @throws Error - if `bool` is not Boolean
   * @returns {undefined} undefined
   * @example 
   * this.showOrHideHint(true) // show all unmatched cards
   * this.showOrHideHint(false) // hide all unmatched cards
   */
  showOrHideHint(bool) {
    if (typeof bool !== 'boolean') {
      throw Error(`Game.showOrHideHint(bool) bool must be Boolean`);
    }
    this.cardsData = this.cardsData.map(card => {
      const value = bool ? true : card.isMatch ? true : null;
      card.isFlipped = value;
      return card;
    })
  }

  /**
   * @method startGame
   * @memberof Memoji#Game#
   * @description Starts the game
   * @returns {undefined} undefined
   * @example this.startGame()
   */
  startGame() {
    this.timer.start();
    this.gameStatus = 'start'
  }

  /**
   * @method pauseGame
   * @memberof Memoji#Game#
   * @description Pauses the game
   * @returns {undefined} undefined
   * @example this.pauseGame()
   */
  pauseGame() {
    this.timer.stop();
    this.gameStatus = 'stop'
  }

  /**
   * @method gameFinished
   * @memberof Memoji#Game#
   * @param {String} str - result of game('Won' or 'Lost')
   * @description Finishes the game 
   * @throws Error - if `str` is not String
   * @throws Error - if `str` is 'Won' or 'Lost'
   * @returns {undefined} undefined
   * @example this.gameFinished()
   */
  gameFinished(str) {
    if (typeof str !== 'string') {
      throw Error(`Game.gameFinished(str) str must be String`);
    }
    if (!['Won', 'Lost'].includes(str)) {
      throw Error(`Game.gameFinished(str) str must be 'Won' or 'Lost'`);
    }
    this.resultTime = this.timer.amountOfTime();
    this.result = str;
    this.timer.stop();
    this.gameStatus = 'finish'
  }
}