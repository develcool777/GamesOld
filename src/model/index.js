const Game = require('./game');
const Player = require('./player');


// const p = new Player(0,0);
// p.log
// p.moveDown();
// p.log
// p.moveLeft();
// p.log
// p.moveRight();
// p.log
// p.moveUp();
// p.log

const f = [
  [0, 1, 0],
  [0, 0, 0],
  [1, 0, 1]
];

const finish = {
  x: 0,
  y: 2
}
const start = {
  x: 0,
  y: 0
}
const g = new Game(f, start, finish); 
g.init();
g.clean();
g.log()