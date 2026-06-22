const load = require('../loader')

function configureIndicator(input) {
  return input.reduce((sum, row) => {
    let fewest = row.buttons.length;
    for (let n = 0; n < 2 ** row.buttons.length; n++) {
      const presses = row.buttons.reduce(
        (sum, _, i) => sum + readAssignment(n, i),
        0
      );
      if (presses >= fewest) continue;
      const result = row.buttons.reduce(
        (xor, { encoded }, i) => (readAssignment(n, i) ? xor ^ encoded : xor),
        0
      );
      if (result === row.target) fewest = presses;
    }
    return sum + fewest;
  }, 0);
}

function configureJoltage(input) {
  function solve(requirements, buttons) {
    if (requirements.every(v => v === 0)) return 0;
    const target = requirements.reduce(
      (sum, v, i) => sum + (v & 1) * (1 << i),
      0
    );
    const partialSolutions = [];
    for (let n = 0; n < 2 ** buttons.length; n++) {
      const result = buttons.reduce(
        (xor, { encoded }, i) => (readAssignment(n, i) ? xor ^ encoded : xor),
        0
      );
      if (result !== target) continue;
      let presses = 0;
      const nextState = [...requirements];
      buttons.forEach(({ values }, i) => {
        if (readAssignment(n, i)) {
          for (const v of values) nextState[v]--;
          presses++;
        }
      });
      if (nextState.some(v => v < 0)) continue;
      nextState.forEach((v, i) => {
        nextState[i] = v >> 1;
      });
      partialSolutions.push([presses, nextState]);
    }
    if (partialSolutions.length === 0) return Infinity;
    const score = partialSolutions.map(([presses, nextState]) => {
      return presses + 2 * solve(nextState, buttons);
    });
    return Math.min(...score);
  }
  return input.reduce(
    (sum, row) => sum + solve(row.requirements, row.buttons),
    0
  );
}

function readAssignment(n, i) {
  return (n >> i) & 1;
}

function parse(line) {
  const splitted = line.split(' ');

  const target = [...splitted[0].slice(1, -1)].reduce(
    (sum, char, i) => (char === '#' ? sum + (1 << i) : sum),
    0
  );

  const buttons = splitted.slice(1, -1).map(str => {
    const values = str
      .slice(1, -1)
      .split(',')
      .map(Number)
      .sort((a, b) => a - b);
    const encoded = values.reduce((sum, i) => sum + (1 << i), 0);
    return { values, encoded };
  });

  const requirements = splitted[splitted.length - 1]
    .slice(1, -1)
    .split(',')
    .map(Number);

  return { target, buttons, requirements };
}

const test = load('day10', __dirname).trim()  .split('\n')  .map(parse)

console.log(configureIndicator(test));
console.log(configureJoltage(test));
