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

    // upLeft 
    const currentPositionUpLeft = Object.assign({}, this.position);
    for (let i = this.position.x; i > 0 && currentPositionUpLeft.y > 0; i--) {
      const condition = field[currentPositionUpLeft.x - 1][currentPositionUpLeft.y - 1].figure;
      currentPositionUpLeft.x -= 1;
      currentPositionUpLeft.y -= 1;
      if (condition !== null) { 
        if (condition.color !== this.color) { availableKills.push({...currentPositionUpLeft}) }
        break;
      } 
      availableMoves.push({...currentPositionUpLeft});
    }

    // downLeft
    const currentPositionDownLeft = Object.assign({}, this.position);
    for (let i = currentPositionDownLeft.x; i < field.length - 1 && currentPositionDownLeft.y > 0; i++) {
      const condition = field[currentPositionDownLeft.x + 1][currentPositionDownLeft.y - 1].figure;
      currentPositionDownLeft.x += 1;
      currentPositionDownLeft.y -= 1;
      if (condition !== null) { 
        if (condition.color !== this.color) { availableKills.push({...currentPositionDownLeft}) }
        break;
      } 
      availableMoves.push({...currentPositionDownLeft});
    }

    // upRight
    const currentPositionUpRight = Object.assign({}, this.position);
    for (let i = currentPositionUpRight.x; i > 0 && currentPositionUpRight.y < field.length - 1; i--) {
      const condition = field[currentPositionUpRight.x - 1][currentPositionUpRight.y + 1].figure;
      currentPositionUpRight.x -= 1;
      currentPositionUpRight.y += 1;
      if (condition !== null) { 
        if (condition.color !== this.color) { availableKills.push({...currentPositionUpRight}) }
        break;
      } 
      availableMoves.push({...currentPositionUpRight});
    }

    // downRight
    const currentPositionDownRight = Object.assign({}, this.position);
    for (let i = currentPositionDownRight.x; i < field.length - 1 && currentPositionDownRight.y < field.length - 1; i++) {
      const condition = field[currentPositionDownRight.x + 1][currentPositionDownRight.y + 1].figure;
      currentPositionDownRight.x += 1;
      currentPositionDownRight.y += 1;
      if (condition !== null) { 
        if (condition.color !== this.color) { availableKills.push({...currentPositionDownRight}) }
        break;
      } 
      availableMoves.push({...currentPositionDownRight});
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
      console.log('wrong move Bishop');
    }
  }
}