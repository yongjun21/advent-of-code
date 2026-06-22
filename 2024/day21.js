const load = require('../loader')

const NUMERIC_KEYPAD = {
  '7': [0, 0],
  '8': [1, 0],
  '9': [2, 0],
  '4': [0, 1],
  '5': [1, 1],
  '6': [2, 1],
  '1': [0, 2],
  '2': [1, 2],
  '3': [2, 2],
  '0': [1, 3],
  'A': [2, 3],
};

const DIRECTIONAL_KEYPAD = {
  '^': [1, 0],
  'A': [2, 0],
  '<': [0, 1],
  'v': [1, 1],
  '>': [2, 1],
}

const invNumericKeypad = {};
for (const [key, value] of Object.entries(NUMERIC_KEYPAD)) {
  invNumericKeypad[value.join('')] = key;
}

const invDirectionalKeypad = {};
for (const [key, value] of Object.entries(DIRECTIONAL_KEYPAD)) {
  invDirectionalKeypad[value.join('')] = key;
}

function validShortPath(startKey, endKey, keypad, invKeypad) {
  const options = [];
  if (startKey === endKey) {
    options.push([]);
    return options;
  }
  const startOffset = keypad[startKey];
  const endOffset = keypad[endKey];
  let [x, y] = startOffset;
  if (y !== endOffset[1] && [x, endOffset[1]].join('') in invKeypad) {
    // vertical first
    const moves = [];
    while (y < endOffset[1]) {
      y++;
      moves.push('v');
    }
    while (y > endOffset[1]) {
      y--;
      moves.push('^');
    }
    while (x < endOffset[0]) {
      x++;
      moves.push('>');
    }
    while (x > endOffset[0]) {
      x--;
      moves.push('<');
    }
    options.push(moves);
  }
  [x, y] = startOffset;
  if (x !== endOffset[0] && [endOffset[0], y].join('') in invKeypad) {
    // horizontal first
    const moves = [];
    while (x < endOffset[0]) {
      x++;
      moves.push('>');
    }
    while (x > endOffset[0]) {
      x--;
      moves.push('<');
    }
    while (y < endOffset[1]) {
      y++;
      moves.push('v');
    }
    while (y > endOffset[1]) {
      y--;
      moves.push('^');
    }
    options.push(moves);
  }
  return options;
}

function fewestMoves(code, layers) {
  const memo = {};

  function findFewest(startKey, endKey, level = 0) {
    const key = `${startKey}-${endKey}-${level}`;
    if (key in memo) return memo[key];
    if (level === 0) {
      const options = validShortPath(startKey, endKey, NUMERIC_KEYPAD, invNumericKeypad);
      let min = Infinity;
      for (const moves of options) {
        moves.push('A');
        let sum = 0;
        let prevMove = 'A';
        for (const move of moves) {
          sum += findFewest(prevMove, move, 1);
          prevMove = move;
        }
        if (sum < min) min = sum;
      }
      memo[key] = min;
      return min;
    } else if (level < layers - 1) {
      const options = validShortPath(startKey, endKey, DIRECTIONAL_KEYPAD, invDirectionalKeypad);
      let min = Infinity;
      for (const moves of options) {
        moves.push('A');
        let sum = 0;
        let prevMove = 'A';
        for (const move of moves) {
          sum += findFewest(prevMove, move, level + 1);
          prevMove = move;
        }
        if (sum < min) min = sum;
      }
      memo[key] = min;
      return min;
    } else {
      const options = validShortPath(startKey, endKey, DIRECTIONAL_KEYPAD, invDirectionalKeypad);
      const min = options[0].length + 1;
      memo[key] = min;
      return min;
    }
  }

  let sum = 0;
  let prevMove = 'A';
  for (const num of code) {
    sum += findFewest(prevMove, num, 0);
    prevMove = num;
  }
  return sum;
}

function sumComplexity(input, layers = 3) {
  return input.reduce((sum, code) => {
    const moves = fewestMoves(code, layers);
    return sum + moves * Number(code.slice(0, -1));
  }, 0);
}

function walk(moves) {
  const invDirectionKeypad = {};
  for (const [key, value] of Object.entries(DIRECTIONAL_KEYPAD)) {
    invDirectionKeypad[value.join('')] = key;
  }

  const keys = [];
  const currOffset = DIRECTIONAL_KEYPAD['A'];
  for (const move of moves) {
    if (move === 'A') {
      keys.push(invDirectionKeypad[currOffset.join('')]);
    } else if (move === '^') {
      currOffset[1]--;
    } else if (move === 'v') {
      currOffset[1]++;
    } else if (move === '<') {
      currOffset[0]--;
    } else if (move === '>') {
      currOffset[0]++;
    }
  }
  return keys.join('');
}

const test = load('day21', __dirname).trim().split("\n")

console.log(sumComplexity(test));
console.log(sumComplexity(test, 26));
