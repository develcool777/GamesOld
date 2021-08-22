
/**
 * @class 
 * @alias Board
 * @memberof TicTacToe#
 * @classdesc This class have methods to build the board, [`more info`]{@link https://alialaa.com/blog/tic-tac-toe-js}
 * @constructor
 * @param {Array} state - field for game
 */
class Board {
  constructor(state = ['','','','','','','','','']) {
    this.state = state;
  }
  /**
   * @method 
   * @alias isEmpty
   * @memberof TicTacToe#Board#
   * @description Returns true if every cell is empty otherwise false 
   * @returns {Boolean} Boolean
   * @example const isEmpty = this.isEmpty()
   */
  isEmpty() {
    return this.state.every(cell => !cell);
  }

  /**
   * @method 
   * @alias isFull
   * @memberof TicTacToe#Board#
   * @description Returns true if there is no empty cell otherwise false 
   * @returns {Boolean} Boolean
   * @example const isFull = this.isFull() 
   */
  isFull() {
    return this.state.every(cell => cell);
  }

  /**
   * @method 
   * @alias insert
   * @memberof TicTacToe#Board#
   * @param {String} symbol - Value must be 'x' or 'o'
   * @param {Number} position - Value must be Integer in range(0, 8)
   * @throws Error - if symbol is not 'x' or 'o'
   * @throws Error - if position is not in range(0, 8)
   * @description Insert `symbol` in `this.state` at the `position` in case of success return true, otherwise false
   * @returns {Boolean} Boolean
   * @example const isInserted = this.insert('x', 4); 
   */
  insert(symbol, position) {
    if(![0,1,2,3,4,5,6,7,8].includes(position)) {
      throw new Error(`Cell index ${position} does not exist!`)
    }
    if(!['x','o'].includes(symbol)) {
      throw new Error('The symbol can only be x or o!')
    }
    if(this.state[position]) {
      return false;
    }
    this.state[position] = symbol;
    return true;
  }

  /**
   * @method 
   * @alias getAvailableMoves
   * @memberof TicTacToe#Board#
   * @description Returns array of available positions
   * @returns {Array} Array
   * @example const availablePos = this.getAvailableMoves()
   */
  getAvailableMoves() {
    const moves = [];
    this.state.forEach((cell, index) => {
      if(!cell) moves.push(index); 
    });
    return moves;
  }

  /**
   * @method 
   * @alias isTerminal
   * @memberof TicTacToe#Board#
   * @description If there is a winner or it's draw returns object otherwise boolean(false)
   * @returns {Boolean|Object} Boolean|Object
   * @example const result = this.isTerminal()
   */
  isTerminal() {
    if(this.isEmpty()) return false;
    if(this.state[0] === this.state[1] && this.state[0] === this.state[2] && this.state[0]) {
      return {'winner': this.state[0], 'direction': 'H', 'row': 1};
    }
    if(this.state[3] === this.state[4] && this.state[3] === this.state[5] && this.state[3]) {
      return {'winner': this.state[3], 'direction': 'H', 'row': 2};
    }
    if(this.state[6] === this.state[7] && this.state[6] === this.state[8] && this.state[6]) {
      return {'winner': this.state[6], 'direction': 'H', 'row': 3};
    }

    //Checking Vertical Wins
    if(this.state[0] === this.state[3] && this.state[0] === this.state[6] && this.state[0]) {
      return {'winner': this.state[0], 'direction': 'V', 'column': 1};
    }
    if(this.state[1] === this.state[4] && this.state[1] === this.state[7] && this.state[1]) {
      return {'winner': this.state[1], 'direction': 'V', 'column': 2};
    }
    if(this.state[2] === this.state[5] && this.state[2] === this.state[8] && this.state[2]) {
      return {'winner': this.state[2], 'direction': 'V', 'column': 3};
    }

    //Checking Diagonal Wins
    if(this.state[0] === this.state[4] && this.state[0] === this.state[8] && this.state[0]) {
      return {'winner': this.state[0], 'direction': 'D', 'diagonal': 'main'};
    }
    if(this.state[2] === this.state[4] && this.state[2] === this.state[6] && this.state[2]) {
      return {'winner': this.state[2], 'direction': 'D', 'diagonal': 'counter'};
    }

    if(this.isFull()) {
      return {'winner': 'draw'};
    }

    return false;
  }
}


class minMax {
/**
 * @class 
 * @alias minMax
 * @memberof TicTacToe#
 * @classdesc This class represent logic of computer thinking, otherwise determine the best move for computer, 
 * [`more info`]{@link https://alialaa.com/blog/tic-tac-toe-js-minimax}
 * @constructor 
 */
  constructor(maxDepth = -1) {
    this.maxDepth = maxDepth;
    this.nodesMap = new Map();
  }
  /**
   * @method getBestMove
   * @memberof TicTacToe#minMax#
   * @param {InstanceType} board 
   * @param {Boolean} maximizing 
   * @param {Function} callback 
   * @param {Number} depth 
   * @description This method define the best move for computer with MinMax algorithm 
   * @returns {Number} Number
   * @example 
   * const b = new Board();
   * const best = this.getBestMove(b);
   */
  getBestMove(board, maximizing = true, callback = () => {}, depth = 0) {
    if(depth == 0) this.nodesMap.clear();
  
    if(board.isTerminal() || depth === this.maxDepth ) {
      if(board.isTerminal().winner === 'x') {
          return 100 - depth;
      } else if (board.isTerminal().winner === 'o') {
          return -100 + depth;
      } 
      return 0;
    }
    if(maximizing) {
      let best = -100;
      board.getAvailableMoves().forEach(index => {
        const child = new Board([...board.state]);
        child.insert('x', index);
        const nodeValue = this.getBestMove(child, false, callback, depth + 1);
        best = Math.max(best, nodeValue);
      
        if(depth == 0) {
          const moves = this.nodesMap.has(nodeValue) ? `${this.nodesMap.get(nodeValue)},${index}` : index;
          this.nodesMap.set(nodeValue, moves);
        }
      });
      if(depth == 0) {
        let returnValue;
        if(typeof this.nodesMap.get(best) == 'string') {
          const arr = this.nodesMap.get(best).split(',');
          const rand = Math.floor(Math.random() * arr.length);
          returnValue = arr[rand];
        } else {
          returnValue = this.nodesMap.get(best);
        }
        callback(returnValue);
        return returnValue;
      }
      return best;
    }

    if(!maximizing) {
      let best = 100;
      board.getAvailableMoves().forEach(index => {
        const child = new Board([...board.state]);
        child.insert('o', index);
        let nodeValue = this.getBestMove(child, true, callback, depth + 1);
        best = Math.min(best, nodeValue);
        if(depth == 0) {
          const moves = this.nodesMap.has(nodeValue) ? this.nodesMap.get(nodeValue) + ',' + index : index;
          this.nodesMap.set(nodeValue, moves);
        }
      });

      if(depth == 0) {
        let returnValue;
        if(typeof this.nodesMap.get(best) == 'string') {
          const arr = this.nodesMap.get(best).split(',');
          const rand = Math.floor(Math.random() * arr.length);
          returnValue = arr[rand];
        } else {
          returnValue = this.nodesMap.get(best);
        }
        callback(returnValue);
        return returnValue;
      }
      return best;
    }
  }
}

module.exports = {
  minMax,
  Board 
}