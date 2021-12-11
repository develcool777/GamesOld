import Cell from "./cell";
import Snake from "./snake";
import Food from "./food";
import Walls from "./walls";

export default class Game {
  constructor(width, height) {
    const snakeSpeed = 10;
    const snakeInstance = new Snake(width, height);
    const foodInstance = new Food(width, height, snakeInstance.body);
    const wallsInstance = new Walls(width, height, snakeInstance.body);
    let fieldForRender = [];
    let allCells = [];
    let lastRenderTime = 0;
    let requestID;
    let direction = 'left';
    let score = 0;
    let gameStatus = '';
    this.eventHandler = this.keyPressed.bind(this);
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
          if (!['right', 'left', 'up', 'down'].includes(value)) {
            throw Error(`Game.direction.set(value) value must be 'right', 'left', 'up', 'down'`);
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

      gameStatus: {
        get: () => gameStatus,
        set: (value) => {
          if (typeof value !== 'string') {
            throw Error(`Game.gameStatus.set(value) value must be String`);
          }
          if (!['', 'start', 'stop'].includes(value)) {
            throw Error(`Game.gameStatus.set(value) value must be '', 'start', 'stop'`);
          }
          gameStatus = value;
        } 
      },

      allCells: {
        get: () => allCells,
        set: (value) => {
          if (!Array.isArray(value)) {
            throw Error(`Game.allCells.set(value) value must be Array`);
          }
          allCells = value;
        }
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
      score: this.score,
      gameStatus: this.gameStatus
    });
  }

  init() {
    this.createFieldForRender();
    this.snakeInstance.generateSnake();
    this.addSnake();
    this.addFood();
  }

  startGame() {
    if (this.gameStatus === 'start') return;
    this.requestID = window.requestAnimationFrame(() => this.gameLoop(Date.now()));
    this.gameStatus = 'start';
    window.addEventListener('keyup', this.eventHandler);
  }

  stopGame() {
    if (this.gameStatus === 'stop') return;
    window.cancelAnimationFrame(this.requestID);
    this.gameStatus = 'stop';
    window.removeEventListener('keyup', this.eventHandler);
  }

  finishGame() {
    if (this.gameStatus === '') return;
    this.clear();
    this.init();
  }

  clear() {
    if (this.gameStatus === '') return;
    window.cancelAnimationFrame(this.requestID);
    window.removeEventListener('keyup', this.eventHandler);
    this.gameStatus = '';
    this.fieldForRender = [];
    this.allCells = [];
    this.direction = 'left';
    this.score = 0;
    this.lastRenderTime = 0;
    this.snakeInstance.clear();
    this.foodInstance.clear();
    this.wallsInstance.clear();
  }

  createFieldForRender() {
    if (this.fieldForRender.length !== 0) {
      throw Error(`Game.createField() fieldForRender alredy created`);
    }

    for (let x = 0; x < this.height; x++) {
      const row = [];
      for (let y = 0; y < this.width; y++) {
        this.allCells.push({ x, y })
        row.push(new Cell(x, y));
      }
      this.fieldForRender.push(row);
    }
  }

  addSnake() {
    const adjustSnakeBodyOnTurn = this.snakeInstance.adjustBody();
    this.snakeInstance.body.forEach((pos, i) => {
      const cell = this.fieldForRender[pos.x][pos.y];

      if (i === 0) {
        cell.rotationAngle = this.snakeInstance.rotateHead();
        cell.cellContain = 'head';
      }
      else if (i === this.snakeInstance.body.length - 1) {
        cell.rotationAngle = this.snakeInstance.rotateTail();
        cell.cellContain = 'tail';
      }
      else {
        cell.cellContain = 'body';
      }

      if (adjustSnakeBodyOnTurn.length === 0) return;

      const borderRadius = adjustSnakeBodyOnTurn.find(obj => obj.x === pos.x && obj.y === pos.y)?.borderRadius;
      cell.adjustSnakeBodyOnTurn = borderRadius || '';
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
      cell.rotationAngle = null;
    }));

    this.addSnake();

    if (status === 'moved and ate') {
      this.score++;
      this.score % 2 === 0 && this.addWall();
      this.addFood();
    }
  }

  keyPressed(event) {
    console.log(event, this);
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
}