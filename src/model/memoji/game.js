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

  shuffleCards(arr) {
    arr.sort(() => 0.5 - Math.random());
  }

  cardsForDraw() {
    return this.cardsData
  }

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

  checkWin() {
    return this.cardsData.every(item => item.isMatch === true);
  }

  clickOnCard(card) {
    this.cardsData[card.id].isFlipped = true;
  }

  reset(card) {
    this.cardsData[card.id].isFlipped = null;
    this.cardsData[card.id].isMatch = null;
  }

  clean() {
    this.shuffleCards(this.cardsData);
    this.cardsData = this.cardsData.map((card, i) => {
      card.id = i;
      card.isFlipped = null;
      card.isMatch = null;
      return card;
    })
  }

  showOrHideHint(boolean) {
    this.cardsData = this.cardsData.map(card => {
      const value = boolean ? true : card.isMatch ? true : null;
      card.isFlipped = value;
      return card;
    })
  }
}