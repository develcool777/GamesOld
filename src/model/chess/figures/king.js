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
      check(this.position.x + move.x, this.position.y + move.y)
    })

    // if this is not King first move 
    if (!this.firstMove) {
      return [availableMoves, availableKills];
    }

    // castle 
    const availableCastles = this.availableCastle(field);
    return [availableMoves, availableKills, availableCastles]; 
  }

  availableCastle(field) {
    const result = []
    const movesShort = [1, 2];
    const movesLong = [-1, -2, -3];
    if (this.checkCastle(field, movesShort, movesShort.length)) {
      result.push({x: this.position.x, y: 6});
    }
    if (this.checkCastle(field, movesLong, movesLong.length)) {
      result.push({x: this.position.x, y: 2}); 
    }
    return result;
  }

  checkCastle(field, moves, countEmpty) {
    const emptyCells = moves.reduce((acc, y) => {
      if (field[this.position.x][this.position.y + y].figure === null) {
        acc++; 
      }
      return acc
    }, 0);

    if (emptyCells !== countEmpty) {
      return false;
    }

    const figure = field[this.position.x][this.position.y + moves[0] * (countEmpty + 1)].figure
    if (figure.name !== 'Rook') {
      return false;
    }

    if (!figure.firstMove) {
      return false;
    }
    return true;
  }

  makeCastle(cordinates, field) {
    const castles = this.availableCastle(field);
    const isCastleAvailable = castles.some((obj) => obj.x === cordinates[0] && obj.y === cordinates[1]);

    if (!isCastleAvailable) { return }

    // determine where is rook
    const sign = cordinates[1] > this.position.y ? 1 : -2;
    const rook = field[cordinates[0]][cordinates[1] + sign].figure;
    const newRookPosition = sign < 0 ? [cordinates[0], 3] : [cordinates[0], 5];

    this.moveFigure(field, rook, ...newRookPosition);
    this.moveFigure(field, this, ...cordinates);
    this.firstMove = false;
    rook.firstMove = false;
  }

  makeMove(cordinates, field) {
    const moves = this.available(field).flat();
    const isMoveAvailable = moves.some((obj) => obj.x === cordinates[0] && obj.y === cordinates[1]);

    if (!isMoveAvailable) {
      return console.log('wrong move King');
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