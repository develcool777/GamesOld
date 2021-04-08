const Game = require('./game');
const Player = require('./player');
const Field = require('./field');
const data = require('./../maps/dataForMaze.json');


const f = new Field(data);
const fData = f.dataForGame();



// const f = [
//   [0, 1, 0],
//   [0, 0, 0],
//   [1, 0, 1]
// ];

// const finish = {
//   x: 0,
//   y: 2
// }
// const start = {
//   x: 0,
//   y: 0
// }
// const g = new Game(f, start, finish); 
// g.init();
// g.clean();
// g.log()
