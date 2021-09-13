export default class Field {
  /**
   * @class 
   * @alias Field
   * @memberof Memoji#
   * @classdesc Operates with `data` that comes from [`firebase`]{@link https://firebase.google.com}
   * @param {Array} data array of levels
   * @property {Array} data this is `data` 
   * @property {Number} level by default it's value is 1
   * @throws Error - if `data` is not Array
   * @throws Error - if every element of `data` is not object with keys: 'time', 'level', 'cards'
   * @throws Error - if every element of `data` the value of keys('time', 'level') are not Integer
   * @throws Error - if every element of `data` the value of key('cards') is not Array
   * @throws Error - if every element of `data` the value of key('cards') is not array of strings 
   * @constructor
   */
  constructor(data) {
    if (!Array.isArray(data)) {
      throw Error(`Field.constructor data must be Array`);
    }
    if (!data.every(obj => ['time', 'level', 'cards'].every(prop => Object.prototype.hasOwnProperty.call(obj, prop)))) {
      throw Error(`Field.constructor every element of data must be Object with props: 'time', 'level', 'cards'`);
    }
    if (!data.every(obj => Number.isInteger(obj.time) && Number.isInteger(obj.level) && obj.time > 0 && obj.level > 0)) {
      throw Error(`Field.constructor every time and level must be Integer and greater than 0`);
    }
    if (!data.every(obj => Array.isArray(obj.cards))) {
      throw Error(`Field.constructor every cards must be Array`)
    }
    if (!data.every(obj => obj.cards.every(item => typeof item === 'string'))) {
      throw Error(`Field.constructor every cards item must be String`)
    }
    let level = 1;
    Object.defineProperties(this, {
      data: {
        get: () => data
      },
      level: {
        get: () => level,
        set: (value) => {
          if (!Number.isInteger(value)) {
            throw Error(`Field level.set() value must be Integer`);
          }
          level = value;
        }
      }
    })
  }

  /**
   * @method log
   * @memberof Memoji#Field#
   * @description Shows in console all class fields
   * @returns {undefined} undefined
   * @example this.log()
   */
  get log() {
    return console.log({CurrentLevel: this.level, data: this.data});
  }
  
  /**
   * @method getCardsForGame
   * @memberof Memoji#Field#
   * @description Returns array of cards
   * @returns {Array} Array
   * @example const cards = this.getCardsForGame()
   */
  getCardsForGame() {
    return this.data.find(obj => obj.level === this.level).cards;
  }

  /**
   * @method time
   * @memberof Memoji#Field#
   * @description Returns time 
   * @returns {Number} Number
   * @example const time = this.time()
   */
  time() {
    return this.data.find(obj => obj.level === this.level).time;
  }

  /**
   * @method changeLevel
   * @memberof Memoji#Field#
   * @param {Number} value this is step 
   * @description Changes level if 1 increases level, if -1 decreases level, returns `true` in case of success, otherwise `false`
   * @throws Error - if `value` is not Integer
   * @throws Error - if `value` is not 1 or -1
   * @returns {Boolean} Boolean
   * @example 
   * this.changeLevel(1) // increases level
   * this.changeLevel(-1) // decreases level
   */
  changeLevel(value) {
    if (!Number.isInteger(value)) {
      throw Error(`Field.changeLevel(value) value must be Integer`);
    }
    if (Math.abs(value) !== 1) {
      throw Error(`Field.changeLevel(value) value must be 1 or -1`);
    }
    const levels = this.data.map(obj => obj.level);
    if (levels.includes(this.level + value)) {
      this.level += value;
      return true;
    }
    return false;
  }

  /**
   * @method amountOfLevels
   * @memberof Memoji#Field#
   * @description Returns amount of levels
   * @returns {Number} Number
   * @example const levels = this.amountOfLevels()
   */
  amountOfLevels() {
    return this.data.length;
  }
}