const load = require('../loader')

const { unionRunEnds } = require('./common');

function countFreshAvailable({ fresh, available }) {
  return available.filter(id =>
    fresh.some(range => id >= range[0] && id <= range[1])
  ).length;
}

function countFresh(input) {
  let runs = [];
  for (const [start, end] of input) {
    runs = [...unionRunEnds(runs, [start, end + 1])];
  }
  let count = 0;
  let startIndex = -1;
  for (const index of runs) {
    if (startIndex === -1) {
      startIndex = index;
    } else {
      count += index - startIndex;
      startIndex = -1;
    }
  }
  return count;
}

function parse(input) {
  const [freshLines, availableLines] = input.trim().split('\n\n');
  const fresh = freshLines.split('\n').map(line => line.split('-').map(Number));
  const available = availableLines.split('\n').map(Number);
  return { fresh, available };
}

const test = load('day5', __dirname)

const parsed = parse(test);

console.log(countFreshAvailable(parsed));
console.log(countFresh(parsed.fresh));
