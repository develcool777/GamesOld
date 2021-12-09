export default class Snake {
  constructor(width, height) {
    const fieldSize = { width, height }
    const body = [
      { x: 10, y: 20 },
      { x: 10, y: 21 },
      { x: 10, y: 22 },
    ];
    let direction = 'left';
    let adjustSnakeBodyOnTurn = [];
    Object.defineProperties(this, {
      body: {
        get: () => body,
        set: (value) => {
          if (!Array.isArray(value)) {
            throw Error(`Snake.body.set(value) value must be Array`);
          }
          body = value;
        }
      },

      direction: {
        get: () => direction,
        set: (value) => {
          if (typeof direction !== 'string') {
            throw Error(`Snake.direction.set(value) value must be String`);
          }
          if (!['right', 'left', 'up', 'down'].includes(value)) {
            throw Error(`Snake.direction.set(value) value must be 'right', 'left', 'up', 'down'`);
          }
          direction = value;
        }
      },

      adjustSnakeBodyOnTurn: {
        get: () => adjustSnakeBodyOnTurn,
        set: (value) => {
          if (!Array.isArray(value)) {
            throw Error(`Snake.adjustSnakeBodyOnTurn.set(value) value must be Array`);
          }
          adjustSnakeBodyOnTurn = value
        }
      },

      head: {
        get: () => body[0]
      },

      tail: {
        get: () => body[body.length - 1]
      },

      fieldSize: {
        get: () => fieldSize
      }
    });
  }

  get log() { 
    return console.log({
      direction: this.direction,
      lastDirection: this.lastDirection,
      adjustSnakeBodyOnTurn: this.adjustSnakeBodyOnTurn,
      head: this.head,
      tail: this.tail,
      body: this.body,
      fieldSize: this.fieldSize
    })
  }

  move(foodPosition={}, wallsPosition=[], direction='') {
    this.direction = direction;

    const moves = {
      up: -1,
      down: 1,
      left: -1,
      right: 1,
    }

    const borders = {
      up: this.fieldSize.height - 1,
      down: 0,
      left: this.fieldSize.width - 1,
      right: 0
    }

    const func = (a, b, headPos) => headPos + ([a, b].includes(this.direction) ? moves[this.direction] : 0);
    const func2 = (a, b, headPos) => [a, b].includes(border) ? borders[border] : headPos;

    // crossing borders
    const left = this.head.y - 1 < 0 && this.direction === 'left';
    const up = this.head.x - 1 < 0 && this.direction === 'up';
    const right = this.head.y + 1 === this.fieldSize.width && this.direction === 'right';
    const down = this.head.x + 1 === this.fieldSize.height && this.direction === 'down';

    let border = left || up || right || down 
      ? this.direction
      : ''

    const tail = this.body.pop();
    const newHeadX = border === '' 
      ? func('up', 'down', this.head.x)
      : func2('up', 'down', this.head.x);
    const newHeadY = border === '' 
      ? func('left', 'right', this.head.y)
      : func2('left', 'right', this.head.y); 

    // hit itself
    if (this.body.some(pos => pos.x === newHeadX && pos.y === newHeadY)) return 'hit itself';

    // hit wall
    if (wallsPosition.some(pos => pos.x === newHeadX && pos.y === newHeadY)) return 'hit wall';

    // move
    this.body.unshift({ x: newHeadX, y: newHeadY });

    // food
    if (this.head.x !== foodPosition.x || this.head.y !== foodPosition.y) return 'moved';
    this.body.push(tail);
    return 'moved and ate';
  }

  getAngleForRotation(direction) {
    switch (direction) {
      case 'left': return 0;
      case 'right': return 180;
      case 'up': return 90;
      case 'down': return -90;
      default: return null;
    }
  }

  rotateHead() {
    return this.getAngleForRotation(this.direction);
  }

  rotateTail() {
    const beforeTail = this.body[this.body.length - 2];
    const coords = {
      up: { x: -1, y: 0 },
      down: { x: 1, y: 0 },
      left: { x: 0, y: -1 },
      right: { x: 0, y: 1 },
    }

    for (const key in coords) {
      const x = this.tail.x + coords[key].x;
      const y = this.tail.y + coords[key].y;
      if (beforeTail.x === x && beforeTail.y === y) return this.getAngleForRotation(key);
    }
  }

  adjustBody() {
    const matching = {
      'top-left': { x: 1, y: 1 },
      'top-right': { x: 1, y: -1 },
      'bottom-left': { x: -1, y: 1 },
      'bottom-right': { x: -1, y: -1 }
    }

    const difference = (prev, current, next) => {
      const prevDiff = prev.x !== current.x ? { x: prev.x } : { y: prev.y };
      const nextDiff = next.x !== current.x ? { x: next.x } : { y: next.y };

      return Object.keys(prevDiff)[0] === Object.keys(nextDiff)[0] 
        ? false
        : Object.assign({}, prevDiff, nextDiff)
    }

    this.adjustSnakeBodyOnTurn = this.body.reduce((acc, current, i) => {
      if (i === 0 || i === this.body.length - 1) return acc;

      const diff = difference(this.body[i - 1], current, this.body[i + 1])
      if (!diff) return acc;

      for (let key in matching) {
        if (matching[key].x === diff.x - current.x && matching[key].y === diff.y - current.y) {
          acc.push({ x: current.x, y: current.y, borderRadius: key });
          return acc;
        }
      }

      return acc; // return here if there is difference but diff.x - current.x and diff.y - current.y wont return -1 or 1. This happens when crossing border and part of the snake 'teleports' on this.fieldSize.width or this.fieldSize.height distance 
    }, []);
  }
}