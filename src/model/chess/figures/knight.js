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

  // available(field) {
  //   const availableMoves = [];
  //   const availableKills = [];

    // if (this.position.x - 2 >= 0 && this.position.y + 1 < 8) {
      
    // }
    // if (convertedCell[0] - 2 >= 0 && convertedCell[1] - 1 >= 0) {
    //   moves++;
    // }
    

  //   return [availableMoves, availableKills] 
  // }

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