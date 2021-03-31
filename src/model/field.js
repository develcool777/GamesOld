// module.exports = class Field {
export default class Field {
  constructor(data) {
    if (typeof data !== 'object') {
      throw Error(`Field.constructor data must be Object`);
    }
    if (Object.keys(data)[0] !== 'Levels') { 
      throw Error(`Field.constructor data.keys must be String named 'Levels'`);
    }
    const dL = data.Levels;
    if (Object.keys(dL).some(item => isNaN(item) || !Number.isInteger(+item))) { 
      throw Error(`Field.constructor data.keys must be Number`);
    }
    if (!Object.keys(dL).every(key => Object.keys(dL[+key]).join(' ') === 'time startPosition endPosition field' ) ) {
      throw Error(`Field.constructor every level must contain keys: time field startPosition endPosition`);
    }
    if (!Object.keys(dL).every(key => Number.isInteger(dL[+key].time))) {
      throw Error(`Field.constructor every time must be Integer`);
    }
    if (!Object.keys(dL).every(key => Object.keys(dL[+key].startPosition).join(' ') === 'x y')) {
      throw Error(`Field.constructor every startPosition must contain keys: x, y`);
    }
    if (!Object.keys(dL).every(key => Object.keys(dL[+key].endPosition).join(' ') === 'x y')) {
      throw Error(`Field.constructor every endPosition must contain keys: x, y`);
    }
    if (!Object.keys(dL).every(key => Array.isArray(dL[+key].field) && dL[+key].field.every(item => Array.isArray(item)))) {
      throw Error(`Field.constructor every field must be Matrix`);
    }
    const cheak = Object.keys(dL).every(key => {
      const array = dL[+key].field.flat();
      const test = array.filter(item => item === 0 || item === 1);
      return array.length === test.length;
    });
    if (!cheak) {
      throw Error(`Field.constructor every field must be contain elements: 1 and 0`);
    }
    const cheak2 = Object.keys(dL).every(key => {
      const start = Object.values(dL[+key].startPosition);
      const end = Object.values(dL[+key].endPosition);
      const cheakStart = start.every(item => Number.isInteger(item) && item >= 0 && item <= dL[+key].field.length);
      const cheakEnd = end.every(item => Number.isInteger(item) && item >= 0 && item <= dL[+key].field.length);
      return cheakStart && cheakEnd;
    })
    if (!cheak2) {
      throw Error(`Field.constructor every startPosition and endPosition keys(x, y) must be Integers in range of field`)
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
      getField: {
        get: () => (data) => data.Levels[level].field
      },
      getTime: {
        get: () => (data) => data.Levels[level].time
      },
      getStart: {
        get: () => (data) => data.Levels[level].startPosition
      },
      getEnd: {
        get: () => (data) => data.Levels[level].endPosition
      }
    })
    Object.freeze(this);
  }
  log() {
    console.log({CurrentLevel: this.level});
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
          obj.class = 'startPosition player';
        }
        if (end.x === i && end.y === j) {
          obj.class = 'winPosition';
        }
        return obj;
      })
    })
    return fieldForDraw;
  }

  dataForGame() {
    const clone = JSON.parse(JSON.stringify(this.data));
    const field = this.getField(clone);
    const start = this.getStart(clone);
    const end = this.getEnd(clone);
    return [field, start, end];
  }

  time() {
    const clone = JSON.parse(JSON.stringify(this.data));
    const result = this.getTime(clone);
    return result;
  }

  changeLevel(value) {
    const levels = Object.keys(this.data.Levels);
    if (levels.map(Number).includes(this.level + value)) {
      this.level += value;
    }
  }
}