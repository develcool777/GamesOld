export default class Snake {
  constructor(width=0, height=0) {
    if (!Number.isInteger(width)) {
      throw Error(`Snake.constructor(width=0, height=0) width must be Integer`);
    }
    if (!Number.isInteger(height)) {
      throw Error(`Snake.constructor(width=0, height=0) height must be Integer`);
    }

    const fieldSize = { width, height }
    let body = [];
    let direction = 'left';

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
      head: this.head,
      tail: this.tail,
      body: this.body,
      fieldSize: this.fieldSize
    })
  }

  clear() {
    this.direction = 'left';
    this.body = [];
  }

  generateSnake() {
    if (this.body.length !== 0) {
      throw Error(`Snake.generateSnake() body already created`);
    }

    const centerX = Math.floor(this.fieldSize.height / 2);
    const centerY = Math.floor(this.fieldSize.width / 2);

    this.body.push(
      { x: centerX, y: centerY }, // head
      { x: centerX, y: centerY + 1 }, // neck
      { x: centerX, y: centerY + 2 }, // tail
    )
  }

  move(applePosition={}, cookiePosition={}, wallsPosition=[], direction='') {
    if (typeof applePosition !== 'object' || applePosition === null || Array.isArray(applePosition)) {
      throw Error(`Snake.move(applePosition={}, cookiePosition={}, wallsPosition=[], direction='') applePosition must be Object`);
    }
    if (typeof cookiePosition !== 'object' || cookiePosition === null || Array.isArray(cookiePosition)) {
      throw Error(`Snake.move(applePosition={}, cookiePosition={}, wallsPosition=[], direction='') cookiePosition must be Object`);
    }
    if (!Array.isArray(wallsPosition)) {
      throw Error(`Snake.move(applePosition={}, cookiePosition={}, wallsPosition=[], direction='') wallsPosition must be Array`);
    }
    if (typeof direction !== 'string') {
      throw Error(`Snake.move(applePosition={}, cookiePosition={}, wallsPosition=[], direction='') direction must be String`);
    }
    if (!['left', 'right', 'up', 'down'].includes(direction)) {
      throw Error(`Snake.move(applePosition={}, cookiePosition={}, wallsPosition=[], direction='') direction must be 'left', 'right', 'up', 'down'`);
    }

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

    // moved
    this.body.unshift({ x: newHeadX, y: newHeadY });

    // apple
    if (newHeadX === applePosition.x && newHeadY === applePosition.y) {
      this.body.push(tail);
      return 'moved and ate apple';
    }

    // cookie
    if (newHeadX === cookiePosition.x && newHeadY === cookiePosition.y) {
      this.body.push(tail);
      return 'moved and ate cookie';
    }

    return 'moved';
  }

  getAngleForRotation(direction='') {
    if (typeof direction !== 'string') {
      throw Error(`Snake.getAngleForRotation(direction='') direction must be String`);
    }
    if (!['left', 'right', 'up', 'down'].includes(direction)) {
      throw Error(`Snake.getAngleForRotation(direction='') direction must be 'left', 'right', 'up', 'down'`);
    }

    switch (direction) {
      case 'left': return 0;
      case 'right': return 180;
      case 'up': return 90;
      case 'down': return -90;
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

    const x = Math.abs(beforeTail.x - this.tail.x) <= 1
      ? beforeTail.x - this.tail.x
      : (beforeTail.x - this.fieldSize.height + this.tail.x) * (beforeTail.x === 0 ? -1 : 1) 

    const y = Math.abs(beforeTail.y - this.tail.y) <= 1
      ? beforeTail.y - this.tail.y
      : (beforeTail.y - this.fieldSize.width + this.tail.y) * (beforeTail.y === 0 ? -1 : 1)
   
    for (const key in coords) {
      if (coords[key].x === x && coords[key].y === y) return this.getAngleForRotation(key);
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

    const checkMatching = (diff, current) => {
      const x = Math.abs(diff.x - current.x) === 1
        ? diff.x - current.x
        : Math.abs(this.fieldSize.height - current.x) === 1
          ? this.fieldSize.height - current.x
          : diff.x - this.fieldSize.height

      const y = Math.abs(diff.y - current.y) === 1
        ? diff.y - current.y
        : Math.abs(this.fieldSize.width - current.y) === 1
          ? this.fieldSize.width - current.y
          : diff.y - this.fieldSize.width
      
      for (let key in matching) {
        if (matching[key].x === x && matching[key].y === y) return key;
      }

      return false;
    }

    return this.body.reduce((acc, current, i) => {
      if (i === 0 || i === this.body.length - 1) return acc;

      const diff = difference(this.body[i - 1], current, this.body[i + 1])
      if (!diff) return acc;

      const key = checkMatching(diff, current)
      key && acc.push({ x: current.x, y: current.y, borderRadius: key });

      return acc;
    }, []);
  }
}