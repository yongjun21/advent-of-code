const load = require('../loader')

function sumScore(input) {
  const width = input[0].length;
  const height = input.length;

  const reachable = new Array(width * height).fill(0);

  function getReachable(index) {
    if (reachable[index]) return reachable[index];
    const i = index % width;
    const j = Math.floor(index / width);
    const value = input[j][i];
    if (value === 9) {
      reachable[index] = new Set([index]);
      return reachable[index];
    }
    const union = new Set();
    if (i > 0 && input[j][i - 1] - value === 1) {
      for (const dest of getReachable(index - 1)) union.add(dest);
    }
    if (i < width - 1 && input[j][i + 1] - value === 1) {
      for (const dest of getReachable(index + 1)) union.add(dest);
    }
    if (j > 0 && input[j - 1][i] - value === 1) {
      for (const dest of getReachable(index - width)) union.add(dest);
    }
    if (j < height - 1 && input[j + 1][i] - value === 1) {
      for (const dest of getReachable(index + width)) union.add(dest);
    }
    reachable[index] = union;
    return union;
  }

  let sum = 0;
  for (let j = 0; j < height; j++) {
    const row = input[j];
    for (let i = 0; i < width; i++) {
      if (row[i] === 0) sum += getReachable(j * width + i).size;
    }
  }
  return sum;
}

function sumRating(input) {
  const width = input[0].length;
  const height = input.length;

  const distinct = new Uint32Array(width * height);

  function getDistinct(index) {
    if (distinct[index] > 0) return distinct[index] - 1;
    const i = index % width;
    const j = Math.floor(index / width);
    const value = input[j][i];
    if (value === 9) {
      distinct[index] = 1 + 1;
      return 1;
    }
    let sum = 0;
    if (i > 0 && input[j][i - 1] - value === 1) {
      sum += getDistinct(index - 1);
    }
    if (i < width - 1 && input[j][i + 1] - value === 1) {
      sum += getDistinct(index + 1);
    }
    if (j > 0 && input[j - 1][i] - value === 1) {
      sum += getDistinct(index - width);
    }
    if (j < height - 1 && input[j + 1][i] - value === 1) {
      sum += getDistinct(index + width);
    }
    distinct[index] = sum + 1;
    return sum;
  }

  let sum = 0;
  for (let j = 0; j < height; j++) {
    const row = input[j];
    for (let i = 0; i < width; i++) {
      if (row[i] === 0) sum += getDistinct(j * width + i);
    }
  }
  return sum;
}

const test = load('day10', __dirname).trim()  .split('\n')  .map(line => line.split('').map(Number))

console.log(sumScore(test));
console.log(sumRating(test));
