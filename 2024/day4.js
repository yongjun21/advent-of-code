const load = require('../loader')

function findXMAS(input) {
  const rows = input.length;
  const cols = input[0].length;
  let count = 0;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols - 3; i++) {
      if (input[j][i] === 'X' && input[j][i + 1] === 'M' && input[j][i + 2] === 'A' && input[j][i + 3] === 'S') {
        count++;
      }
      if (input[j][i] === 'S' && input[j][i + 1] === 'A' && input[j][i + 2] === 'M' && input[j][i + 3] === 'X') {
        count++;
      }
    }
  }
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows - 3; j++) {
      if (input[j][i] === 'X' && input[j + 1][i] === 'M' && input[j + 2][i] === 'A' && input[j + 3][i] === 'S') {
        count++;
      }
      if (input[j][i] === 'S' && input[j + 1][i] === 'A' && input[j + 2][i] === 'M' && input[j + 3][i] === 'X') {
        count++;
      }
    }
  }
  for (let j = 0; j < rows - 3; j++) {
    for (let i = 0; i < cols - 3; i++) {
      if (input[j][i] === 'X' && input[j + 1][i + 1] === 'M' && input[j + 2][i + 2] === 'A' && input[j + 3][i + 3] === 'S') {
        count++;
      }
      if (input[j][i] === 'S' && input[j + 1][i + 1] === 'A' && input[j + 2][i + 2] === 'M' && input[j + 3][i + 3] === 'X') {
        count++;
      }
    }
  }

  for (let j = 0; j < rows - 3; j++) {
    for (let i = 3; i < cols; i++) {
      if (input[j][i] === 'X' && input[j + 1][i - 1] === 'M' && input[j + 2][i - 2] === 'A' && input[j + 3][i - 3] === 'S') {
        count++;
      }
      if (input[j][i] === 'S' && input[j + 1][i - 1] === 'A' && input[j + 2][i - 2] === 'M' && input[j + 3][i - 3] === 'X') {
        count++;
      }
    }
  }
  return count;
}

function findXMAS2(input) {
  const rows = input.length;
  const cols = input[0].length;
  let count = 0;
  for (let j = 0; j < rows - 2; j++) {
    for (let i = 0; i < cols - 2; i++) {
      if (input[j][i] === 'M' && input[j][i + 2] === 'M' && input[j + 1][i + 1] === 'A' && input[j + 2][i] === 'S' && input[j + 2][i + 2] === 'S') {
        count++;
      }
      if (input[j][i] === 'M' && input[j][i + 2] === 'S' && input[j + 1][i + 1] === 'A' && input[j + 2][i] === 'M' && input[j + 2][i + 2] === 'S') {
        count++;
      }
      if (input[j][i] === 'S' && input[j][i + 2] === 'S' && input[j + 1][i + 1] === 'A' && input[j + 2][i] === 'M' && input[j + 2][i + 2] === 'M') {
        count++;
      }
      if (input[j][i] === 'S' && input[j][i + 2] === 'M' && input[j + 1][i + 1] === 'A' && input[j + 2][i] === 'S' && input[j + 2][i + 2] === 'M') {
        count++;
      }
    }
  }
  return count;
}

const test = load('day4', __dirname).trim().split('\n')

console.log(findXMAS(test))
console.log(findXMAS2(test))
