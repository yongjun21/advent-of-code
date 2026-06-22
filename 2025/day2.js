// a * 10 + a, a E [1, 10), y >= 11, y <= 99, 9
// a * 100 + a, a E [10, 100), y >= 1010, y <= 9999, 90
// a * 1000 + a, a E [100, 1000), y >= 100100, y <= 999999, 900

// a * 100 + a * 10 + a, a E [1, 10), y >= 111, y <= 999, 9
// a * 10000 + a * 100 + a, a E [10, 100), y >= 101010, y <= 999999, 90
// a * 1000000 + a * 1000 + a, a E [100, 1000), y >= 100100100, y <= 999999999, 900

const load = require('../loader')

function sumInvalidIds(input) {
  let sum = 0;
  for (const line of input) {
    const [start, end] = line.split('-').map(Number);
    const startIndex = getIndex(start, 2);
    const endIndex = getIndex(end, 2, true);

    for (let n = startIndex; n <= endIndex; n++) {
      sum += getIdFromIndex(n, 2);
    }
  }
  return sum;
}

function sumInvalidIds2(input) {
  const invalids = new Set();
  for (const line of input) {
    const [start, end] = line.split('-').map(Number);
    const scale = Math.floor(Math.log10(end) + 1);
    for (let k = 2; k <= scale; k++) {
      const startIndex = getIndex(start, k);
      const endIndex = getIndex(end, k, true);
  
      for (let n = startIndex; n <= endIndex; n++) {
        invalids.add(getIdFromIndex(n, k));
      }
    }
  }
  return [...invalids].reduce((sum, v) => sum + v, 0);
}

function getFactor(scale, repeat) {
  let sum = 0;
  for (let n = 0; n < repeat; n++) {
    sum += Math.pow(10, n * scale);
  }
  return sum;
}

function getIndex(n, repeat = 2, lte = false) {
  const scale = Math.floor((Math.log10(n) + 1) / repeat);
  if (scale < 1) return lte ? 0 : 1;
  const scale10 = Math.pow(10, scale);
  const factor = getFactor(scale, repeat)
  return lte
    ? Math.min(Math.floor(n / factor), scale10 - 1)
    : Math.min(Math.ceil(n / factor), scale10);
}

function getIdFromIndex(n, repeat = 2) {
  const scale = Math.floor(Math.log10(n) + 1);
  const factor = getFactor(scale, repeat);
  return n * factor;
}

const test = load('day2', __dirname).split(',');

console.log(sumInvalidIds(test));
console.log(sumInvalidIds2(test))
