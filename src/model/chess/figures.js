export default class Figures {
  constructor() {}

  check(field, x=0, y=0, position={}, available={}, xray=false) {
    position.x = x;
    position.y = y;
    if (field[x][y].figure !== null) {
      if (field[x][y].figure.color === this.color) {
        available.cover.push({...position})
        return true;
      }
      if (field[x][y].figure.name === 'King') {
        available.check.push({...position})
        return false; // xray for king to see what it does delete this line and make some check and available king moves 
      } 
      available.kill.push({...position});
      return xray ? false : true; /// enable WH(xray) change to false 
    }
    available.move.push({...position});
    return false;
  }

  makeMove(cordinates, field, figure) {
    const moves = Object.values(this.available(field)).flat();
    const isMoveAvailable = moves.some((obj) => obj.x === cordinates[0] && obj.y === cordinates[1]);

    if (!isMoveAvailable) {
      return console.log(`wrong move ${figure.name}`);
    }

    this.moveFigure(field, figure, ...cordinates);
  }

  moveFigure(field, figure, x, y) {
    const old = field[ figure.position.x ][ figure.position.y ].figure;
    field[ figure.position.x ][ figure.position.y ].figure = null;
    figure.position.x = x;
    figure.position.y = y;
    field[ figure.position.x ][ figure.position.y ].figure = old;
  }
   
  clearWayToKing(available) {
    if (available.check.length === 0) {
      available.wayToKing = [];
    }
  }

  fillWayToKing(available, position) {
    if (available.check.length === 0) { 
      available.wayToKing.push({...position}) 
    }
  }
}