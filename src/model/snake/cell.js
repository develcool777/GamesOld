export default class Cell {
  constructor(x=0, y=0) {
    if (!Number.isInteger(x)) {
      throw Error(`Cell.constructor(x=0, y=0) x must be Integer`);
    }
    if (!Number.isInteger(y)) {
      throw Error(`Cell.constructor(x=0, y=0) y must be Integer`);
    }

    const position = { x, y };
    let cellContain = '';
    let isAppleGuidingLine = false;
    let isCookieGuidingLine = false;
    let adjustSnakeBodyOnTurn = '';
    let rotationAngle = null;

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
          if (!['body', 'tail', 'head', 'neck', 'apple', 'cookie', 'wall', ''].includes(value)) {
            throw Error(`Cell.cellContain.set(value) value must be 'body', 'tail', 'head', 'neck', 'apple', 'cookie', 'wall', ''`);
          }
          cellContain = value;
        }
      },

      isAppleGuidingLine: {
        get: () => isAppleGuidingLine,
        set: (value) => {
          if (typeof value !== 'boolean') {
            throw Error(`Cell.isAppleGuidingLine.set(value) value must be Boolean`);
          }
          isAppleGuidingLine = value;
        }
      },

      isCookieGuidingLine: {
        get: () => isCookieGuidingLine,
        set: (value) => {
          if (typeof value !== 'boolean') {
            throw Error(`Cell.isCookieGuidingLine.set(value) value must be Boolean`);
          }
          isCookieGuidingLine = value;
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
      },

      rotationAngle: {
        get: () => rotationAngle,
        set: (value) => {
          // if (!Number.isInteger(value)) {
          //   throw Error(`Cell.rotationAngle.set(value) value must be Integer`);
          // }
          rotationAngle = value;
        }
      }
    });
  }
}