export default class Knight {
  constructor(color, position) {
    if (typeof color !== 'string') {
      throw Error(`Knight.constructor color must be String`);
    }
    if (Object.keys(position).join('') !== 'xy') {
      throw Error(`Knight.constructor position must be Object with keys x and y`);
    }
    const name = 'Knight';
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

    const check = (x, y) => {
      if (field[x][y].figure !== null) {
        if (field[x][y].figure.color !== this.color) { availableKills.push({x, y}) }
        return;
      }
      availableMoves.push({x, y});
    }

    //  ##
    //  #
    //  #
    if (this.position.x - 2 >= 0 && this.position.y + 1 < field.length) {
      check(this.position.x - 2, this.position.y + 1);
    }

    // ##
    //  #
    //  #
    if (this.position.x - 2 >= 0 && this.position.y - 1 >= 0) {
      check(this.position.x - 2, this.position.y - 1);
    }

    //  #
    //  #
    // ##
    if (this.position.x + 2 < field.length && this.position.y - 1 >= 0) {
      check(this.position.x + 2, this.position.y - 1);
    }

    //  #
    //  #
    //  ##
    if (this.position.x + 2 < field.length && this.position.y + 1 < field.length) {
      check(this.position.x + 2, this.position.y + 1);
    }

    //    #
    //    ###
    if (this.position.x + 1 < field.length && this.position.y + 2 < field.length) {
      check(this.position.x + 1, this.position.y + 2);
    }

    //    #
    //  ###
    if (this.position.x + 1 < field.length && this.position.y - 2 >= 0) {
      check(this.position.x + 1, this.position.y - 2);
    }

    //    ###
    //    #
    if (this.position.x - 1 >= 0 && this.position.y + 2 < field.length) {
      check(this.position.x - 1, this.position.y + 2);
    }

    //  ###
    //    #
    if (this.position.x - 1 >=0 && this.position.y - 2 >= 0) {
      check(this.position.x - 1, this.position.y - 2);
    }

    return [availableMoves, availableKills] 
  }

  makeMove(cordinates, field) {
    const moves = this.available(field).flat();
    const isMoveAvailable = moves.some((obj) => obj.x === cordinates[0] && obj.y === cordinates[1]);

    if (!isMoveAvailable) {
      return console.log('wrong move Knight');
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