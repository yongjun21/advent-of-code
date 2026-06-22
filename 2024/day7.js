const load = require('../loader')

function totalCalibration(input) {
  return input.reduce((sum, row) => {
    for (let i = 0; i < 1 << (row[1].length - 1); i++) {
      if (apply(row[1], i) === row[0]) return sum + row[0];
    }
    return sum;
  }, 0);
}

function apply(values, operators) {
  let result = 0;
  for (let i = 0; i < values.length; i++) {
    const isMul = (operators >> (values.length - 1 - i)) & 1;
    if (isMul) {
      result *= values[i];
    } else {
      result += values[i];
    }
  }
  return result;
}

function totalCalibration2(input) {
  return input.reduce((sum, row) => {
    for (let i = 0; i < 1 << (row[1].length - 1); i++) {
      if (apply(row[1], i) === row[0]) return sum + row[0];
    }
    for (let i = 0; i < Math.pow(3, row[1].length - 1); i++) {
      if (apply2(row[1], i) === row[0]) return sum + row[0];
    }
    return sum;
  }, 0);
}

function apply2(values, operators) {
  operators = operators.toString(3).padStart(values.length, '0');
  let result = 0;
  for (let i = 0; i < values.length; i++) {
    const type = operators[i];
    if (type === '2') {
      result *= Math.pow(10, Math.floor(Math.log10(values[i])) + 1);
      result += values[i];
    } else if (type === '1') {
      result *= values[i];
    } else {
      result += values[i];
    }
  }
  return result;
}

function parse(line) {
  const [left, right] = line.split(': ');
  return [Number(left), right.split(' ').map(Number)];
}

const test = load('day7', __dirname).trim().split('\n').map(parse)

console.log(totalCalibration(test));
console.log(totalCalibration2(test));
