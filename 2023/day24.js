/* eslint-disable no-labels */
const load = require('../loader')

const { getFactors } = require('./common');

function findSingleThrow(input) {
  const candidateXYZ = [null, null, null];
  outer: for (let i = 0; i < input.length - 1; i++) {
    for (let j = i + 1; j < input.length; j++) {
      for (let k = 0; k < 3; k++) {
        if (candidateXYZ[k] && candidateXYZ[k].length === 1) continue;
        if (input[i].velocity[k] === input[j].velocity[k]) {
          const dx = input[i].position[k] - input[j].position[k];
          const factors = [...getFactors(Math.abs(dx))];
          const candidates = [];
          factors.forEach(f => {
            candidates.push(input[i].velocity[k] + f, input[i].velocity[k] - f);
          });
          if (candidateXYZ[k]) {
            candidateXYZ[k] = candidateXYZ[k].filter(v =>
              candidates.includes(v)
            );
          } else {
            candidateXYZ[k] = [...new Set(candidates)];
          }
        }
      }
      if (
        candidateXYZ.every(candidates => candidates && candidates.length === 1)
      )
        break outer;
    }
  }
  const velocityXYZ = candidateXYZ.map(candidates => candidates[0]);

  const indices = [0, 1];

  const dvx0 = input[indices[0]].velocity[0] - velocityXYZ[0];
  const dvx1 = input[indices[1]].velocity[0] - velocityXYZ[0];
  const dvy0 = input[indices[0]].velocity[1] - velocityXYZ[1];
  const dvy1 = input[indices[1]].velocity[1] - velocityXYZ[1];

  const positionXY = solveLinear(
    -dvy0,
    -dvy1,
    dvx0,
    dvx1,
    dvx0 * input[indices[0]].position[1] - dvy0 * input[indices[0]].position[0],
    dvx1 * input[indices[1]].position[1] - dvy1 * input[indices[1]].position[0]
  );

  const positionZ =
    input[indices[0]].position[2] +
    ((positionXY[0] - input[indices[0]].position[0]) /
      (velocityXYZ[0] - input[indices[0]].velocity[0])) *
      (velocityXYZ[2] - input[indices[0]].velocity[2]);

  return (
    Math.round(positionXY[0]) +
    Math.round(positionXY[1]) +
    Math.round(positionZ)
  );
}

function countIntersections(input, range = [2e14, 4e14]) {
  input.forEach(row => {
    row.a = -row.velocity[1];
    row.b = row.velocity[0];
    row.c =
      row.velocity[0] * row.position[1] - row.velocity[1] * row.position[0];
  });

  let count = 0;
  for (let i = 0; i < input.length - 1; i++) {
    for (let j = i + 1; j < input.length; j++) {
      const solved = solveLinear(
        input[i].a,
        input[j].a,
        input[i].b,
        input[j].b,
        input[i].c,
        input[j].c
      );

      if (!solved) continue;
      const [x, y] = solved;

      if (x < range[0] || x > range[1]) continue;
      if (y < range[0] || y > range[1]) continue;

      if ((x - input[i].position[0]) / input[i].velocity[0] < 0) continue;
      if ((x - input[j].position[0]) / input[j].velocity[0] < 0) continue;

      count++;
    }
  }

  return count;
}

function solveLinear(a, b, c, d, e, f) {
  const det = a * d - b * c;
  if (det === 0) return null;

  const invA = d / det;
  const invB = -b / det;
  const invC = -c / det;
  const invD = a / det;

  return [invA * e + invC * f, invB * e + invD * f];
}

function parse(line) {
  const [position, velocity] = line.split(' @ ');
  return {
    position: position.split(', ').map(Number),
    velocity: velocity.split(', ').map(Number)
  };
}

const test = load('day24', __dirname).trim()  .split('\n')  .map(parse)

console.log(countIntersections(test));
console.log(findSingleThrow(test));
