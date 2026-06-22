const load = require('../loader')

function getMinimumPath(input, width, height, upto = Infinity) {
  const blocked = new Set();
  for (let i = 0; i < input.length; i++) {
    if (i >= upto) break;
    const [x, y] = input[i];
    blocked.add(y * width + x);
  }

  const path = [];
  const unvisited = [];
  const visited = new Map();
  const minPath = new Set();

  unvisited.push([0, 0, 0]);
  while (unvisited.length > 0) {
    const [x, y, steps] = unvisited.pop();
    if (steps < 0) {
      path.pop();
      continue;
    }
    const key = y * width + x;
    if (blocked.has(key)) continue;
    const currMin = visited.get(key) || Infinity;
    if (steps < currMin && x === width - 1 && y === height - 1) {
      minPath.clear();
      path.forEach(key => minPath.add(key));
      continue;
    }
    if (steps >= currMin) continue;
    visited.set(key, steps);

    path.push(key);
    unvisited.push([x, y, -1]);
    if (y < height - 1) unvisited.push([x, y + 1, steps + 1]);
    if (x < width - 1) unvisited.push([x + 1, y, steps + 1]);
    if (y > 0) unvisited.push([x, y - 1, steps + 1]);
    if (x > 0) unvisited.push([x - 1, y, steps + 1]);
  }
  return minPath;
}

function findFirstByte(input, width, height, start = 0) {
  let prevMinPath = getMinimumPath(input, width, height, start);
  start++;
  while (start < input.length) {
    const [x, y] = input[start - 1];
    if (prevMinPath.has(y * width + x)) {
      const path = getMinimumPath(input, width, height, start);
      if (path.size === 0) return `${x},${y}`;
      prevMinPath = path;
    }
    start++;
  }
}

const test = load('day18', __dirname).trim()  .split('\n')  .map(line => line.split(',').map(Number))

console.log(getMinimumPath(test, 71, 71, 1024).size);
console.log(findFirstByte(test, 71, 71, 1024));
