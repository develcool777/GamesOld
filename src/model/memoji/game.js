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
   * @property {Array} cardsData - array of cards data, every element is object{id: 0, name: 'fox', class: 'ec ec-fox img', isMatch: null, isFlipped: null}
   * @property {Array} cards - this is `arrayOfCardsName`
   * @throws Error - if `arrayOfCardsName` is not Array or every element of `arrayOfCardsName` is not String
   */
  constructor(arrayOfCardsName) {
    if (!Array.isArray(arrayOfCardsName)) {
      throw Error(`Game.constructor arrayOfCardsName must be Array`);
    }
    if (!arrayOfCardsName.every(item => typeof item === 'string')) {
      throw Error(`Game.constructor every element in arrayOfCardsName must be typeof string`);
    }
    let cardsData = []
    Object.defineProperties(this, {
      cards: {
        get: () => arrayOfCardsName
      },
      cardsData: {
        get: () => cardsData,
        set: (arr) => {
          cardsData = arr;
        }
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
    return console.log({cards: this.cards, cardsData: this.cardsData});
  }

  /**
   * @method setCardData
   * @memberof Memoji#Game#
   * @description This method set `this.cardsData`
   * @returns {undefined} undefined
   * @example this.setCardData()
   */
  setCardData() {
    const arr = []
    const doubled = this.cards.concat(this.cards);
    this.shuffleCards(doubled);
    doubled.forEach((item, i) => {
      const obj = {
        id: i,
        name: item,
        class: `ec ec-${item} img`,
        isMatch: null,
        isFlipped: null
      }
      arr.push(obj);
    })
    this.cardsData = arr;
  }

  /**
   * @method shuffleCards
   * @memberof Memoji#Game#
   * @param {Array} arr Array of cards
   * @description Shuffles array 
   * @returns {undefined} undefined
   * @example this.shuffleCards(array)
   */
  shuffleCards(arr) {
    arr.sort(() => 0.5 - Math.random());
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
  checkMatch(card1, card2) {
    if (card1.name === card2.name) {
      [card1.id, card2.id].forEach(id => {
        this.cardsData[id].isMatch = true;
        this.cardsData[id].isFlipped = true;
      })
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
   * @description When card was clicked sets `card.isFlipped` to `true`
   * @returns {undefined} undefined
   * @example this.clickOnCard(card)
   */
  clickOnCard(card) {
    this.cardsData[card.id].isFlipped = true;
  }

  /**
   * @method reset
   * @memberof Memoji#Game#
   * @param {Object} card card that was clicked
   * @description Sets `card.isFlipped` and `card.isMatch` to `null`
   * @returns {undefined} undefined
   * @example this.reset(card)
   */
  reset(card) {
    this.cardsData[card.id].isFlipped = null;
    this.cardsData[card.id].isMatch = null;
  }

  /**
   * @method clean
   * @memberof Memoji#Game#
   * @description After game, shuffles card and sets `card.isFlipped` and `card.isMatch` to `null`
   * @returns {undefined} undefined
   * @example this.clean()
   */
  clean() {
    this.shuffleCards(this.cardsData);
    this.cardsData = this.cardsData.map((card, i) => {
      card.id = i;
      card.isFlipped = null;
      card.isMatch = null;
      return card;
    })
  }

  /**
   * @method showOrHideHint
   * @memberof Memoji#Game#
   * @param {Boolean} bool
   * @description Hides or shows unmatched cards
   * @returns {undefined} undefined
   * @example 
   * this.showOrHideHint(true) // show all unmatched cards
   * this.showOrHideHint(false) // hide all unmatched cards
   */
  showOrHideHint(bool) {
    this.cardsData = this.cardsData.map(card => {
      const value = bool ? true : card.isMatch ? true : null;
      card.isFlipped = value;
      return card;
    })
  }
}