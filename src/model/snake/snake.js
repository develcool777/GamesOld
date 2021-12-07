export default class Snake {
  constructor(width, height) {
    const fieldSize = { width, height }
    const body = [
      { x: 10, y: 20 },
      { x: 10, y: 21 },
      { x: 10, y: 22 },
    ];
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

  move(foodPosition) {
    const left = this.head.y - 1 < 0 && this.direction === 'left';
    const up = this.head.x - 1 < 0 && this.direction === 'up';
    const right = this.head.y + 1 === this.fieldSize.width && this.direction === 'right';
    const down = this.head.x + 1 === this.fieldSize.height && this.direction === 'down';

    let wall = left || up || right || down 
      ? this.direction
      : ''

    const moves = {
      up: -1,
      down: 1,
      left: -1,
      right: 1,
    }

    const walls = {
      up: this.fieldSize.height - 1,
      down: 0,
      left: this.fieldSize.width - 1,
      right: 0
    }

    const tail = this.body.pop();
    const func = (a, b, headPos) => headPos + ([a, b].includes(this.direction) ? moves[this.direction] : 0);
    const func2 = (a, b, headPos) => [a, b].includes(wall) ? walls[wall] : headPos;
    const newHeadX = wall === '' 
      ? func('up', 'down', this.head.x)
      : func2('up', 'down', this.head.x);
    const newHeadY = wall === '' 
      ? func('left', 'right', this.head.y)
      : func2('left', 'right', this.head.y); 

    this.body.unshift({ x: newHeadX, y: newHeadY });

    // food
    if (this.head.x !== foodPosition.x || this.head.y !== foodPosition.y) return 'moved';
    this.body.push(tail);
    return 'moved and ate';
  }
}