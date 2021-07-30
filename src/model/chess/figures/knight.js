import Figures from "../figures";

export default class Knight extends Figures {
  constructor(color, position) {
    super();

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
    const available = {
      move: [],
      kill: [],
      check: [],
      wayToKing: [],
      cover: [],
    };

    const check = (x, y) => {
      if (field[x][y].figure !== null) {
        if (field[x][y].figure.color !== this.color) { 
          if (field[x][y].figure.name === 'King') {
            available.check.push({x, y});
            return;
          }
          available.kill.push({x, y});
          return;
        } 
        available.cover.push({x, y});
        return;
      }
      available.move.push({x, y});
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

    available.wayToKing.push({...this.position});

    return available
  }

  makeMove(cordinates, field) {
    super.makeMove(cordinates, field, this);
  }
}