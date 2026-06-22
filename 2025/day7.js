const load = require('../loader')

function countSplitsAndTimelines(input) {
  const rows = input.length;
  const cols = input[0].length;

  const state = new Float64Array(rows * cols);
  for (let j = 0; j < cols; j++) {
    if (input[0][j] === 'S') {
      state[j] = 1;
      break;
    }
  }
  for (let i = 1; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      state[i * cols + j] = input[i][j] === '^' ? -1 : 0;
    }
  }

  let splits = 0;
  for (let i = 1; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (state[i * cols + j] === -1) {
        if (state[(i - 1) * cols + j] > 0) {
          splits++;
        }
      } else {
        state[i * cols + j] += Math.max(state[(i - 1) * cols + j], 0);
        if (j > 0 && state[i * cols + j - 1] === -1) {
          state[i * cols + j] += Math.max(state[(i - 1) * cols + j - 1], 0);
        }
        if (j < cols - 1 && state[i * cols + j + 1] === -1) {
          state[i * cols + j] += Math.max(state[(i - 1) * cols + j + 1], 0);
        }
      }
    }
  }
  
  const timelines = state
    .subarray(-cols)
    .reduce((sum, v) => sum + Math.max(v, 0), 0);
  
    return [splits, timelines];
}

const test = load('day7', __dirname).trim()  .split('\n')

console.log(countSplitsAndTimelines(test));
