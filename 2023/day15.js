const load = require('../loader')

function sumHash(input) {
  return input.split(',').reduce((sum, token) => sum + hash(token), 0);
}

function sumFocusingPower(input) {
  const boxes = [];
  for (let i = 0; i < 256; i++) boxes.push(new Map());
  input.split(',').forEach(token => {
    const match = token.match(/^([a-z]+)(=|-)(\d*)$/);
    const label = match[1];
    const ops = match[2];
    const box = hash(label);
    if (ops === '=') {
      boxes[box].set(label, Number(match[3]));
    } else {
      boxes[box].delete(label);
    }
  });
  let sum = 0;
  boxes.forEach((box, i) => {
    let j = 0;
    for (const f of box.values()) {
      sum += (i + 1) * (j + 1) * f;
      j++;
    }
  });
  return sum;
}

function hash(token) {
  let curr = 0;
  for (let i = 0; i < token.length; i++) {
    const code = token.charCodeAt(i);
    curr += code;
    curr *= 17;
    curr &= 255;
  }
  return curr;
}

const test = load('day15', __dirname)

console.log(sumHash(test));
console.log(sumFocusingPower(test));
