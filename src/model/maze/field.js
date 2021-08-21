export default class Field {
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
      throw Error(`Field.constructor every winPath item element must be Object with props: 'x', 'y'`);
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

  get log() {
    return console.log({CurrentLevel: this.level, data: this.data});
  }

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

  dataForGame() {
    const curentLevel = this.data.find(obj => obj.level === this.level);
    const fieldCopy = curentLevel.field.map(arr => arr.slice());
    const start = curentLevel.startPosition;
    const end = curentLevel.endPosition;
    return [fieldCopy, start, end];
  }

  time() {
    return this.data.find(obj => obj.level === this.level).time;
  }

  changeLevel(value) {
    if (Math.abs(value) !== 1) {
      throw Error(`Field.changeLevel(value) value must be 1 or -1`)
    }
    const levels = this.data.map(obj => obj.level);
    if (levels.includes(this.level + value)) {
      this.level += value;
    }
  }

  amountOfLevels() {
    return this.data.length;
  }
}