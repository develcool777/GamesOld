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
    if (!Object.keys(dL).every(key => Object.keys(dL[+key]).join(' ') === 'time field' ) ) {
      throw Error(`Field.constructor every level must contain keys: time, field`);
    }
    if (!Object.keys(dL).every(key => Object.keys(dL[+key].time).join(' ') === 'str seconds' ) ) {
      throw Error(`Field.constructor every time must contain keys: str, seconds`);
    }
    if (!Object.keys(dL).every(key => Array.isArray(dL[+key].field) && dL[+key].field.every(item => Array.isArray(item))) ) {
      throw Error(`Field.constructor every field must be Matrix`);
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
    })
    Object.freeze(this);
  }
  log() {
    console.log({CurrentLevel: this.level});
  }
  generateFieldForDraw() {
    const clone = JSON.parse(JSON.stringify(this.data));
    const field = this.getField(clone);
    const fieldForDraw = field.map((arr) => {
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
          obj.class = 'startPosition player';
        }
        if (item === '') {
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
    const startPosition = {};
    const endPosition = {};
    field.forEach((arr, i) => {
      arr.forEach((item, j) => {
        if (item === '@') {
          startPosition.x = i;
          startPosition.y = j;
        }
        if (item === '') {
          endPosition.x = i;
          endPosition.y = j;
        }
      })
    })
    return [field, startPosition, endPosition];
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