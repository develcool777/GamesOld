export default class King {
  constructor(color, position) {
    if (typeof color !== 'string') {
      throw Error(`King.constructor color must be String`);
    }
    if (Object.keys(position).join('') !== 'xy') {
      throw Error(`king.constructor position must be Object with keys x and y`);
    }
    const name = 'King';
    let firstMove = true;
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
            throw Error(`King.firstMove.set() value must be Boolean`);
          }
          firstMove = value;
        }
      }
    })
  }

  available(field) {
    const availableMoves = [];
    const availableKills = [];
    
    const check = (x=0, y=0) => {
      if (field[x] === undefined || field[x][y] === undefined) { return }
      if (field[x][y].figure !== null) {
        if (field[x][y].figure.color !== this.color) { availableKills.push({x, y}) }
        return;
      }
      availableMoves.push({x, y})
    }

    const moves = [
      {x: -1, y: 0}, {x: 1, y: 0}, // up down
      {x: 0, y: 1}, {x: 0, y: -1}, // left right
      {x: 1, y: 1}, {x: 1, y: -1}, // downRight downLeft
      {x: -1, y: 1}, {x: -1, y: -1} // upRight upLeft
    ];

    moves.forEach(move => {
      console.log(move);
      check(this.position.x + move.x, this.position.y + move.y)
    })

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
      if (this.firstMove) {
        this.firstMove = false;
      }
    }
    else {
      console.log('wrong move King');
    }
  }
}