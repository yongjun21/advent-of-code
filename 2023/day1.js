const load = require('../loader')

const DIGIT_MATCH = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9
};

function sumCalibration(input, digitPattern = '[0-9]') {
  const firstRe = new RegExp(`(${digitPattern})`);
  const lastRe = new RegExp(`.*(${digitPattern})`);
  return input.reduce((sum, line) => {
    const matchFirst = line.match(firstRe);
    const matchLast = line.match(lastRe);
    return sum + DIGIT_MATCH[matchFirst[1]] * 10 + DIGIT_MATCH[matchLast[1]];
  }, 0)
}

const test = load('day1', __dirname).trim()  .split('\n')

console.log(sumCalibration(test));
console.log(
  sumCalibration(test, '([0-9]|one|two|three|four|five|six|seven|eight|nine)')
);
