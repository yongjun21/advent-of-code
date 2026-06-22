const load = require('../loader')

function findPassword(input, start = 50) {
  let curr = start % 100;
  let count = 0;
  for (const line of input) {
    const direction = line.slice(0, 1);
    let steps = Number(line.slice(1));
    steps = steps % 100;
    if (direction === 'L') curr -= steps;
    else curr += steps;
    if (curr < 0) curr += 100;
    if (curr >= 100) curr -= 100;
    if (curr === 0) count += 1;
  }
  return count;
}

function findPassword2(input, start = 50) {
  let curr = start % 100;
  let count = 0;
  for (const line of input) {
    const direction = line.slice(0, 1);
    let steps = Number(line.slice(1));
    count += Math.trunc(steps / 100);
    steps = steps % 100;
    const prev = curr;
    if (direction === 'L') curr -= steps;
    else curr += steps;
    if (curr < 0) {
      curr += 100;
      if (prev > 0) count += 1;
    } else if (curr >= 100) {
      curr -= 100;
      count += 1;
    } else if (curr === 0) {
      if (prev > 0) count += 1;
    }
  }
  return count;
}

const test = load('day1', __dirname).trim()  .split('\n')

console.log(findPassword(test));
console.log(findPassword2(test));
