export default class Rook {
  constructor(color, position) {
    if (typeof color !== 'string') {
      throw Error(`Rook.constructor color must be String`);
    }
    if (Object.keys(position).join('') !== 'xy') {
      throw Error(`Rook.constructor position must be Object with keys x and y`);
    }
    const name = 'Rook';
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

    // up 
    const currentPositionUp = Object.assign({}, this.position);
    for (let i = currentPositionUp.x; i > 0; i--) {
      const condition = field[currentPositionUp.x - 1][currentPositionUp.y].figure;
      currentPositionUp.x -= 1;
      if (condition !== null) { 
        if (condition.color !== this.color) { availableKills.push({...currentPositionUp}) }
        break;
      } 
      availableMoves.push({...currentPositionUp});
    }

    // down
    const currentPositionDown = Object.assign({}, this.position);
    for (let i = currentPositionDown.x; i < field.length - 1; i++) {
      const condition = field[currentPositionDown.x + 1][currentPositionDown.y].figure;
      currentPositionDown.x += 1;
      if (condition !== null) { 
        if (condition.color !== this.color) { availableKills.push({...currentPositionDown}) }
        break;
      } 
      availableMoves.push({...currentPositionDown});
    }

    // left
    const currentPositionLeft = Object.assign({}, this.position);
    for (let i = currentPositionLeft.y; i > 0; i--) {
      const condition = field[currentPositionLeft.x][currentPositionLeft.y - 1].figure;
      currentPositionLeft.y -= 1;
      if (condition !== null) { 
        if (condition.color !== this.color) { availableKills.push({...currentPositionLeft}) }
        break;
      } 
      availableMoves.push({...currentPositionLeft});
    }

    // right
    const currentPositionRight = Object.assign({}, this.position);
    for (let i = currentPositionRight.y; i < field.length - 1; i++) {
      const condition = field[currentPositionRight.x][currentPositionRight.y + 1].figure;
      currentPositionRight.y += 1;
      if (condition !== null) { 
        if (condition.color !== this.color) { availableKills.push({...currentPositionRight}) }
        break;
      } 
      availableMoves.push({...currentPositionRight});
    }

    return [availableMoves, availableKills] 
  }

  move(cordinates, field) {
    const moves = this.available(field).flat();
    const isMoveAvailable = moves.some((obj) => obj.x === cordinates[0] && obj.y === cordinates[1]);

    if (isMoveAvailable) {
      const old = field[ this.position.x ][ this.position.y ].figure;
      field[ this.position.x ][ this.position.y ].figure = null;
      this.position.x = cordinates[0];
      this.position.y = cordinates[1];
      field[ this.position.x ][ this.position.y ].figure = old;
    }
    else {
      console.log('wrong move Rook');
    }
  }
}