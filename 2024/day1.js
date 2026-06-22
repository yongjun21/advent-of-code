const load = require('../loader')

function getDiff(input) {
  const a = input.map(([a, _]) => a).sort((a, b) => a - b);
  const b = input.map(([_, b]) => b).sort((a, b) => a - b);
  return a.reduce((sum, v, i) => sum + Math.abs(v - b[i]), 0);
}

function getSimilarityScore(input) {
  const a = new Set(input.map(([a, _]) => a));
  return input
    .map(([_, b]) => b)
    .filter(v => a.has(v))
    .reduce((sum, v) => sum + v, 0);
}

const test = load('day1', __dirname).trim()  .split('\n')  .map(line => line.split('   ').map(Number))

console.log(getDiff(test));
console.log(getSimilarityScore(test));
