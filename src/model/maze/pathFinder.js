// class PathFinder {
//   constructor(matrix, startPosition, endPosition) {
//     if (!Array.isArray(matrix)) {
//       throw Error(`PathFinder.constructor matrix must be Array`);
//     }
//     if (!matrix.every(arr => Array.isArray(arr))) {
//       throw Error(`PathFinder.constructor matrix must be 2D Array`);
//     }
//     if (!Object.keys(startPosition).join('') === 'xy' ) {
//       throw Error(`PathFinder.constructor startPosition must contain 'x' and 'y'`);
//     }
//     if (!Object.values(startPosition).every(item => Number.isInteger(item) && item >= 0)) {
//       throw Error(`PathFinder.constructor startPosition.x and startPosition.y must be positive Integers`);
//     }
//     if (!Object.keys(endPosition).join('') === 'xy' ) {
//       throw Error(`PathFinder.constructor endPosition must contain 'x' and 'y'`);
//     }
//     if (!Object.values(endPosition).every(item => Number.isInteger(item) && item >= 0)) {
//       throw Error(`PathFinder.constructor endPosition.x and endPosition.y must be positive Integers`);
//     }
//     if (!matrix.flat() === matrix.flat().filter(item => item === 0 || item === 1)) {
//       throw Error(`PathFinder.constructor matrix must contain elements: 1 and 0`);
//     }
//     const Queue = [];
//     const Path = [];
//     let stop = false;
//     Object.defineProperties(this, {
//       matrix: {
//         get: () => matrix
//       },
//       queue: {
//         get: () => Queue
//       },
//       path: {
//         get: () => Path
//       },
//       endPos: {
//         get: () => endPosition
//       },
//       startPos: {
//         get: () => startPosition
//       },
//       stop: {
//         get: () => stop,
//         set: (value) => {
//           stop = value;
//         } 
//       }
//     })
//   }
//   findPath() {
//     this.queue.push(this.startPos);
//     while(this.queue > 0) {
//       let currentPosition = this.queue.shift();
//       console.log('queue', this.queue);
//       this.makeMove('up', currentPosition);
//       this.makeMove('down', currentPosition);
//       this.makeMove('left', currentPosition);
//       this.makeMove('right', currentPosition);
//       if (this.stop) {
//         break
//       }
//     }
//   }
//   makeMove(whereToGo='', position={}) {
//     const obj = Object.assign({}, position);
//     console.log({obj});
//     if (whereToGo === 'up') {
//       obj.x--;
//     }
//     if (whereToGo === 'down') {
//       obj.x++;
//     }
//     if (whereToGo === 'left') {
//       obj.y--;
//     }
//     if (whereToGo === 'right') {
//       obj.y++;
//     }
//     if (this.checkMove(obj)) {
//       this.path.push(position);
//       this.queue.push(obj);
//     }
//     if (obj.x === this.endPos.x && obj.y === this.endPos.y) {
//       this.stop = true;
//       this.path.push(obj);
//       console.log('path', this.path);
//       console.log('queqeqe', this.queue);
//       return console.log('Final');
//     }
//   }
//   checkMove(move={}) {
//     if (move.x < 0 || move.x > this.matrix.length - 1) {
//       return false;
//     }
//     if (move.y < 0 || move.y > this.matrix[0].length - 1) {
//       return false;
//     }
//     if (this.matrix[move.x][move.y] === undefined) {
//       return false;
//     }
//     if (this.matrix[move.x][move.y] === 1) {
//       return false;
//     }
//     return true;
//   }
// }

// const mat = [
//   [0, 1, 1],
//   [0, 0, 0],
//   [1, 0, 0]
// ];

// const s = {
//   x: 0,
//   y: 0
// }

// const e = {
//   x: 2,
//   y: 2
// }
// const p = new PathFinder(mat, s, e);
// p.findPath();



// // [distanceFromTop, distanceFromLeft]
// var findShortestPath = function(startCoordinates, grid) {
//   var distanceFromTop = startCoordinates[0];
//   var distanceFromLeft = startCoordinates[1];

//   // Each "location" will store its coordinates
//   // and the shortest path required to arrive there
//   var location = {
//     distanceFromTop: distanceFromTop,
//     distanceFromLeft: distanceFromLeft,
//     path: [],
//     status: 'Start'
//   };

