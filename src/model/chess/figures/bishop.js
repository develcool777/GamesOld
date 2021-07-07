export default class Bishop {
  constructor(color, position) {
    if (typeof color !== 'string') {
      throw Error(`Bishop.constructor color must be String`);
    }
    if (Object.keys(position).join('') !== 'xy') {
      throw Error(`Bishop.constructor position must be Object with keys x and y`);
    }
    const name = 'Bishop';
    Object.defineProperties(this, {
      color: {
        get: () => color
      },
      position: {
        get: () => position
      },
      name: {
        get: () => name
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

    // upLeft 
    const currentPositionUpLeft = Object.assign({}, this.position);
    for (let i = this.position.x; i > 0 && currentPositionUpLeft.y > 0; i--) {
      if (check(currentPositionUpLeft.x - 1, currentPositionUpLeft.y - 1, currentPositionUpLeft)) {
        break
      }
    }

    // downLeft
    const currentPositionDownLeft = Object.assign({}, this.position);
    for (let i = currentPositionDownLeft.x; i < field.length - 1 && currentPositionDownLeft.y > 0; i++) {
      if (check(currentPositionDownLeft.x + 1, currentPositionDownLeft.y - 1, currentPositionDownLeft)) {
        break;
      }
    }

    // upRight
    const currentPositionUpRight = Object.assign({}, this.position);
    for (let i = currentPositionUpRight.x; i > 0 && currentPositionUpRight.y < field.length - 1; i--) {
      if (check(currentPositionUpRight.x - 1, currentPositionUpRight.y + 1, currentPositionUpRight)) {
        break;
      }
    }

    // downRight
    const currentPositionDownRight = Object.assign({}, this.position);
    for (let i = currentPositionDownRight.x; i < field.length - 1 && currentPositionDownRight.y < field.length - 1; i++) {
      if (check(currentPositionDownRight.x + 1, currentPositionDownRight.y + 1, currentPositionDownRight)) {
        break;
      }
    }
    
    return [availableMoves, availableKills] 
  }

  makeMove(cordinates, field) {
    const moves = this.available(field).flat();
    const isMoveAvailable = moves.some((obj) => obj.x === cordinates[0] && obj.y === cordinates[1]);

    if (!isMoveAvailable) {
      return console.log('wrong move Bishop');
    }

    this.moveFigure(field, this, ...cordinates);
  }

  moveFigure(field, figure, x, y) {
    const old = field[ figure.position.x ][ figure.position.y ].figure;
    field[ figure.position.x ][ figure.position.y ].figure = null;
    figure.position.x = x;
    figure.position.y = y;
    field[ figure.position.x ][ figure.position.y ].figure = old;
  } 
}