export default class Cell {
// module.exports = class Cell {
  constructor(color) {
    if (typeof color !== 'string') {
      throw Error(`Cell.constructor color must be String`);
    }
    let figure = null;
    Object.defineProperties(this, {
      color: {
        get: () => color 
      },
      figure: {
        get: () => figure,
        set: (value) => {
          figure = value;
        }
      }
    })
  }
}