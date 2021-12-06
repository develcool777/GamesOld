export default class Cell {
  constructor(x, y) {
    const position = {x, y};
    let food = false;
    let hasSnakePart = false;
    
    Object.defineProperties(this, {
      position: {
        get: () => position
      },

      food: {
        get: () => food,
        set: (value) => {
          food = value;
        }
      },

      hasSnakePart: {
        get: () => hasSnakePart,
        set: (value) => {
          hasSnakePart = value;
        }
      }
    });
  }
}