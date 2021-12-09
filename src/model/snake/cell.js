export default class Cell {
  constructor(x, y) {
    const position = { x, y };
    let cellContain = '';
    let isGuidingLine = false;
    let adjustSnakeBodyOnTurn = '';
    Object.defineProperties(this, {
      position: {
        get: () => position
      },

      cellContain: {
        get: () => cellContain,
        set: (value) => {
          if (typeof value !== 'string') {
            throw Error(`Cell.cellContain.set(value) value must be String`);
          }
          if (!['body', 'tail', 'head', 'food', 'wall', ''].includes(value)) {
            throw Error(`Cell.cellContain.set(value) value must be 'body', 'tail', 'head', 'food', 'wall', ''`);
          }
          cellContain = value
        }
      },

      isGuidingLine: {
        get: () => isGuidingLine,
        set: (value) => {
          if (typeof value !== 'boolean') {
            throw Error(`Cell.isGuidingLine.set(value) value must be Boolean`);
          }
          isGuidingLine = value;
        }
      },

      adjustSnakeBodyOnTurn: {
        get: () => adjustSnakeBodyOnTurn,
        set: (value) => {
          if (typeof value !== 'string') {
            throw Error(`Cell.adjustSnakeBodyOnTurn.set(value) value must be String`);
          }
          if (!['top-left', 'top-right', 'bottom-left', 'bottom-right', ''].includes(value)) {
            throw Error(`Cell.adjustSnakeBodyOnTurn.set(value) value must be 'top-left', 'top-right', 'bottom-left', 'bottom-right', ''`);
          }
          adjustSnakeBodyOnTurn = value;
        } 
      }
    });
  }
}