import Cell from "./cell";
import Snake from "./snake";
import Food from "./food"

export default class Game {
  constructor(width, height) {
    const snakeSpeed = 25;
    const field = [];
    const snakeInstance = new Snake(width, height);
    const foodInstance = new Food(width, height, snakeInstance.body);
    let lastRenderTime = 0;
    let requestID;
    Object.defineProperties(this, {
      snakeSpeed: {
        get: () => snakeSpeed
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
      },

      requestID: {
        get: () => requestID,
        set: (value) => {
          requestID = value;
        }
      },

      lastRenderTime: {
        get: () => lastRenderTime,
        set: (value) => {
          lastRenderTime = value;
        }
      }
    });
  }

  get log() {
    return console.log({
      width: this.width,
      height: this,height,
      field: this.field,
      snakeInstance: this.snakeInstance,
      foodInstance: this.foodInstance,
      snakeSpeed: this.snakeSpeed,
      requestID: this.requestID,
      lastRenderTime: this.lastRenderTime
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
    const status = this.snakeInstance.move(this.foodInstance.position);
    this.field.forEach(row => row.forEach(cell => cell.hasSnakePart = false))
    this.snakeInstance.body.forEach(pos => this.field[pos.x][pos.y].hasSnakePart = true); 

    if (status === 'moved') return;
    
    if (status === 'moved and ate') {
      const posOld = this.foodInstance.position;
      this.field[posOld.x][posOld.y].food = false;
      this.foodInstance.generatePosition();
      const posNew = this.foodInstance.position;
      this.field[posNew.x][posNew.y].food = true;
    }
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

  gameLoop(currentTime) {
    this.requestID = window.requestAnimationFrame(() => this.gameLoop(Date.now()));
    const secondsSinceLastRender = (currentTime - this.lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1 / this.snakeSpeed ) return;
    this.updateSnakePosition();
    this.lastRenderTime = currentTime;
  }

  gameControl() {
    window.addEventListener('keyup', (event) => {
      this.keyPressed(event);
    })
  }
}