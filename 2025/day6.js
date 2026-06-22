const load = require('../loader')

function solveWorksheet({ operations, numbers }) {
  return operations.reduce((total, op, i) => {
    if (op === '*') {
      return total + numbers[i].reduce((product, num) => product * num, 1);
    } else {
      return total + numbers[i].reduce((sum, num) => sum + num, 0);
    }
  }, 0);
}

function parse(input) {
  const lines = input.split('\n');
  const rows = lines
    .slice(0, -1)
    .map(line => line.trim().split(/\s+/).map(Number));
  const operations = lines[lines.length - 1].trim().split(/\s+/);
  const numbers = operations.map((_, i) => rows.map(row => row[i]));
  return { operations, numbers };
}

function parse2(input) {
  const lines = input.split('\n');
  const numberLines = lines.slice(0, -1);
  const operationsLine = lines[lines.length - 1];
  const operations = [];
  const startIndices = [];
  for (let i = 0; i < operationsLine.length; i++) {
    if (operationsLine[i] !== ' ') {
      operations.push(operationsLine[i]);
      startIndices.push(i);
    }
  }
  const numbers = [];
  for (let i = 0; i < operations.length; i++) {
    const start = startIndices[i];
    const end = i < startIndices.length - 1 ? startIndices[i + 1] : operationsLine.length;
    const cols = [];
    for (let j = start; j < end; j++) {
      let numberStr = '';
      numberLines.forEach(line => {
        numberStr += line[j];
      });
      numberStr = numberStr.trim();
      if (numberStr.length > 0) {
        cols.push(Number(numberStr));
      }
    }
    numbers.push(cols);
  }
  return { operations, numbers };
}

const test = load('day6', __dirname)

console.log(solveWorksheet(parse(test)));
console.log(solveWorksheet(parse2(test)));
