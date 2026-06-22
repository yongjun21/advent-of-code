const load = require('../loader')

const CHAR_ENCODE = {
  '#': -1,
  '.': 0,
  O: 1,
  '@': 0
};

const CHAR_ENCODE_2 = {
  '#': [-1, -1],
  '.': [0, 0],
  O: [2, 3],
  '@': [0, 0]
};

const CHAR_DECODE = {
  "-1": "#",
  "0": ".",
  "1": "O",
  "2": "[",
  "3": "]"
};

function sumGPS(map, moves) {
  const width = map[0].length;
  const height = map.length;

  let currX = -1;
  let currY = -1;
  const state = new Int8Array(width * height);
  for (let j = 0; j < height; j++) {
    const line = map[j];
    for (let i = 0; i < width; i++) {
      const index = j * width + i;
      state[index] = CHAR_ENCODE[line[i]];
      if (line[i] === '@') {
        currX = i;
        currY = j;
      }
    }
  }

  for (const char of moves) {
    if (char === '>') {
      for (let x = currX + 1; x < width; x++) {
        const next = state[currY * width + x];
        if (next < 0) break;
        else if (next === 0) {
          if (x > currX + 1) {
            state[currY * width + currX + 1] = 0;
            state[currY * width + x] = 1;
          }
          currX++;
          break;
        }
      }
    }

    if (char === '<') {
      for (let x = currX - 1; x >= 0; x--) {
        const next = state[currY * width + x];
        if (next < 0) break;
        else if (next === 0) {
          if (x < currX - 1) {
            state[currY * width + currX - 1] = 0;
            state[currY * width + x] = 1;
          }
          currX--;
          break;
        }
      }
    }

    if (char === 'v') {
      for (let y = currY + 1; y < height; y++) {
        const next = state[y * width + currX];
        if (next < 0) break;
        else if (next === 0) {
          if (y > currY + 1) {
            state[(currY + 1) * width + currX] = 0;
            state[y * width + currX] = 1;
          }
          currY++;
          break;
        }
      }
    }

    if (char === '^') {
      for (let y = currY - 1; y >= 0; y--) {
        const next = state[y * width + currX];
        if (next < 0) break;
        else if (next === 0) {
          if (y < currY - 1) {
            state[(currY - 1) * width + currX] = 0;
            state[y * width + currX] = 1;
          }
          currY--;
          break;
        }
      }
    }
  }

  let sum = 0;
  state.forEach((s, i) => {
    if (s === 1) {
      const x = i % width;
      const y = Math.floor(i / width);
      sum += y * 100 + x;
    }
  });
  return sum;
}

function sumGPS2(map, moves) {
  const halfWidth = map[0].length;
  const height = map.length;
  const width = halfWidth * 2;

  let currX = -1;
  let currY = -1;
  const state = new Int8Array(width * height);
  for (let j = 0; j < height; j++) {
    const line = map[j];
    for (let i = 0; i < halfWidth; i++) {
      const index = j * width + 2 * i;
      state[index] = CHAR_ENCODE_2[line[i]][0];
      state[index + 1] = CHAR_ENCODE_2[line[i]][1];
      if (line[i] === '@') {
        currX = 2 * i;
        currY = j;
      }
    }
  }

  function moveDown(x, y, test = false) {
    if (state[(y + 1) * width + x] < 0) return false;
    if (state[(y + 1) * width + x + 1] < 0) return false;
    let canMove = true;
    if (state[(y + 1) * width + x] === 2) {
      canMove = moveDown(x, y + 1, test);
    } else {
      if (state[(y + 1) * width + x] === 3) {
        canMove &&= moveDown(x - 1, y + 1, test);
      }
      if (state[(y + 1) * width + x + 1] === 2) {
        canMove &&= moveDown(x + 1, y + 1, test);
      }
    }
    if (!test && canMove) {
      state[y * width + x] = 0;
      state[y * width + x + 1] = 0;
      state[(y + 1) * width + x] = 2;
      state[(y + 1) * width + x + 1] = 3;
    }
    return canMove;
  }

  function moveUp(x, y, test = false) {
    if (state[(y - 1) * width + x] < 0) return false;
    if (state[(y - 1) * width + x + 1] < 0) return false;
    let canMove = true;
    if (state[(y - 1) * width + x] === 2) {
      canMove = moveUp(x, y - 1, test);
    } else {
      if (state[(y - 1) * width + x] === 3) {
        canMove &&= moveUp(x - 1, y - 1, test);
      }
      if (state[(y - 1) * width + x + 1] === 2) {
        canMove &&= moveUp(x + 1, y - 1, test);
      }
    }
    if (!test && canMove) {
      state[y * width + x] = 0;
      state[y * width + x + 1] = 0;
      state[(y - 1) * width + x] = 2;
      state[(y - 1) * width + x + 1] = 3;
    }
    return canMove;
  }

  for (const char of moves) {
    if (char === '>') {
      for (let x = currX + 1; x < width; x += 2) {
        const next = state[currY * width + x];
        if (next < 0) break;
        else if (next === 0) {
          state[currY * width + currX + 1] = 0;
          while (x > currX + 1) {
            state[currY * width + x] = 3;
            state[currY * width + x - 1] = 2;
            x -= 2;
          }
          currX++;
          break;
        }
      }
    }

    if (char === '<') {
      for (let x = currX - 1; x >= 0; x--) {
        const next = state[currY * width + x];
        if (next < 0) break;
        else if (next === 0) {
          state[currY * width + currX - 1] = 0;
          while (x < currX - 1) {
            state[currY * width + x] = 2;
            state[currY * width + x + 1] = 3;
            x += 2;
          }
          currX--;
          break;
        }
      }
    }

    if (char === 'v') {
      const next = state[(currY + 1) * width + currX];
      if (next === 0) {
        currY++;
      } else if (next === 2) {
        if (moveDown(currX, currY + 1, true)) {
          moveDown(currX, currY + 1, false);
          currY++;
        }
      } else if (next === 3) {
        if (moveDown(currX - 1, currY + 1, true)) {
          moveDown(currX - 1, currY + 1, false);
          currY++;
        }
      }
    }

    if (char === '^') {
      const next = state[(currY - 1) * width + currX];
      if (next === 0) {
        currY--;
      } else if (next === 2) {
        if (moveUp(currX, currY - 1, true)) {
          moveUp(currX, currY - 1, false);
          currY--;
        }
      } else if (next === 3) {
        if (moveUp(currX - 1, currY - 1, true)) {
          moveUp(currX - 1, currY - 1, false);
          currY--;
        }
      }
    }
  }

  let sum = 0;
  state.forEach((s, i) => {
    if (s === 2) {
      const x = i % width;
      const y = Math.floor(i / width);
      sum += y * 100 + x;
    }
  });
  return sum;
}

function renderMap(state, width, height, currX, currY) {
  const lines = [];
  for (let j = 0; j < height; j++) {
    let line = '';
    for (let i = 0; i < width; i++) {
      const index = j * width + i;
      if (i === currX && j === currY) {
        line += '@';
      } else {
        line += CHAR_DECODE[state[index]];
      }
    }
    lines.push(line);
  }
  return lines.join('\n');
}

const test = load('day15', __dirname)
const parts = test.split('\n\n')
const map = parts[0].split('\n');
const moves = parts[1];

console.log(sumGPS(map, moves));
console.log(sumGPS2(map, moves));