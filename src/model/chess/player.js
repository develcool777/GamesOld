export default class Player {
  constructor(side) {
    if (typeof side !== 'string') {
      throw Error(`Cell.constructor side must be String`);
    }
    Object.defineProperties(this, {
      side: {
        get: () => side 
      }
    })
  }
}