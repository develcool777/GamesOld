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
    const Path = [];
    let stop = false;
    Object.defineProperties(this, {
      matrix: {
        get: () => matrix
      },
      queue: {
        get: () => Queue
      },
      path: {
        get: () => Path
      },
      endPos: {
        get: () => endPosition
      },
      startPos: {
        get: () => startPosition
      },
      stop: {
        get: () => stop,
        set: (value) => {
          stop = value;
        } 
      }
    })
  }
  findPath() {
    this.queue.push(this.startPos);
    while(true) {
      console.log(this.queue);
      let currentPosition = this.queue.pop();
      console.log({currentPosition});
      this.makeMove('up', ...currentPosition);
      this.makeMove('down', currentPosition);
      this.makeMove('left', currentPosition);
      this.makeMove('right', currentPosition);
      if (this.stop) {
        break
      }
    }
  }
  makeMove(whereToGo='', position={}) {
    const obj = position
    if (whereToGo === 'up') {
      obj.x--;
      if (obj.x === this.endPos.x && obj.y === this.endPos.y) {
        this.stop = true;
        return console.log('Final');
      }
      if (this.checkMove(obj)) {
        this.queue.push();
      }
    }
    if (whereToGo === 'down') {
      obj.x++;
      if (obj.x === this.endPos.x && obj.y === this.endPos.y) {
        this.stop = true;
        return console.log('Final');
      }
      if (this.checkMove(obj)) {
        this.queue.push();
      }
    }
    if (whereToGo === 'left') {
      obj.y--;
      if (obj.x === this.endPos.x && obj.y === this.endPos.y) {
        this.stop = true;
        return console.log('Final');
      }
      if (this.checkMove(obj)) {
        this.queue.push();
      }
    }
    if (whereToGo === 'right') {
      obj.y++;
      if (obj.x === this.endPos.x && obj.y === this.endPos.y) {
        this.stop = true;
        return console.log('Final');
      }
      if (this.checkMove(obj)) {
        this.queue.push();
      }
    }
  }
  checkMove(move={}) {
    console.log(move);
    if (this.matrix[move.x][move.y] === undefined) {
      return false;
    }
    if (this.matrix[move.x][move.y] === 1) {
      return false;
    }
    return true;
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
p.findPath();