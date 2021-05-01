class Board {
  constructor(state = ['','','','','','','','','']) {
    this.state = state;
  }
  isEmpty() {
      return this.state.every(cell => !cell);
  }
  isFull() {
    return this.state.every(cell => cell);
  }

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

  getAvailableMoves() {
    const moves = [];
    this.state.forEach((cell, index) => {
      if(!cell) moves.push(index); 
    });
    return moves;
  }

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
  constructor(maxDepth = -1) {
    this.maxDepth = maxDepth;
    this.nodesMap = new Map();
  }
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