import Cell from "./cell";
import Snake from "./snake";
import Food from "./food"

export default class Game {
  constructor(width, height) {
    const FPS = 60;
    const field = [];
    const snakeInstance = new Snake(width, height);
    const foodInstance = new Food(width, height, snakeInstance.body);
    Object.defineProperties(this, {
      FPS: {
        get: () => FPS
      },
      field: {
        get: () => field,
        set: (value) => {
          if (!Array.isArray(value)) {
            throw Error(`Game.field.set(value) value must be Array`);
          }
          field = value;
        }
      },

      snakeInstance: {
        get: () => snakeInstance
      },

      foodInstance: {
        get: () => foodInstance
      },

      width: {
        get: () => width
      },

      height: {
        get: () => height
      }
    });
  }

  get log() {
    return console.log({
      field: this.field,
      snakeInstance: this.snakeInstance
    });
  }

  init() {
    this.createField();
    this.addSnake();
    this.addFood();
  }

  createField() {
    if (this.field.length !== 0) {
      throw Error(`Game.createField() field alredy created`);
    }

    for (let i = 0; i < this.height; i++) {
      const row = [];
      for (let j = 0; j < this.width; j++) {
        row.push(new Cell(i, j));
      }
      this.field.push(row);
    }
  }

  addSnake() {
    this.snakeInstance.body.forEach(pos => this.field[pos.x][pos.y].hasSnakePart = true);
  }

  addFood() {
    this.foodInstance.generateAllCells();
    this.foodInstance.generatePosition();
    const pos = this.foodInstance.position;
    this.field[pos.x][pos.y].food = true;
  }

  updateSnakePosition() {
    const isMoved = this.snakeInstance.move();
    this.field.forEach(row => row.forEach(cell => cell.hasSnakePart = false))
    this.snakeInstance.body.forEach(pos => this.field[pos.x][pos.y].hasSnakePart = true); 
    return isMoved;
  }

  keyPressed(event) {
    switch (event.keyCode) {
      case 37:
        if (this.snakeInstance.direction === 'right') break;
        this.snakeInstance.direction = 'left'
        break;

      case 38:
        if (this.snakeInstance.direction === 'down') break;
        this.snakeInstance.direction = 'up'
        break;

      case 39:
        if (this.snakeInstance.direction === 'left') break;
        this.snakeInstance.direction = 'right'
        break;

      case 40:
        if (this.snakeInstance.direction === 'up') break;
        this.snakeInstance.direction = 'down'
        break;
    
      default: break;
    }
  }

  gameLoop() {
    const interval = setInterval(() => {
      const isMoved = this.updateSnakePosition();
      !isMoved && clearInterval(interval)
    }, Math.floor(1000 / 15));
  }

  gameControl() {
    window.addEventListener('keyup', (event) => {
      this.keyPressed(event);
    })
  }
}