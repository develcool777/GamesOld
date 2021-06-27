export default class Queen {
  constructor(color, position) {
    if (typeof color !== 'string') {
      throw Error(`Queen.constructor color must be String`);
    }
    if (Object.keys(position).join('') !== 'xy') {
      throw Error(`Queen.constructor position must be Object with keys x and y`);
    }
    const name = 'Queen';
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
      console.log('wrong move Queen');
    }
  }
}