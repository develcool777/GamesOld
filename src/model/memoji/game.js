export default class Game {
  constructor(arrayOfCards) {
    if (!Array.isArray(arrayOfCards)) {
      throw Error(`Game.constructor arrayOfCards must be Array`);
    }
    if (!arrayOfCards.every(item => typeof item === 'string')) {
      throw Error(`Game.constructor every element in arrayOfCards must be typeof string`);
    }
    let cardsData = []
    Object.defineProperties(this, {
      cards: {
        get: () => arrayOfCards
      },
      cardsData: {
        get: () => cardsData,
        set: (arr) => {
          cardsData = arr;
        }
      }
    })
  }

  log() {
    console.log({cards: this.cards, cardsData: this.cardsData});
  }

  setCardData() {
    const arr = []
    const doubled = this.doubleCards();
    this.shuffleCards(doubled);
    doubled.forEach((item, i) => {
      const obj = {
        id: i,
        name: item,
        class: `ec ec-${item} img`,
        isMatch: false,
        isFliped: false
      }
      arr.push(obj);
    })
    this.cardsData = arr;
  }

  doubleCards() {
    return this.cards.concat(this.cards);
  }

  shuffleCards(arr) {
    arr.sort(() => 0.5 - Math.random());
  }

  cardsForDraw() {
    return this.cardsData
  }

  changeMatch(id, boolean) {
    this.cardsData[id].isMatch = boolean;
  }

  checkMatch(obj1, obj2) {
    console.log({obj1, obj2});
    if (obj1.name === obj2.name) {
      this.changeMatch(obj1.id, true);
      this.changeMatch(obj2.id, true);
      return true;
    }
    return false;
  }
}