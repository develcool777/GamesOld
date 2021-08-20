export default class Field {
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

  get log() {
    return console.log({CurrentLevel: this.level, data: this.data});
  }
  
  getCardsForGame() {
    return this.data.find(obj => obj.level === this.level).cards;
  }

  time() {
    return this.data.find(obj => obj.level === this.level).time;
  }

  changeLevel(value) {
    const levels = this.data.map(obj => obj.level);
    if (levels.includes(this.level + value)) {
      this.level += value;
    }
  }
  amountOfLevels() {
    return this.data.length;
  }
}