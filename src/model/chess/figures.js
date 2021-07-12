export default class Figures {
  constructor() {}

  check(field, x=0, y=0, position={}, available={}) {
    position.x = x;
    position.y = y;
    if (field[x][y].figure !== null) {
      if (field[x][y].figure.color !== this.color) { 
        // if (field[x][y].figure.name === 'King') {
        //   available.check.push({...position})
        //   return;
        // }
        available.kill.push({...position})
      }
      return true;
    }
    available.move.push({...position});
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
}