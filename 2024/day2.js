const load = require('../loader')

function findSafe(input) {
  return input.filter(row => {
    const diff = [];
    for (let i = 1; i < row.length; i++) {
      diff.push(row[i] - row[i - 1]);
    }
    return (
      diff.every(v => v >= 1 && v <= 3) || diff.every(v => v <= -1 && v >= -3)
    );
  }).length;
}

function findSafe2(input) {
  return input.filter(row => {
    const diff = [];
    for (let i = 1; i < row.length; i++) {
      diff.push(row[i] - row[i - 1]);
    }
    for (const _diff of applyDampener(diff)) {
      if (
        _diff.every(v => v >= 1 && v <= 3) ||
        _diff.every(v => v <= -1 && v >= -3)
      ) {
        return true;
      }
    }
    return false;
  }).length;
}

function* applyDampener(diff) {
  yield diff;
  for (let i = 0; i <= diff.length; i++) {
    if (i === 0) yield diff.slice(1);
    else if (i === diff.length) yield diff.slice(0, -1);
    else
      yield diff
        .slice(0, i - 1)
        .concat(diff[i - 1] + diff[i], diff.slice(i + 1));
  }
}

const test = load('day2', __dirname).trim()  .split('\n')  .map(line => line.split(' ').map(Number))

console.log(findSafe(test));
console.log(findSafe2(test));