//   // Initialize the queue with the start location already inside
//   var queue = [location];

//   // Loop through the grid searching for the goal
//   while (queue.length > 0) {
//     // Take the first location off the queue
//     var currentLocation = queue.shift();
//     console.log(queue);
//     // Explore North
//     var newLocation = exploreInDirection(currentLocation, 'North', grid);
//     if (newLocation.status === 'Goal') {
//       return newLocation.path;
//     } else if (newLocation.status === 'Valid') {
//       queue.push(newLocation);
//     }

//     // Explore East
//     var newLocation = exploreInDirection(currentLocation, 'East', grid);
//     if (newLocation.status === 'Goal') {
//       return newLocation.path;
//     } else if (newLocation.status === 'Valid') {
//       queue.push(newLocation);
//     }

//     // Explore South
//     var newLocation = exploreInDirection(currentLocation, 'South', grid);
//     if (newLocation.status === 'Goal') {
//       return newLocation.path;
//     } else if (newLocation.status === 'Valid') {
//       queue.push(newLocation);
//     }

//     // Explore West
//     var newLocation = exploreInDirection(currentLocation, 'West', grid);
//     if (newLocation.status === 'Goal') {
//       return newLocation.path;
//     } else if (newLocation.status === 'Valid') {
//       queue.push(newLocation);
//     }
//   }

//   // No valid path found
//   return false;

// };

// // This function will check a location's status
// // (a location is "valid" if it is on the grid, is not an "obstacle",
// // and has not yet been visited by our algorithm)
// // Returns "Valid", "Invalid", "Blocked", or "Goal"
// var locationStatus = function(location, grid) {
//   var gridSize = grid.length;
//   var dft = location.distanceFromTop;
//   var dfl = location.distanceFromLeft;

//   if (location.distanceFromLeft < 0 ||
//       location.distanceFromLeft >= gridSize ||
//       location.distanceFromTop < 0 ||
//       location.distanceFromTop >= gridSize) {

//     // location is not on the grid--return false
//     return 'Invalid';
//   } else if (grid[dft][dfl] === 'Goal') {
//     return 'Goal';
//   } else if (grid[dft][dfl] !== 'Empty') {
//     // location is either an obstacle or has been visited
//     return 'Blocked';
//   } else {
//     return 'Valid';
//   }
// };


// // Explores the grid from the given location in the given
// // direction
// var exploreInDirection = function(currentLocation, direction, grid) {
//   var newPath = currentLocation.path.slice();
//   newPath.push(direction);

//   var dft = currentLocation.distanceFromTop;
//   var dfl = currentLocation.distanceFromLeft;

//   if (direction === 'North') {
//     dft -= 1;
//   } else if (direction === 'East') {
//     dfl += 1;
//   } else if (direction === 'South') {
//     dft += 1;
//   } else if (direction === 'West') {
//     dfl -= 1;
//   }

//   var newLocation = {
//     distanceFromTop: dft,
//     distanceFromLeft: dfl,
//     path: newPath,
//     status: 'Unknown'
//   };
//   newLocation.status = locationStatus(newLocation, grid);

//   // If this new location is valid, mark it as 'Visited'
//   if (newLocation.status === 'Valid') {
//     grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = 'Visited';
//   }
//   return newLocation;
// };


// // OK. We have the functions we need--let's run them to get our shortest path!

// // Create a 4x4 grid
// // Represent the grid as a 2-dimensional array
// var gridSize = 4;
// var grid = [];
// for (var i=0; i<gridSize; i++) {
//   grid[i] = [];
//   for (var j=0; j<gridSize; j++) {
//     grid[i][j] = 'Empty';
//   }
// }

// // Think of the first index as "distance from the top row"
// // Think of the second index as "distance from the left-most column"

// // This is how we would represent the grid with obstacles above
// grid[0][0] = "Start";
// grid[2][2] = "Goal";

// grid[1][1] = "Obstacle";
// grid[1][2] = "Obstacle";
// grid[1][3] = "Obstacle";
// grid[2][1] = "Obstacle";
// console.log(grid);
// console.log(findShortestPath([0,0], grid));