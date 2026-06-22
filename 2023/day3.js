const load = require('../loader')

const NUMBERS = '0123456789';

function sumPartNumbers(input) {
  const symbols = matchPartNumbers(input);
  const numberSet = new Set();
  for (const { numbers } of symbols.values()) {
    for (const number of numbers) numberSet.add(number);
  }
  let sum = 0;
  for (const number of numberSet) {
    sum += number.value;
  }
  return sum;
}

function sumGearRatios(input) {
  const symbols = matchPartNumbers(input);
  let sum = 0;
  for (const { type, numbers } of symbols.values()) {
    if (type !== '*') continue;
    if (numbers.length !== 2) continue;
    sum += numbers[0].value * numbers[1].value;
  }
  return sum;
}

function matchPartNumbers(input) {
  const width = input[0].length;
  const height = input.length;
  const symbols = new Map();
  let number = '';
  const numbers = [];
  const recordNumber = (i, j) => {
    numbers.push({
      iStart: i - number.length,
      iEnd: i,
      j,
      value: Number(number)
    });
    number = '';
  };
  input.forEach((line, j) => {
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '.') {
        if (number) recordNumber(i, j);
      } else if (NUMBERS.includes(char)) {
        number += char;
      } else {
        symbols.set(j * width + i, { type: char, numbers: [] });
        if (number) recordNumber(i, j);
      }
    }
    if (number) recordNumber(width, j);
  });
  numbers.forEach(number => {
    if (number.iStart > 0) {
      const left = symbols.get(number.j * width + number.iStart - 1);
      if (left) {
        left.numbers.push(number);
        return;
      }
    }
    if (number.iEnd < width) {
      const right = symbols.get(number.j * width + number.iEnd);
      if (right) {
        right.numbers.push(number);
        return;
      }
    }
    if (number.j > 0) {
      for (
        let i = Math.max(number.iStart - 1, 0);
        i < Math.min(number.iEnd + 1, width);
        i++
      ) {
        const top = symbols.get((number.j - 1) * width + i);
        if (top) {
          top.numbers.push(number);
          return;
        }
      }
    }
    if (number.j < height - 1) {
      for (
        let i = Math.max(number.iStart - 1, 0);
        i < Math.min(number.iEnd + 1, width);
        i++
      ) {
        const bottom = symbols.get((number.j + 1) * width + i);
        if (bottom) {
          bottom.numbers.push(number);
          return;
        }
      }
    }
  });
  return symbols;
}

const test = load('day3', __dirname).trim()  .split('\n')

console.log(sumPartNumbers(test));
console.log(sumGearRatios(test))
