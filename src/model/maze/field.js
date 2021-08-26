export default class Field {
  /**
   * @class 
   * @alias Field
   * @memberof Maze#
   * @classdesc Operates with `data` that comes from [`firebase`]{@link https://firebase.google.com}
   * @param {Array} data array of levels
   * @property {Array} data this is `data` 
   * @property {Number} level by default it's value is 1
   * @constructor
   * @throws Error - if `data` is not Array
   * @throws Error - if every element of `data` is not object with keys: 'time', 'level', 'field', 'winPath', 'startPosition', 'endPosition'
   * @throws Error - if every element of `data` the value of keys('time', 'level') are not Integer and lower than 0
   * @throws Error - if every element of `data` the value of key('field') is not Array
   * @throws Error - if every element of `data` and every element of the value of key('field') is not Array
   * @throws Error - if every element of `data` the value of key('winPath') is not Array
   * @throws Error - if every element of `data` and every element of the value of key('winPath') is not object with keys: 'x', 'y' 
   * @throws Error - if every element of `data` the value of key('startPosition') is not object with keys: 'x', 'y'
   * @throws Error - if every element of `data` the value of key('endPosition') is not object with keys: 'x', 'y'
   */
  constructor(data) {
    if (!Array.isArray(data)) {
      throw Error(`Field.constructor data must be Array`);
    }
    if (!data.every(obj => ['time', 'level', 'field', 'winPath', 'startPosition', 'endPosition'].every(prop => Object.prototype.hasOwnProperty.call(obj, prop)))) {
      throw Error(`Field.constructor every element of data must be Object with props: 'time', 'level', 'field', 'winPath', 'startPosition', 'endPosition'`);
    }
    // 'time', 'level'
    if (!data.every(obj => Number.isInteger(obj.time) && Number.isInteger(obj.level) && obj.time > 0 && obj.level > 0)) {
      throw Error(`Field.constructor every time and level must be Integer and greater than 0`);
    }
    // field
    if (!data.every(obj => Array.isArray(obj.field))) {
      throw Error(`Field.constructor every field must be Array`)
    }
    if (!data.every(obj => obj.field.every(item => Array.isArray(item)))) {
      throw Error(`Field.constructor every field element must be Array`)
    }
    // winPath
    if (!data.every(obj => Array.isArray(obj.winPath))) {
      throw Error(`Field.constructor every winPath must be Array`)
    }
    if (!data.every(obj => obj.winPath.every(obj => ['x', 'y'].every(prop => Object.prototype.hasOwnProperty.call(obj, prop))))) {
      throw Error(`Field.constructor every winPath element must be Object with props: 'x', 'y'`);
    }
    //startPosition 
    if (!data.every(obj => ['x', 'y'].every(prop => Object.prototype.hasOwnProperty.call(obj.startPosition, prop)))) {
      throw Error(`Field.constructor every startPosition must be Object with props: 'x', 'y'`);
    }
    // endPosition
    if (!data.every(obj => ['x', 'y'].every(prop => Object.prototype.hasOwnProperty.call(obj.endPosition, prop)))) {
      throw Error(`Field.constructor every endPosition must be Object with props: 'x', 'y'`);
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
      },
    })
  }
  /**
   * @method log
   * @memberof Maze#Field#
   * @description Shows in console all class fields
   * @returns {undefined} undefined
   * @example this.log
   */
  get log() {
    return console.log({CurrentLevel: this.level, data: this.data});
  }

  /**
   * @method generateFieldForDraw
   * @memberof Maze#Field#
   * @param {Array} field this is Matrix that filled with 1 and 0
   * @param {Object} start this is Object{x, y} with start position coordinates 
   * @param {Object} end this is Object{x, y} with end position coordinates
   * @returns {Array} Array
   * @example 
   * const field = [[1, 1, 1], [0, 0, 1], [1, 0, 1]]
   * const fildForDraw = this.fildForDraw(field, {x: 1, y: 0}, {x: 2, y: 1})
   */
  generateFieldForDraw(field, start, end) {
    const fieldForDraw = field.map((arr, i) => {
      return arr.map((item, j) => {
        const obj =  {
          id: j
        };
        if (item === 1) {
          obj.class = 'block';
        }
        if (item === 0) {
          obj.class = 'empty';
        }
        if (start.x === i && start.y === j) {
          obj.class = 'empty player';
        }
        if (end.x === i && end.y === j) {
          obj.class = 'winPosition';
        }
        return obj;
      })
    })
    return fieldForDraw;
  }

  /**
   * @method generateFieldWith
   * @memberof Maze#Field#
   * @param {Array} gameField this is Matrix that filled with 1, 0, '', '@', '*', '#'
   * (1 is wall, 0 is available cell for move, '@' is player, '*' is cell which player have visited, 
   * '#' is hint cell(all these cells show path to finish), '' is finish)
   * @param {Boolean} path if value is true than it shows player path from start position
   * @param {Boolean} hint if value is true than it shows path from start position to finish
   * @description Returns field with players path or hint or both
   * @returns {Array} Array
   * @example 
   * const gameField = [
   *  [1, '*',  1,  1],
   *  [1, '*', '@', ],
   *  [1,  0,  '#', 1].
   *  [1, '',  '#',  1]
   * ]
   * const field = this.generateFieldWith(gameField, true, true) // will generate field with hint path and players path
   */
  generateFieldWith(gameField, path, hint) {
    const copy = gameField.map(arr => arr.slice());
    if (hint) {
      const hint = this.data.find(obj => obj.level === this.level).winPath;
      hint.forEach(item => {
        if (copy[item.x][item.y] === 0) {
          copy[item.x][item.y] = "#"
        }
      })
    }
    const fieldForDraw = copy.map((arr) => {
      return arr.map((item, j) => {
        const obj =  {
          id: j
        };
        if (item === 1) {
          obj.class = 'block';
        }
        if (item === 0) {
          obj.class = 'empty';
        }
        if (item === '@') {
          obj.class = 'empty player';
        }
        if (item === '') {
          obj.class = 'winPosition';
        }
        if (item === '*') {
          obj.class = path ? 'empty path' : 'empty';
        }
        if (item === '#') {
          obj.class = `empty hint`
        }
        return obj;
      })
    })
    return fieldForDraw;
  }

  /**
   * @method dataForGame
   * @memberof Maze#Field#
   * @description Returns Array of data for the [`Game class`]{@link Maze#Game}
   * @returns {Array} [Field, startPosition, endPosition, time]
   * @example const data = this.dataForGame();
   */
  dataForGame() {
    const curentLevel = this.data.find(obj => obj.level === this.level);
    const fieldCopy = curentLevel.field.map(arr => arr.slice());
    const start = curentLevel.startPosition;
    const end = curentLevel.endPosition;
    const time = curentLevel.time;
    return [fieldCopy, start, end, time];
  }

  /**
   * @method time
   * @memberof Maze#Field#
   * @description Returns time 
   * @returns {Number} Number
   * @example const time = this.time()
   */
  time() {
    return this.data.find(obj => obj.level === this.level).time;
  }

  /**
   * @method changeLevel
   * @memberof Maze#Field#
   * @param {Number} value this is step 
   * @description Changes level if 1 increases level, if -1 decreases level
   * @throws Error - if value is not 1 or -1
   * @returns {undefined} undefined
   * @example 
   * this.changeLevel(1) // increases level
   * this.changeLevel(-1) // decreases level
   */
  changeLevel(value) {
    if (Math.abs(value) !== 1) {
      throw Error(`Field.changeLevel(value) value must be 1 or -1`)
    }
    const levels = this.data.map(obj => obj.level);
    if (levels.includes(this.level + value)) {
      this.level += value;
    }
  }

  /**
   * @method amountOfLevels
   * @memberof Maze#Field#
   * @description Returns amount of levels
   * @returns {Number} Number
   * @example const levels = this.amountOfLevels()
   */
  amountOfLevels() {
    return this.data.length;
  }
}