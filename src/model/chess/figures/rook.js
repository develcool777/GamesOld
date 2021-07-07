export default class Rook {
  constructor(color, position) {
    if (typeof color !== 'string') {
      throw Error(`Rook.constructor color must be String`);
    }
    if (Object.keys(position).join('') !== 'xy') {
      throw Error(`Rook.constructor position must be Object with keys x and y`);
    }
    const name = 'Rook';
    let firstMove = true
    Object.defineProperties(this, {
      color: {
        get: () => color
      },
      position: {
        get: () => position
      },
      name: {
        get: () => name
      },
      firstMove: {
        get: () => firstMove,
        set: (value) => {
          if (typeof value !== 'boolean') {
            throw Error(`Rook.firstMove.set() value must be Boolean`);
          }
          firstMove = value;
        }
      }
    })
  }

  available(field) {
    const availableMoves = [];
    const availableKills = [];

    const check = (x=0, y=0, position) => {
      position.x = x;
      position.y = y;
      if (field[x][y].figure !== null) {
        if (field[x][y].figure.color !== this.color) { availableKills.push({...position}) }
        return true;
      }
      availableMoves.push({...position})
    }

    // up 
    const currentPositionUp = Object.assign({}, this.position);
    for (let i = currentPositionUp.x; i > 0; i--) {
      if (check(currentPositionUp.x - 1, currentPositionUp.y, currentPositionUp)) {
        break;
      }
    }

    // down
    const currentPositionDown = Object.assign({}, this.position);
    for (let i = currentPositionDown.x; i < field.length - 1; i++) {
      if (check(currentPositionDown.x + 1, currentPositionDown.y, currentPositionDown)) {
        break;
      }
    }

    // left
    const currentPositionLeft = Object.assign({}, this.position);
    for (let i = currentPositionLeft.y; i > 0; i--) {
      if (check(currentPositionLeft.x, currentPositionLeft.y - 1, currentPositionLeft)) {
        break;
      }
    }

    // right
    const currentPositionRight = Object.assign({}, this.position);
    for (let i = currentPositionRight.y; i < field.length - 1; i++) {
      if (check(currentPositionRight.x, currentPositionRight.y + 1, currentPositionRight)) {
        break;
      }
    }
    
    return [availableMoves, availableKills] 
  }

  makeMove(cordinates, field) {
    const moves = this.available(field).flat();
    const isMoveAvailable = moves.some((obj) => obj.x === cordinates[0] && obj.y === cordinates[1]);

    if (!isMoveAvailable) {
      return console.log('wrong move Rook');
    }

    this.moveFigure(field, this, ...cordinates);

    if (this.firstMove) {
      this.firstMove = false;
    }
  }

  moveFigure(field, figure, x, y) {
    const old = field[ figure.position.x ][ figure.position.y ].figure;
    field[ figure.position.x ][ figure.position.y ].figure = null;
    figure.position.x = x;
    figure.position.y = y;
    field[ figure.position.x ][ figure.position.y ].figure = old;
  } 
}