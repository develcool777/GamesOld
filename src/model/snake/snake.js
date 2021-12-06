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
      body: this.body
    })
  }

  addPart(obj) {
    this.body.push(obj);
  }

  move() {
    const left = this.head.y - 1 < 0 && this.direction === 'left';
    const up = this.head.x - 1 < 0 && this.direction === 'up';
    const right = this.head.y + 1 === this.fieldSize.width && this.direction === 'right';
    const down = this.head.x + 1 === this.fieldSize.height && this.direction === 'down';

    if (left || up || right || down) {
      return false;
    }

    const dictionary = {
      up: -1,
      down: 1,
      left: -1,
      right: 1
    }
    const tail = this.body.pop();
    const func = (a, b) => [a, b].includes(this.direction) ? dictionary[this.direction] : 0
    const newHeadX = this.head.x + func('up', 'down');
    const newHeadY = this.head.y + func('left', 'right'); 
    this.body.unshift({ x: newHeadX, y: newHeadY });
    return true;
  }
}