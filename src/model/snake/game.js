import Cell from "./cell";
import Snake from "./snake";
import Food from "./food";
import Walls from "./walls";

export default class Game {
  constructor(width, height) {
    const snakeSpeed = 10;
    const fieldForRender = [];
    const allCells = [];
    const snakeInstance = new Snake(width, height);
    const foodInstance = new Food(width, height, snakeInstance.body);
    const wallsInstance = new Walls(width, height, snakeInstance.body);
    let lastRenderTime = 0;
    let requestID;
    let direction = 'left';
    let score = 0;
    Object.defineProperties(this, {
      snakeSpeed: {
        get: () => snakeSpeed
      },

      fieldForRender: {
        get: () => fieldForRender,
        set: (value) => {
          if (!Array.isArray(value)) {
            throw Error(`Game.fieldForRender.set(value) value must be Array`);
          }
          fieldForRender = value;
        }
      },

      direction: {
        get: () => direction,
        set: (value) => {
          if (typeof direction !== 'string') {
            throw Error(`Game.direction.set(value) value must be String`);
          }
          if (!['right', 'left', 'up', 'down', ''].includes(value)) {
            throw Error(`Game.direction.set(value) value must be 'right', 'left', 'up', 'down', ''`);
          }
          direction = value;
        }
      },

      score: {
        get: () => score,
        set: (value) => {
          if (!Number.isInteger(value)) {
            throw Error(`Game.score.set(value) value must be Integer`);
          }
          score = value;
        }
      },

      allCells: {
        get: () => allCells
      },

      snakeInstance: {
        get: () => snakeInstance
      },

      foodInstance: {
        get: () => foodInstance
      },

      wallsInstance: {
        get: () => wallsInstance
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
      fieldForRender: this.fieldForRender,
      snakeInstance: this.snakeInstance,
      foodInstance: this.foodInstance,
      wallsInstance: this.wallsInstance,
      requestID: this.requestID,
      lastRenderTime: this.lastRenderTime,
      direction: this.direction,
      score: this.score
    });
  }

  init() {
    this.createFieldForRender();
    this.addSnake();
    this.addFood();
  }

  createFieldForRender() {
    if (this.fieldForRender.length !== 0) {
      throw Error(`Game.createField() fieldForRender alredy created`);
    }

    for (let i = 0; i < this.height; i++) {
      const row = [];
      for (let j = 0; j < this.width; j++) {
        this.allCells.push({x: i, y: j})
        row.push(new Cell(i, j));
      }
      this.fieldForRender.push(row);
    }
  }

  addSnake() {
    this.snakeInstance.adjustBody();
    this.snakeInstance.body.forEach((pos, i) => {
      this.fieldForRender[pos.x][pos.y].cellContain = i === 0
        ? 'head'
        : i === this.snakeInstance.body.length - 1
          ? 'tail'
          : 'body'

      if (this.snakeInstance.adjustSnakeBodyOnTurn.length === 0) return;

      const borderRadius = this.snakeInstance.adjustSnakeBodyOnTurn.find(obj => obj.x === pos.x && obj.y === pos.y)?.borderRadius;
      this.fieldForRender[pos.x][pos.y].adjustSnakeBodyOnTurn = borderRadius || '';
    });
  }

  addFood() {
    this.foodInstance.generatePosition(this.allCells, this.wallsInstance.positions);
    this.foodInstance.generateGuidingLines(this.wallsInstance.positions);
    // food position
    const pos = this.foodInstance.position;
    this.fieldForRender[pos.x][pos.y].cellContain = 'food';

    // Guiding lines
    this.foodInstance.guidingLines.forEach(pos => {
      this.fieldForRender[pos.x][pos.y].isGuidingLine = true;
    });
  }

  addWall() {
    this.wallsInstance.generatePosition(this.allCells, this.foodInstance.position);
    this.wallsInstance.positions.forEach(pos => {
      this.fieldForRender[pos.x][pos.y].cellContain = 'wall';
    });
  }

  updateSnakePosition() {
    const status = this.snakeInstance.move(this.foodInstance.position, this.wallsInstance.positions, this.direction);

    if (status === 'hit itself' || status === 'hit wall') return window.cancelAnimationFrame(this.requestID);

    this.fieldForRender.forEach(row => row.forEach(cell => {
      const foodCond = status === 'moved and ate' && cell.cellContain === 'food';
      const snakeCond = ['head', 'body', 'tail'].includes(cell.cellContain);
      const empty = cell.cellContain === '';
      cell.cellContain = foodCond || snakeCond || empty
        ? ''
        : cell.cellContain

      cell.isGuidingLine = cell.isGuidingLine && status === 'moved and ate' 
        ? false 
        : cell.isGuidingLine

      cell.adjustSnakeBodyOnTurn = '';
    }));

    this.addSnake();

    if (status === 'moved and ate') {
      this.score++;
      this.score % 2 === 0 && this.addWall();
      this.addFood();
    }
  }

  keyPressed(event) {
    switch (event.keyCode) {
      case 37:
        if (this.snakeInstance.direction === 'right') break;
        this.direction = 'left';
        break;

      case 38:
        if (this.snakeInstance.direction === 'down') break;
        this.direction = 'up';
        break;

      case 39:
        if (this.snakeInstance.direction === 'left') break;
        this.direction = 'right';
        break;

      case 40:
        if (this.snakeInstance.direction === 'up') break;
        this.direction = 'down';
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