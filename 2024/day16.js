const load = require('../loader')

const ADJACENT = [[1, 0], [0, 1], [-1, 0], [0, -1]];

function findBestSpot(map) {
  const width = map[0].length;
  const height = map.length;

  let startX = -1;
  let startY = -1;
  let endX = -1;
  let endY = -1;
  const maze = new Int8Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      maze[y * width + x] = map[y][x] === '#' ? -1 : 0;
      if (map[y][x] === 'S') {
        startX = x;
        startY = y;
      } else if (map[y][x] === 'E') {
        endX = x;
        endY = y;
      }
    }
  }

  let lowestScore = Infinity;
  const spots = new Set()
  const path = [];
  
  const visited = new Map();

  const unvisited = []
  unvisited.push([startX, startY, 0, 0]);

  while (unvisited.length > 0) {
    const [x, y, direction, score] = unvisited.pop();
    if (x < 0) {
      path.pop();
      continue;
    }
    if (score > lowestScore) continue;
    const key = 4 * (y * width + x) + direction;
    if (visited.has(key) && visited.get(key) < score) continue;
    visited.set(key, score);

    if (x === endX && y === endY) {
      if (score < lowestScore) {
        spots.clear();
        lowestScore = score;
      }
      path.forEach(k => spots.add(Math.floor(k / 4)));
      continue;
    }

    path.push(key);
    unvisited.push([-1]);
    const rotCW = (direction + 1) % 4;
    const rotCCW = (direction + 3) % 4;
    unvisited.push([x, y, rotCW, score + 1000]);
    unvisited.push([x, y, rotCCW, score + 1000]);
    const nextX = x + ADJACENT[direction][0];
    const nextY = y + ADJACENT[direction][1];
    if (maze[nextY * width + nextX] >= 0) {
      unvisited.push([nextX, nextY, direction, score + 1]);
    }
  }

  return [lowestScore, spots.size + 1];
}

const test = load('day16', __dirname).trim().split('\n')

console.log(findBestSpot(test));
