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
   * @throws Error - if every element of `data` is not object
   * @throws Error - if every element of `data` is not object with keys: 'time', 'level', 'field', 'winPath', 'startPosition', 'endPosition'
   * @throws Error - if every element of `data` the value of keys('time', 'level') are not Integer and lower than 0
   * 
   * @throws Error - if every element of `data` the value of key('field') is not Array
   * @throws Error - if every element of `data` the value of key('field') is not 2D Array
   * @throws Error - if every element of `data` the value of key('field') is 2D Array but every element is not 1 or 0
   * 
   * @throws Error - if every element of `data` the value of key('startPosition') is not object
   * @throws Error - if every element of `data` the value of key('startPosition') is not object with keys: 'x', 'y'
   * @throws Error - if every element of `data` the value of key('startPosition') does not have Integer value on keys: 'x', 'y'
   * @throws Error - if every element of `data` the value of key('startPosition') does not point to 0 on the field
   * 
   * @throws Error - if every element of `data` the value of key('endPosition') is not object
   * @throws Error - if every element of `data` the value of key('endPosition') is not object with keys: 'x', 'y'
   * @throws Error - if every element of `data` the value of key('endPosition') does not have Integer value on keys: 'x', 'y'
   * @throws Error - if every element of `data` the value of key('endPosition') does not point to 0 on the field
   * 
   * @throws Error - if every element of `data` the value of key('winPath') is not Array
   * @throws Error - if every element of `data` and every element of the value of key('winPath') is not object
   * @throws Error - if every element of `data` and every element of the value of key('winPath') is not object with keys: 'x', 'y' 
   * @throws Error - if every element of `data` and every element of the value of key('winPath') does not have Integer value on keys: 'x', 'y'
   * @throws Error - if every element of `data` and every element of the value of key('winPath') does not store path from startPosition to endPosition
   */
  constructor(data) {
    if (!Array.isArray(data)) {
      throw Error(`Field.constructor data must be Array`);
    }
    if (!data.every(obj => typeof obj === 'object' && obj !== null && !Array.isArray(obj))) {
      throw Error(`Field.constructor every element of data must be Object`);
    }
    if (!data.every(obj => ['time', 'level', 'field', 'winPath', 'startPosition', 'endPosition'].every(prop => Object.prototype.hasOwnProperty.call(obj, prop)))) {
      throw Error(`Field.constructor every element of data must be Object with keys: 'time', 'level', 'field', 'winPath', 'startPosition', 'endPosition'`);
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
      throw Error(`Field.constructor every field must be 2D Array`)
    }
    if (!data.every(obj => obj.field.every(arr => arr.every(item => [1, 0].includes(item))))) {
      throw Error(`Field.constructor every field must be 2D Array where every element of it must be: 1 or 0`);
    }
    //startPosition 
    if (!data.every(obj => typeof obj.startPosition === 'object' && obj.startPosition !== null && !Array.isArray(obj.startPosition))) {
      throw Error(`Field.constructor every startPosition must be Object`);
    }
    if (!data.every(obj => ['x', 'y'].every(prop => Object.prototype.hasOwnProperty.call(obj.startPosition, prop)))) {
      throw Error(`Field.constructor every startPosition must be Object with keys: 'x', 'y'`);
    }
    if (!data.every(obj => Number.isInteger(obj.startPosition.x) && Number.isInteger(obj.startPosition.y))) {
      throw Error(`Field.constructor every startPosition must have Integer value on keys: 'x', 'y'`);
    }
    if (!data.every(obj => obj.field[obj.startPosition.x][obj.startPosition.y] === 0)) {
      throw Error(`Field.constructor every startPosition must point to a 0 on field`);
    }
    // endPosition
    if (!data.every(obj => typeof obj.endPosition === 'object' && obj.endPosition !== null && !Array.isArray(obj.endPosition))) {
      throw Error(`Field.constructor every endPosition must be Object`);
    }
    if (!data.every(obj => ['x', 'y'].every(prop => Object.prototype.hasOwnProperty.call(obj.endPosition, prop)))) {
      throw Error(`Field.constructor every endPosition must be Object with keys: 'x', 'y'`);
    }
    if (!data.every(obj => Number.isInteger(obj.endPosition.x) && Number.isInteger(obj.endPosition.y))) {
      throw Error(`Field.constructor every endPosition must have Integer value on keys: 'x', 'y'`);
    }
    if (!data.every(obj => obj.field[obj.endPosition.x][obj.endPosition.y] === 0)) {
      throw Error(`Field.constructor every endPosition must point to a 0 on field`);
    }
    // winPath
    if (!data.every(obj => Array.isArray(obj.winPath))) {
      throw Error(`Field.constructor every winPath must be Array`)
    }
    if (!data.every(obj => obj.winPath.every(obj => typeof obj === 'object' && obj !== null && !Array.isArray(obj)))) {
      throw Error(`Field.constructor every winPath element must be Object`);
    }
    if (!data.every(obj => obj.winPath.every(obj => ['x', 'y'].every(prop => Object.prototype.hasOwnProperty.call(obj, prop))))) {
      throw Error(`Field.constructor every winPath element must be Object with keys: 'x', 'y'`);
    }
    if (!data.every(obj => obj.winPath.every(obj => Number.isInteger(obj.x) && Number.isInteger(obj.y)))) {
      throw Error(`Field.constructor every winPath element must have Integer value on keys: 'x', 'y'`);
    }
    const condition = data.every(obj => obj.winPath.every((cord, i) => {
      if (i === 0) {
        return obj.startPosition.x === cord.x && obj.startPosition.y  === cord.y;
      }
      if (i === obj.winPath.length - 1) {
        return obj.endPosition.x === cord.x && obj.endPosition.y  === cord.y;
      }
      return obj.field[cord.x][cord.y] === 0;
    }))
    if (!condition) {
      throw Error(`Field.constructor every winPath must store path from startPosition to endPosition`);
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
   * @method dataForGame
   * @memberof Maze#Field#
   * @description Returns Array of data for the [`Game class`]{@link Maze#Game}
   * @returns {Array} [field, start, end, time]
   * @example const data = this.dataForGame();
   */
  dataForGame() {
    const [field, start, end, time, winPath] = this.dataForCurrentLevel();
    winPath.forEach(item => {
      if (field[item.x][item.y] === 0) {
        field[item.x][item.y] = '#';
      }
    });
    field[start.x][start.y] = '^@';
    field[end.x][end.y] = '$';
    return [field, start, end, time];
  }
  /**
   * @method render
   * @memberof Maze#Field#
   * @param {Array} gameField this is Matrix that filled with 1, 0, '$', '@', '*', '#', '#@', '#*'
   * (1 is wall, 0 is available cell for move, '@' is player, '*' is cell which player have visited, 
   * '#' is hint cell(all these cells show path to finish), '$' is finish, '$@' player at finish position, 
   * '^@' player at start position, '#@' player at hint cell, '#*' players path at hint cell)
   * @param {Boolean} isPath if value is true than it shows player path from start position
   * @param {Boolean} isHint if value is true than it shows path from start position to finish
   * @description Returns field with players path or hint or both
   * @throws Error - if `gameField` is not Array
   * @throws Error - if `gameField` is not 2D Array
   * @throws Error - if every element of `gameField` is not 1, 0, '*', '$', '@', '#', '^', '^@', '$@', '#@', '#*'
   * @throws Error - if `isPath` is not Boolean
   * @throws Error - if `isHint` is not Boolean
   * @returns {Array} Array
   * @example 
   * const gameField = [
   *  [1, '^',     1,  1],
   *  [1, '#*', '#@',  1],
   *  [1,  *,   '#',   1].
   *  [1, '$',  '#',   1]
   * ]
   * const field = this.render(gameField, true, true) // will generate field with hint path and players path
   */
  render(gameField, isPath, isHint) {
    if (!Array.isArray(gameField)) {
      throw Error(`Field.render(gameField, isPath, isHint) gameField must be Array`);
    }
    if (!gameField.every(arr => Array.isArray(arr))) {
      throw Error(`Field.render(gameField, isPath, isHint) gameField must be 2D Array`);
    }
    if (!gameField.every(arr => arr.every(item => [1, 0, '*', '$', '@', '#', '^', '^@', '$@', '#@', '#*'].includes(item)))) {
      throw Error(`Field.render(gameField, isPath, isHint) gameField every element must be: 1, 0, '*', '$', '@', '#', '^', '^@', '$@', '#@', '#*'`);
    }
    if (typeof isPath !== 'boolean') {
      throw Error(`Field.render(gameField, isPath, isHint) isPath must be Boolean`);
    }
    if (typeof isHint !== 'boolean') {
      throw Error(`Field.render(gameField, isPath, isHint) isHint must be Boolean`);
    }
    return gameField.map((arr, i) => {
      return arr.map((item, j) => {
        const obj =  {
          x: i,
          y: j,
          class: ''
        };
        if (item === 1) {
          obj.class = 'block';
        }
        if (item === 0) {
          obj.class = 'empty';
        }
        if (item === '^') {
          obj.class = 'startPosition';
        }
        if (item === '^@') {
          obj.class = 'startPosition player';
        }
        if (item === '@' || item === '#@') {
          obj.class = 'empty player';
        }
        if (item === '$') {
          obj.class = 'endPosition';
        }
        if (item === '$@') {
          obj.class = 'endPosition player';
        }
        if (item === '*' || item === '#*') {
          obj.class = isPath ? 'empty path' : 'empty';
        }
        if (item === '#') {
          obj.class = isHint ? 'empty hint' : 'empty'
        }
        return obj;
      })
    })
  }

  /**
   * @method dataForCurrentLevel
   * @memberof Maze#Field#
   * @description Returns Array of data for current level
   * @returns {Array} [field, startPosition, endPosition, time, winPath]
   * @example const data = this.dataForGame();
   */
  dataForCurrentLevel() {
    const curentLevel = this.data.find(obj => obj.level === this.level);
    const fieldCopy = curentLevel.field.map(arr => arr.slice());
    const winPath = curentLevel.winPath.map(obj => obj);
    const start = curentLevel.startPosition;
    const end = curentLevel.endPosition;
    const time = curentLevel.time;
    return [fieldCopy, start, end, time, winPath];
  }

  /**
   * @method changeLevel
   * @memberof Maze#Field#
   * @param {Number} value this is step 
   * @description Changes level, returns `true` in case of success, otherwise `false`
   * @throws Error - if `value` is not Integer
   * @returns {undefined} undefined
   * @example this.changeLevel(1)
   */
  changeLevel(value) {
    if (!Number.isInteger(value)) {
      throw Error(`Field.changeLevel(value) value must be Integer`);
    }
    const levels = this.data.map(obj => obj.level);
    if (levels.includes(value)) {
      this.level = value;
      return true;
    }
    return false;
  }

  /**
   * @method amountOfLevels
   * @memberof Maze#Field#
   * @description Returns amount of levels
   * @returns {Number} Number
   * @example const levels = this.amountOfLevels
   */
  get amountOfLevels() {
    return this.data.length;
  }
}