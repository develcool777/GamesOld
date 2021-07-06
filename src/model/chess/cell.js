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
    // let selectedCell = false;
    // let lastMoveOldPosition = false;
    // let lastMoveNewPosition = false;
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
          if (typeof value !== 'string') {
            throw Error(`Cell.isAvailableFor.set(value) value must be String`);
          }
          if (!['', 'move', 'kill'].includes(value)) {
            throw Error(`Cell.isAvailableFor.set(value) value must be '' or 'move' or 'kill'`);
          }
          isAvailableFor = value;
        }
      },

      // selectedCell: {
      //   get: () => selectedCell,
      //   set: (value) => {
      //     if (figure === null) {
      //       throw Error(`Cell.selectedCell.set(value) there is no figure on this cell`);
      //     }
      //     if (typeof value !== 'boolean') {
      //       throw Error(`Cell.selectedCell.set(value) value must be Boolean`);
      //     }
      //     selectedCell = value;
      //   } 
      // },

      // lastMoveOldPosition: {
      //   get: () => lastMoveOldPosition,
      //   set: (value) => {
      //     if (typeof value !== 'boolean') {
      //       throw Error(`Cell.lastMoveOldPosition.set(value) value must be Boolean`);
      //     }
      //     lastMoveOldPosition = value;
      //   } 
      // },

      // lastMoveNewPosition: {
      //   get: () => lastMoveNewPosition,
      //   set: (value) => {
      //     if (typeof value !== 'boolean') {
      //       throw Error(`Cell.lastMoveNewPosition.set(value) value must be Boolean`);
      //     }
      //     lastMoveNewPosition = value;
      //   } 
      // },

    })
  }
}