const load = require('../loader')

const assert = require('assert');

const DIRECTION = ['R', 'D', 'L', 'U'];

const OFFSET = {
  R: [1, 0],
  D: [0, 1],
  L: [-1, 0],
  U: [0, -1]
};

const EDGE_TYPE = {
  RR: '-',
  DD: '|',
  LL: '-',
  UU: '|',
  RD: '7',
  DL: 'J',
  LU: 'L',
  UR: 'F',
  UL: '7',
  LD: 'F',
  DR: 'L',
  RU: 'J'
};

function fillLagoon(input) {
  let xs = new Set();
  let ys = new Set();
  let x = 0;
  let y = 0;
  input.forEach(row => {
    xs.add(x);
    ys.add(y);
    const { direction, steps } = row;
    x += OFFSET[direction][0] * steps;
    y += OFFSET[direction][1] * steps;
  });
  assert(x === 0 && y === 0);
  xs = [...xs].sort((a, b) => a - b);
  ys = [...ys].sort((a, b) => a - b);

  const width = xs.length;
  const height = ys.length;

  const edges = new Map();
  let prevDirection = '';
  const iStart = xs.indexOf(0);
  const jStart = ys.indexOf(0);
  let i = iStart;
  let j = jStart;
  input.forEach(row => {
    const { direction, steps } = row;
    x += OFFSET[direction][0] * steps;
    y += OFFSET[direction][1] * steps;
    const nextI = xs.indexOf(x);
    const nextJ = ys.indexOf(y);

    let jumps = Math.abs(nextI === i ? nextJ - j : nextI - i);

    while (jumps-- > 0) {
      edges.set(j * width + i, EDGE_TYPE[prevDirection + direction]);
      i += OFFSET[direction][0];
      j += OFFSET[direction][1];
      prevDirection = direction;
    }
  });
  assert(i === iStart && j === jStart);

  edges.set(
    j * width + i,
    EDGE_TYPE[input[input.length - 1].direction + input[0].direction]
  );

  let count = 0;
  let greenCount;
  for (let j = 0; j < height; j++) {
    if (j > 0) count += (ys[j] - ys[j - 1] - 1) * greenCount;
    let color = 'red';
    let greenStart = -1;
    let strictGreenStart = -1;
    greenCount = 0;
    for (let i = 0; i < width; i++) {
      const type = edges.get(j * width + i);
      if (type) {
        if (type === '|') {
          if (color === 'red') {
            color = 'green';
            greenStart = xs[i];
            strictGreenStart = xs[i];
          } else {
            color = 'red';
            greenCount += xs[i] - greenStart - 1;
            count += xs[i] - strictGreenStart - 1;
          }
        }
        if (type === 'L') {
          if (color === 'red') color = 'yellow';
          else count += xs[i] - strictGreenStart - 1;
        }
        if (type === 'F') {
          if (color === 'red') {
            color = 'green';
            greenStart = xs[i];
          } else {
            color = 'yellow';
            greenCount += xs[i] - greenStart - 1;
            count += xs[i] - strictGreenStart - 1;
          }
        }
        if (type === 'J') {
          if (color === 'yellow') color = 'red'
          else strictGreenStart = xs[i];
        }
        if (type === '7') {
          if (color === 'yellow') {
            color = 'green';
            greenStart = xs[i];
            strictGreenStart = xs[i];
          } else {
            color = 'red';
            greenCount += xs[i] - greenStart - 1;
          }
        }
      }
    }
  }
  count += input.reduce((sum, row) => sum + row.steps, 0);
  return count;
}

function parse(line) {
  const [direction, steps] = line.split(' ');
  return { direction, steps: Number(steps) };
}

function parse2(line) {
  const color = line.slice(-7, -1);
  return {
    direction: DIRECTION[color.slice(-1)],
    steps: parseInt(color.slice(0, 5), 16)
  };
}

const test = load('day18', __dirname).trim()  .split('\n')

console.log(fillLagoon(test.map(parse)));
console.log(fillLagoon(test.map(parse2)));
