function GEN_POSITION(allCells, ...rest) {
  let array = rest.flat();
  
  const findAndDelete = (cell) => {
    const lenBeforeFilter = array.length;
    array = array.filter(pos => pos.x !== cell.x || pos.y !== cell.y);
    return lenBeforeFilter === array.length;
  }

  const availableCells = allCells.filter(cell => findAndDelete(cell));
  const position = availableCells[Math.floor(Math.random() * availableCells.length)];
  return position;
}

function GEN_GUIDING_LINES(currentPos, fieldSize, ...rest) {
  const y = currentPos.y;
  const x = currentPos.x;
  const array = rest.flat();

  const up = [];
  for (let x = currentPos.x - 1; x >= 0; x--) {
    if (array.some(pos => pos.x === x && pos.y === y)) break;
    up.push({ x, y });
  }

  const down = [];
  for (let x = currentPos.x + 1; x < fieldSize.height; x++) {
    if (array.some(pos => pos.x === x && pos.y === y)) break;
    down.push({ x, y });
  }

  const left = [];
  for (let y = currentPos.y - 1; y >= 0; y--) {
    if (array.some(pos => pos.x === x && pos.y === y)) break;
    left.push({ x, y });
  }

  const right = [];
  for (let y = currentPos.y + 1; y < fieldSize.width; y++) {
    if (array.some(pos => pos.x === x && pos.y === y)) break;
    right.push({ x, y });
  }

  return [...up, ...down, ...left, ...right];
}


export {
  GEN_POSITION,
  GEN_GUIDING_LINES
}