const load = require('../loader')

function findLeastHeatLoss(input, minSteps = 1, maxSteps = 3) {
  const width = input[0].length;
  const height = input.length;

  const loss = new Uint8Array(width * height);

  const goRight = (i, j, n) => {
    if (i >= width - 1) return null;
    const index = j * width + i + 1;
    return [4 * maxSteps * index + 0 * maxSteps + n, loss[index]];
  }

  const goDown = (i, j, n) => {
    if (j >= height - 1) return null;
    const index = (j + 1) * width + i;
    return [4 * maxSteps * index + 1 * maxSteps + n, loss[index]];
  }

  const goLeft = (i, j, n) => {
    if (i <= 0) return null;
    const index = j * width + i - 1;
    return [4 * maxSteps * index + 2 * maxSteps + n, loss[index]];
  }

  const goUp = (i, j, n) => {
    if (j <= 0) return null;
    const index = (j - 1) * width + i;
    return [4 * maxSteps * index + 3 * maxSteps + n, loss[index]];
  }

  const first = new Array(width * height * 4 * maxSteps);
  const second = new Array(width * height * 4 * maxSteps);
  const third = new Array(width * height * 4 * maxSteps);

  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const index = j * width + i;
      loss[index] = Number(input[j][i])
    }
  }

  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const index = j * width + i;
      for (let k = 0; k < minSteps - 1; k++) {
        first[4 * maxSteps * index + 0 * maxSteps + k] = goRight(i, j, k + 1);
        first[4 * maxSteps * index + 1 * maxSteps + k] = goDown(i, j, k + 1);
        first[4 * maxSteps * index + 2 * maxSteps + k] = goLeft(i, j, k + 1);
        first[4 * maxSteps * index + 3 * maxSteps + k] = goUp(i, j, k + 1);
        second[4 * maxSteps * index + 0 * maxSteps + k] = null;
        second[4 * maxSteps * index + 1 * maxSteps + k] = null;
        second[4 * maxSteps * index + 2 * maxSteps + k] = null;
        second[4 * maxSteps * index + 3 * maxSteps + k] = null;
        third[4 * maxSteps * index + 0 * maxSteps + k] = null;
        third[4 * maxSteps * index + 1 * maxSteps + k] = null;
        third[4 * maxSteps * index + 2 * maxSteps + k] = null;
        third[4 * maxSteps * index + 3 * maxSteps + k] = null;
      }
      for (let k = minSteps - 1; k < maxSteps - 1; k++) {
        first[4 * maxSteps * index + 0 * maxSteps + k] = goRight(i, j, k + 1);
        first[4 * maxSteps * index + 1 * maxSteps + k] = goDown(i, j, k + 1);
        first[4 * maxSteps * index + 2 * maxSteps + k] = goDown(i, j, 0);
        first[4 * maxSteps * index + 3 * maxSteps + k] = goRight(i, j, 0);
        second[4 * maxSteps * index + 0 * maxSteps + k] = goDown(i, j, 0);
        second[4 * maxSteps * index + 1 * maxSteps + k] = goRight(i, j, 0);
        second[4 * maxSteps * index + 2 * maxSteps + k] = goLeft(i, j, k + 1);
        second[4 * maxSteps * index + 3 * maxSteps + k] = goUp(i, j, k + 1);
        third[4 * maxSteps * index + 0 * maxSteps + k] = goUp(i, j, 0);
        third[4 * maxSteps * index + 1 * maxSteps + k] = goLeft(i, j, 0);
        third[4 * maxSteps * index + 2 * maxSteps + k] = goUp(i, j, 0);
        third[4 * maxSteps * index + 3 * maxSteps + k] = goLeft(i, j, 0);
      }
      first[4 * maxSteps * index + 1 * maxSteps - 1] = goDown(i, j, 0);
      first[4 * maxSteps * index + 2 * maxSteps - 1] = goRight(i, j, 0);
      first[4 * maxSteps * index + 3 * maxSteps - 1] = goDown(i, j, 0);
      first[4 * maxSteps * index + 4 * maxSteps - 1] = goRight(i, j, 0);
      second[4 * maxSteps * index + 1 * maxSteps - 1] = goUp(i, j, 0);
      second[4 * maxSteps * index + 2 * maxSteps - 1] = goLeft(i, j, 0);
      second[4 * maxSteps * index + 3 * maxSteps - 1] = goUp(i, j, 0);
      second[4 * maxSteps * index + 4 * maxSteps - 1] = goLeft(i, j, 0);
      third[4 * maxSteps * index + 1 * maxSteps - 1] = null;
      third[4 * maxSteps * index + 2 * maxSteps - 1] = null;
      third[4 * maxSteps * index + 3 * maxSteps - 1] = null;
      third[4 * maxSteps * index + 4 * maxSteps - 1] = null;
    }
  }

  let minLoss = Infinity;
  const maxIndex = 4 * maxSteps * width * height;
  const visited = new Map();
  const stack = [goRight(0, 0, 0), goDown(0, 0, 0)];

  while (stack.length > 0) {
    const [nextIndex, nextLoss] = stack.pop();
    if (nextLoss >= minLoss) continue;
    if (nextIndex >= maxIndex - 4 * maxSteps) {
      const k = nextIndex % maxSteps;
      if (k >= minSteps - 1) minLoss = nextLoss;
      continue;
    }
    const existingLoss = visited.get(nextIndex);
    if (existingLoss != null && existingLoss <= nextLoss) continue;
    visited.set(nextIndex, nextLoss)
    const thirdChoice = third[nextIndex];
    if (thirdChoice) stack.push([thirdChoice[0], thirdChoice[1] + nextLoss]);
    const secondChoice = second[nextIndex];
    if (secondChoice) stack.push([secondChoice[0], secondChoice[1] + nextLoss]);
    const firstChoice = first[nextIndex];
    if (firstChoice) stack.push([firstChoice[0], firstChoice[1] + nextLoss]);
  }
  return minLoss;
}

const test = load('day17', __dirname).trim().split('\n')

console.log(findLeastHeatLoss(test));
console.log(findLeastHeatLoss(test, 4, 10));
