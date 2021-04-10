class PathFinder {
  constructor(matrix, startPosition, endPosition) {
    if (!Array.isArray(matrix)) {
      throw Error(`PathFinder.constructor matrix must be Array`);
    }
    if (!matrix.every(arr => Array.isArray(arr))) {
      throw Error(`PathFinder.constructor matrix must be 2D Array`);
    }
    if (!Object.keys(startPosition).join('') === 'xy' ) {
      throw Error(`PathFinder.constructor startPosition must contain 'x' and 'y'`);
    }
    if (!Object.values(startPosition).every(item => Number.isInteger(item) && item >= 0)) {
      throw Error(`PathFinder.constructor startPosition.x and startPosition.y must be positive Integers`);
    }
    if (!Object.keys(endPosition).join('') === 'xy' ) {
      throw Error(`PathFinder.constructor endPosition must contain 'x' and 'y'`);
    }
    if (!Object.values(endPosition).every(item => Number.isInteger(item) && item >= 0)) {
      throw Error(`PathFinder.constructor endPosition.x and endPosition.y must be positive Integers`);
    }
    if (!matrix.flat() === matrix.flat().filter(item => item === 0 || item === 1)) {
      throw Error(`PathFinder.constructor matrix must contain elements: 1 and 0`);
    }
    const Queue = [];
    Object.defineProperties(this, {
      matrix: {
        get: () => matrix
      },
      queue: {
        get: () => Queue
      },
      endPos: {
        get: () => endPosition
      },
      startPos: {
        get: () => startPosition
      }
    })
  }
  
}

const mat = [
  [0, 1, 1],
  [0, 0, 0],
  [1, 1, 0]
];

const s = {
  x: 0,
  y: 0
}

const e = {
  x: 2,
  y: 2
}
const p = new PathFinder(mat, s, e);