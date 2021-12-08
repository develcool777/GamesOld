import Cell from "./cell";
import Snake from "./snake";
import Food from "./food"

export default class Game {
  constructor(width, height) {
    const snakeSpeed = 10;
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
      snakeSpeed: this.snakeSpeed,
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
    this.foodInstance.generateAllCells();
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
    this.snakeInstance.body.forEach((pos, i) => {
      this.field[pos.x][pos.y].cellContain = i === 0
        ? 'head'
        : i === this.snakeInstance.body.length - 1
          ? 'tail'
          : 'body'

      if (this.snakeInstance.adjustSnakeBodyOnTurn.length === 0) return;

      const borderRadius = this.snakeInstance.adjustSnakeBodyOnTurn.find(obj => obj.x === pos.x && obj.y === pos.y)?.borderRadius;
      this.field[pos.x][pos.y].adjustSnakeBodyOnTurn = borderRadius || '';
    });
  }

  addFood() {
    this.foodInstance.generatePosition();
    this.foodInstance.generateGuidingLines();
    // food position
    const pos = this.foodInstance.position;
    this.field[pos.x][pos.y].cellContain = 'food';

    // Guiding lines
    this.foodInstance.guidingLines.forEach(pos => {
      this.field[pos.x][pos.y].isGuidingLine = true;
    });
  }

  updateSnakePosition() {
    const status = this.snakeInstance.move(this.foodInstance.position);

    if (status === 'hit itself') return window.cancelAnimationFrame(this.requestID);

    this.field.forEach(row => row.forEach(cell => {
      const foodCond = status === 'moved and ate' && cell.cellContain === 'food';
      const snakeCond = ['head', 'body', 'tail'].includes(cell.cellContain);
      const empty = cell.cellContain === '';
      cell.cellContain = foodCond || snakeCond || empty
        ? ''
        : 'food'
      cell.isGuidingLine = cell.isGuidingLine && status === 'moved and ate' 
        ? false 
        : cell.isGuidingLine
      cell.adjustSnakeBodyOnTurn = '';
    }));

    this.snakeInstance.adjustBody();
    this.addSnake();
    status === 'moved and ate' && this.addFood();
  }

  keyPressed(event) {
    switch (event.keyCode) {
      case 37:
        if (this.snakeInstance.lastDirection === 'right') break;
        this.snakeInstance.direction = 'left'
        break;

      case 38:
        if (this.snakeInstance.lastDirection === 'down') break;
        this.snakeInstance.direction = 'up'
        break;

      case 39:
        if (this.snakeInstance.lastDirection === 'left') break;
        this.snakeInstance.direction = 'right'
        break;

      case 40:
        if (this.snakeInstance.lastDirection === 'up') break;
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
    window.addEventListener('keyup', event => this.keyPressed(event));
  }
}