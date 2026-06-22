const load = require('../loader')

function largestRectangle(input) {
  const n = input.length;
  let largest = 0;
  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      const rectangle =
        (Math.abs(input[j][0] - input[i][0]) + 1) *
        (Math.abs(input[j][1] - input[i][1]) + 1);
      largest = Math.max(largest, rectangle);
    }
  }
  return largest;
}

function largestRectangleConstrained(input) {
  const xs = new Set();
  const ys = new Set();
  input.forEach(point => {
    xs.add(point[0]);
    xs.add(point[0] + 1);
    ys.add(point[1]);
    ys.add(point[1] + 1);
  });
  const xValues = [...xs].sort((a, b) => a - b);
  const yValues = [...ys].sort((a, b) => a - b);
  const xIndexes = new Map();
  const yIndexes = new Map();
  xValues.forEach((x, index) => xIndexes.set(x, index));
  yValues.forEach((y, index) => yIndexes.set(y, index));

  const start = input
    .filter(point => point[1] === yValues[0])
    .sort((a, b) => a[0] - b[0])[0];
  const startIndex = input.indexOf(start);
  input = [...input.slice(startIndex), ...input.slice(0, startIndex)];

  const n = input.length;
  const w = xValues.length - 1;
  const h = yValues.length - 1;
  const blocked = new Set();
  const pushBlocked = (x, y) => {
    if (x < 0 || x >= w || y < 0 || y >= h) return;
    blocked.add(y * w + x);
  };
  const popBlocked = (x, y) => {
    if (x < 0 || x >= w || y < 0 || y >= h) return;
    blocked.delete(y * w + x);
  };

  const points = input.map(pt => [xIndexes.get(pt[0]), yIndexes.get(pt[1])]);

  let blockedX = points[0][0] - 1;
  let blockedY = points[0][1] - 1;
  pushBlocked(blockedX, blockedY);
  const globalCC = Math.min(Math.max(points[0][0] - points[n - 1][0], -1), 1) < 0;
  let prevX = globalCC ? points[0][0] : points[0][0] - 1;
  let prevY = globalCC ? points[0][1] -1 : points[0][1];
  let prevDeltaX = globalCC ? 0 : 1;
  let prevDeltaY = globalCC ? 1 : 0;

  for (const [currX, currY] of draw(points)) {
    const currDeltaX = currX - prevX;
    const currDeltaY = currY - prevY;

    if (
      (prevDeltaX !== 0 && currDeltaX !== 0) ||
      (prevDeltaY !== 0 && currDeltaY !== 0)
    ) {
      // draw continues in same direction (or reverses) so we just move blocked cell in same direction
      blockedX += currDeltaX;
      blockedY += currDeltaY;
      pushBlocked(blockedX, blockedY);
    } else if (prevDeltaX !== 0 && currDeltaX === 0 && currDeltaY !== 0) {
      const localCC = prevDeltaX * currDeltaY < 0;
      // if turn matches global direction move blocked cell three steps: one follow previous direction, two follow current direction, one follow next direction
      // otherwise blocked cell retract back one step
      if (localCC === globalCC) {
        blockedX += prevDeltaX;
        blockedY += prevDeltaY;
        pushBlocked(blockedX, blockedY);
        blockedX += currDeltaX;
        blockedY += currDeltaY;
        pushBlocked(blockedX, blockedY);
        blockedX += currDeltaX;
        blockedY += currDeltaY;
        pushBlocked(blockedX, blockedY);
      } else {
        popBlocked(blockedX, blockedY);
        blockedX -= prevDeltaX;
        blockedY -= prevDeltaY;
      }
    } else if (prevDeltaY !== 0 && currDeltaY === 0 && currDeltaX !== 0) {
      const localCC = prevDeltaY * currDeltaX > 0;
      if (localCC === globalCC) {
        blockedX += prevDeltaX;
        blockedY += prevDeltaY;
        pushBlocked(blockedX, blockedY);
        blockedX += currDeltaX;
        blockedY += currDeltaY;
        pushBlocked(blockedX, blockedY);
        blockedX += currDeltaX;
        blockedY += currDeltaY;
        pushBlocked(blockedX, blockedY);
      } else {
        popBlocked(blockedX, blockedY);
        blockedX -= prevDeltaX;
        blockedY -= prevDeltaY;
      }
    }
    prevX = currX;
    prevY = currY;
    prevDeltaX = currDeltaX;
    prevDeltaY = currDeltaY;
  }

  function isBlocked(xMin, xMax, yMin, yMax) {
    xMin = xIndexes.get(xMin);
    xMax = xIndexes.get(xMax + 1);
    yMin = yIndexes.get(yMin);
    yMax = yIndexes.get(yMax + 1);
    for (let x = xMin; x < xMax; x++) {
      for (let y = yMin; y < yMax; y++) {
        if (blocked.has(y * w + x)) return true;
      }
    }
    return false;
  }

  let largest = 0;
  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      const rectangle =
        (Math.abs(input[j][0] - input[i][0]) + 1) *
        (Math.abs(input[j][1] - input[i][1]) + 1);
      if (largest >= rectangle) continue;
      const xMin = Math.min(input[i][0], input[j][0]);
      const xMax = Math.max(input[i][0], input[j][0]);
      const yMin = Math.min(input[i][1], input[j][1]);
      const yMax = Math.max(input[i][1], input[j][1]);
      if (isBlocked(xMin, xMax, yMin, yMax)) continue;
      largest = rectangle;
    }
  }
  return largest;
}

function* draw(points) {
  const n = points.length;
  for (let i = 0; i < n; i++) {
    yield* stepByStep(points[i], points[i + 1 < n ? i + 1 : 0]);
  }
}

function* stepByStep(curr, next) {
  let x = curr[0];
  let y = curr[1];
  while (y < next[1]) {
    yield [x, y++];
  }
  while (y > next[1]) {
    yield [x, y--];
  }
  while (x < next[0]) {
    yield [x++, y];
  }
  while (x > next[0]) {
    yield [x--, y];
  }
}

const test = load('day9', __dirname).trim()  .split('\n')  .map(line => line.split(',').map(Number))

console.log(largestRectangle(test));
console.log(largestRectangleConstrained(test));
