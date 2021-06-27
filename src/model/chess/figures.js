export default class Figures {
  constructor(side) {
    if (typeof side !== 'string') {
      throw Error(`Figures.constructor side must be String`);
    }
    Object.defineProperties(this, {
      side: {
        get: () => side
      }
    })
  }
}