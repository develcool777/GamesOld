export default class Cell {
  constructor(color) {
    if (typeof color !== 'string') {
      throw Error(`Cell.constructor color must be String`);
    }
    let figure = null;
    let isAvailableFor = '';
    Object.defineProperties(this, {
      color: {
        get: () => color 
      },
      figure: {
        get: () => figure,
        set: (value) => {
          figure = value;
        }
      },
      isAvailableFor: {
        get: () => isAvailableFor,
        set: (value) => {
          if (typeof value !== 'string') {
            throw Error(`Cell.isAvailableFor.set(value) value must be String`);
          }
          if (!['', 'move', 'kill'].includes(value)) {
            throw Error(`Cell.isAvailableFor.set(value) value must be '' or 'move' or 'kill'`);
          }
          isAvailableFor = value;
        }
      }
    })
  }
}