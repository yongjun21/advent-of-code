/* eslint-disable no-labels */

const load = require('../loader')

function sumArrangement(input) {
  return input.reduce((sum, row, i) => sum + countArrangements(row), 0);
}

function countArrangements(
  row,
  startIndexA = 0,
  startIndexB = 0,
  cachedResults = new Map()
) {
  const cacheKey = startIndexA * 256 + startIndexB;
  const cached = cachedResults.get(cacheKey);
  if (cached != null) return cached;

  const { condition, groups } = row;

  if (startIndexB >= groups.length) {
    for (let i = startIndexA; i < condition.length; i++) {
      if (condition[i] >= 1) {
        cachedResults.set(cacheKey, 0);
        return 0;
      }
    }
    cachedResults.set(cacheKey, 1);
    return 1;
  }

  let minLeftover = 0;
  for (let i = startIndexB; i < groups.length; i++) {
    minLeftover += row.groups[i];
  }
  minLeftover += groups.length - startIndexB - 1;
  if (condition.length - startIndexA < minLeftover) {
    cachedResults.set(cacheKey, 0);
    return 0;
  }

  let count = 0;
  const run = groups[startIndexB];
  let maxIndex = condition.length - run + 1;
  outer: for (let i = startIndexA; i < maxIndex; i++) {
    if (condition[i] >= 1) maxIndex = i;
    for (let j = i; j < i + run; j++) {
      if (condition[j] === 0) continue outer;
    }

    if (i + run < condition.length && condition[i + run] >= 1) continue;

    const moreRuns = startIndexB + 1 < groups.length;
    if (moreRuns && i + run >= condition.length) continue;

    count += countArrangements(
      row,
      i + run + (moreRuns ? 1 : 0),
      startIndexB + 1,
      cachedResults
    );
  }

  cachedResults.set(cacheKey, count);
  return count;
}

function parse(line) {
  const [first, second] = line.split(' ');
  const condition = new Int8Array(first.length);
  for (let i = 0; i < first.length; i++) {
    condition[i] = first[i] === '.' ? 0 : first[i] === '#' ? 1 : -1;
  }
  return { condition, groups: new Uint8Array(second.split(',').map(Number)) };
}

function parse2(line) {
  const [_first, _second] = line.split(' ');
  const first = new Array(5).fill(_first).join('?');
  const second = new Array(5).fill(_second).join(',');
  return parse(`${first} ${second}`);
}

const test = load('day12', __dirname).trim()  .split('\n')

console.log(sumArrangement(test.map(parse)));
console.log(sumArrangement(test.map(parse2)));
