const load = require('../loader')

const REVERSE_DIRECTION = [0, 3, 4, 1, 2];

function findFurthest(input) {
  const [visited] = getLoop(input);
  return visited.size / 2;
}

function countInside(input) {
  const width = input[0].length;
  const height = input.length;
  const [visited, start] = getLoop(input);

  let count = 0;
  for (let j = 0; j < height; j++) {
    let color = 'red';
    for (let i = 0; i < width; i++) {
      const index = j * width + i;
      if (visited.has(index)) {
        let type = input[j][i];
        if (type === 'S') type = start;
        if (type === '|') color = color === 'red' ? 'green' : 'red';
        if (type === 'L') color = color === 'red' ? 'yellow' : 'green';
        if (type === 'F') color = color === 'red' ? 'green' : 'yellow'; 
        if (type === 'J') color = color === 'yellow' ? 'red' : 'green';
        if (type === '7') color = color === 'yellow' ? 'green' : 'red';
      } else if (color === 'green') {
        count++;
      }
    }
  }

  return count;
}

function getLoop(input) {
  const width = input[0].length;
  const height = input.length;

  const enter = new Int8Array(width * height);
  const exit = new Int8Array(width * height);
  input.forEach((row, j) => {
    row.forEach((char, i) => {
      const index = j * width + i;
      if (char === 'S') {
        enter[index] = -1;
        exit[index] = -1;
      }
      if (char === '|') {
        enter[index] = 1;
        exit[index] = 3;
      }
      if (char === '-') {
        enter[index] = 2;
        exit[index] = 4;
      }
      if (char === 'L') {
        enter[index] = 1;
        exit[index] = 2;
      }
      if (char === 'J') {
        enter[index] = 1;
        exit[index] = 4;
      }
      if (char === '7') {
        enter[index] = 3;
        exit[index] = 4;
      }
      if (char === 'F') {
        enter[index] = 3;
        exit[index] = 2;
      }
    });
  });

  const visited = new Set();
  const start = [];

  let currIndex = enter.indexOf(-1);
  let currDirection = -1;
  visited.add(currIndex);

  if (
    currIndex + width < enter.length &&
    (enter[currIndex + width] === 1 || exit[currIndex + width] === 1)
  ) {
    currIndex = currIndex + width;
    currDirection = 1;
  } else if (
    currIndex % width > 0 &&
    (enter[currIndex - 1] === 2 || exit[currIndex - 1] === 2)
  ) {
    currIndex = currIndex - 1;
    currDirection = 2;
  } else if (
    currIndex - width > 0 &&
    (enter[currIndex - width] === 3 || exit[currIndex - width] === 3)
  ) {
    currIndex = currIndex - width;
    currDirection = 3;
  } else if (
    currIndex % width < width - 1 &&
    (enter[currIndex + 1] === 4 || exit[currIndex + 1] === 4)
  ) {
    currIndex = currIndex - 1;
    currDirection = 4;
  }
  start.push(REVERSE_DIRECTION[currDirection]);

  while (enter[currIndex] !== -1) {
    visited.add(currIndex);
    if (currDirection === enter[currIndex]) {
      currDirection = REVERSE_DIRECTION[exit[currIndex]];
    } else if (currDirection === exit[currIndex]) {
      currDirection = REVERSE_DIRECTION[enter[currIndex]];
    } else {
      throw new Error();
    }
    if (currDirection === 1) currIndex = currIndex + width;
    else if (currDirection === 2) currIndex = currIndex - 1;
    else if (currDirection === 3) currIndex = currIndex - width;
    else if (currDirection === 4) currIndex = currIndex + 1;
    else throw new Error();
  }
  start.push(currDirection);

  start.sort((a, b) => (b % 2) - (a % 2) || a - b);

  if (start[0] === 1 && start[1] === 2) return [visited, 'L'];
  if (start[0] === 1 && start[1] === 3) return [visited, '|'];
  if (start[0] === 1 && start[1] === 4) return [visited, 'J'];
  if (start[0] === 2 && start[1] === 4) return [visited, '-'];
  if (start[0] === 3 && start[1] === 2) return [visited, 'F'];
  if (start[0] === 3 && start[1] === 4) return [visited, '7'];
}

const test = load('day10', __dirname).trim()  .split('\n')  .map(line => line.split(''))

console.log(findFurthest(test));
console.log(countInside(test));
