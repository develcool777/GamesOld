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
    if (!Object.keys(dL).every(key => Object.keys(dL[+key]).join(' ') === 'time cards' ) ) {
      throw Error(`Field.constructor every level must contain keys: time cards`);
    }
    if (!Object.keys(dL).every(key => Number.isInteger(dL[+key].time))) {
      throw Error(`Field.constructor every time must be Integer`);
    }
    if (!Object.keys(dL).every(key => Array.isArray(dL[+key].cards))) {
      throw Error(`Field.constructor cards must be Array`);
    }
    if (!Object.keys(dL).every(key => dL[+key].cards.every(item => typeof item === 'string'))) {
      throw Error(`Field.constructor every element in arrayOfCards must be typeof string`);
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
      getCards: {
        get: () => (data) => data.Levels[level].cards
      },
      getTime: {
        get: () => (data) => data.Levels[level].time
      },
      getLevels: {
        get: () => (data) => Object.keys(data.Levels)
      }
    })
    Object.freeze(this);
  }
  log() {
    console.log({CurrentLevel: this.level});
  }
  
  getCardsForGame() {
    const clone = JSON.parse(JSON.stringify(this.data));
    const result = this.getCards(clone);
    return result; 
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
  amountOfLevels() {
    const levels = this.getLevels(this.data);
    return levels.length;
  }
}