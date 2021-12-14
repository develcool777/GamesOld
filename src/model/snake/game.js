import Cell from "./cell";
import Snake from "./snake";
import Walls from "./walls";
import Apple from "./apple";
import Cookie from "./cookie";

export default class Game {
  constructor(width=0, height=0) {
    if (!Number.isInteger(width)) {
      throw Error(`Game.constructor(width=0, height=0) width must be Integer`);
    }
    if (!Number.isInteger(height)) {
      throw Error(`Game.constructor(width=0, height=0) height must be Integer`);
    }

    const snakeSpeed = 10;
    const snakeInstance = new Snake(width, height);
    const appleInstance = new Apple(width, height, snakeInstance.body);
    const cookieInstance = new Cookie(width, height, snakeInstance.body);
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

      appleInstance: {
        get: () => appleInstance
      },

      cookieInstance: {
        get: () => cookieInstance
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
      appleInstance: this.appleInstance,
      cookieInstance: this.cookieInstance,
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
    this.addApple();
  }

  startGame() {
    if (this.gameStatus === 'start') return;
    this.requestID = window.requestAnimationFrame(() => this.gameLoop(Date.now()));
    window.addEventListener('keyup', this.eventHandler);
    this.cookieInstance.isPositionExist && this.cookieInstance.startTimer();
    this.gameStatus = 'start';
  }

  stopGame() {
    if (this.gameStatus === 'stop') return;
    window.cancelAnimationFrame(this.requestID);
    window.removeEventListener('keyup', this.eventHandler);
    this.cookieInstance.isPositionExist && this.cookieInstance.stopTimer();
    this.gameStatus = 'stop';
  }

  finishGame() {
    if (this.gameStatus === '') return;
    this.clear();
    this.init();
  }

  clear() {
    window.cancelAnimationFrame(this.requestID);
    window.removeEventListener('keyup', this.eventHandler);
    this.gameStatus = '';
    this.fieldForRender = [];
    this.allCells = [];
    this.direction = 'left';
    this.score = 0;
    this.lastRenderTime = 0;
    this.snakeInstance.clear();
    this.appleInstance.clear();
    this.cookieInstance.clear();
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

  addApple() {
    const wallsPos = this.wallsInstance.positions;
    const cookiePos = this.cookieInstance.position;
    this.appleInstance.generatePosition(this.allCells, wallsPos, cookiePos);
    const guidingLines = this.appleInstance.generateGuidingLines(this.wallsInstance.positions, cookiePos);
    // apple position
    const pos = this.appleInstance.position;
    this.fieldForRender[pos.x][pos.y].cellContain = 'apple';
    // Guiding lines
    guidingLines.forEach(pos => {
      this.fieldForRender[pos.x][pos.y].isGuidingLine = true;
    });
  }

  addCookie() {
    const wallsPos = this.wallsInstance.positions;
    const applePos = this.appleInstance.position;
    this.cookieInstance.generatePosition(this.allCells, wallsPos, applePos);
    // cookie position
    const pos = this.cookieInstance.position;
    this.fieldForRender[pos.x][pos.y].cellContain = 'cookie';
    // startTimer 
    this.cookieInstance.startTimer();
  }

  addWall() {
    const applePos = this.appleInstance.position;
    const cookiePos = this.cookieInstance.position;
    this.wallsInstance.generatePosition(this.allCells, applePos, cookiePos);
    this.wallsInstance.positions.forEach(pos => {
      this.fieldForRender[pos.x][pos.y].cellContain = 'wall';
    });
  }

  update() {
    const applePos = this.appleInstance.position;
    const cookiePos = this.cookieInstance.position;
    const wallsPos = this.wallsInstance.positions;

    const status = this.snakeInstance.move(applePos, cookiePos, wallsPos, this.direction);

    if (status === 'hit itself' || status === 'hit wall') {
      window.cancelAnimationFrame(this.requestID);
      window.removeEventListener('keyup', this.eventHandler);
      this.cookieInstance.stopTimer();
      return;
    }

    this.clearFieldForRender(status);
    this.addSnake();

    if (status === 'moved and ate apple') {
      const apples = ++this.appleInstance.amountOfEatenApples;
      this.score++;
      apples % 2 === 0 && this.addWall();
      apples % 5 === 0 && this.addCookie();
      this.addApple();
    }

    if (status === 'moved and ate cookie') {
      this.score += this.cookieInstance.removeCookie();
    }
  }

  clearFieldForRender(status='') {
    if (typeof status !== 'string') {
      throw Error(`Game.clearFieldForRender(status='') status must be String`);
    }

    this.fieldForRender.forEach(row => row.forEach(cell => {
      const appleCond = status === 'moved and ate apple' && cell.cellContain === 'apple';
      const cookieCond = status === 'moved and ate cookie' && cell.cellContain === 'cookie'
        || !this.cookieInstance.isPositionExist && cell.cellContain === 'cookie'
      const snakeCond = ['head', 'body', 'tail'].includes(cell.cellContain);
      const empty = cell.cellContain === '';
      cell.cellContain = appleCond || cookieCond || snakeCond || empty
        ? ''
        : cell.cellContain

      cell.isGuidingLine = cell.isGuidingLine && status === 'moved and ate apple' 
        ? false 
        : cell.isGuidingLine

      cell.adjustSnakeBodyOnTurn = '';
      cell.rotationAngle = null;
    }));
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
    if (!Number.isInteger(currentTime)) {
      throw Error(`Game.gameLoop(currentTime) currentTime must be Integer`);
    }
    
    this.requestID = window.requestAnimationFrame(() => this.gameLoop(Date.now()));
    const secondsSinceLastRender = (currentTime - this.lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1 / this.snakeSpeed ) return;
    this.update();
    this.lastRenderTime = currentTime;
  }
}