export default class Cell {
  constructor(color, position) {
    if (typeof color !== 'string') {
      throw Error(`Cell.constructor color must be String`);
    }
    if (Object.keys(position).join('') !== 'xy') {
      throw Error(`Cell.constructor position must be Object with keys x and y`);
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

      position: {
        get: () => position
      },

      isAvailableFor: {
        get: () => isAvailableFor,
        set: (value) => {
          // console.log({value});
          if (typeof value !== 'string') {
            throw Error(`Cell.isAvailableFor.set(value) value must be String`);
          }
          if (!['', 'move', 'kill', 'castle', 'promotion', 'check', 'wayToKing'].includes(value)) {
            throw Error(`Cell.isAvailableFor.set(value) value must be '' or 'move' or 'kill' or 'castle' or 'promotion' or 'check' or 'wayToKing'`);
          }
          isAvailableFor = value;
        }
      }
    })
  }
}