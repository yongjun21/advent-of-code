const load = require('../loader')

function countDisintegratable(input) {
  input = countSupport(input);
  return input.filter(curr => curr.strictSupporting.size === 0).length;
}

function sumBrickfall(input) {
  input = countSupport(input);
  return input.reduce((sum, curr) => sum + curr.strictSupporting.size, 0);
}

function freefall(input) {
  input = structuredClone(input);
  input.sort((a, b) => a.start[2] - b.start[2]);
  input.forEach((curr, i) => {
    for (let j = i - 1; j >= 0; j--) {
      const prev = input[j];
      if (
        curr.start[0] <= prev.end[0] &&
        curr.end[0] >= prev.start[0] &&
        curr.start[1] <= prev.end[1] &&
        curr.end[1] >= prev.start[1]
      ) {
        if (curr.restStartZ < prev.restEndZ + 1) {
          curr.restStartZ = prev.restEndZ + 1;
          curr.restEndZ = prev.restEndZ + 1 + (curr.end[2] - curr.start[2]);
        }
      }
    }
    if (curr.restStartZ < 0) {
      curr.restStartZ = 1;
      curr.restEndZ = 1 + curr.end[2] - curr.start[2];
    }
  });
  return input;
}

function determineSupport(input) {
  input = freefall(input);
  input.sort((a, b) => a.restStartZ - b.restStartZ);
  input.forEach((curr, i) => {
    for (let j = i + 1; j < input.length; j++) {
      const above = input[j];
      if (above.restStartZ > curr.restEndZ + 1) break;
      if (above.restStartZ < curr.restEndZ + 1) continue;
      if (
        curr.start[0] <= above.end[0] &&
        curr.end[0] >= above.start[0] &&
        curr.start[1] <= above.end[1] &&
        curr.end[1] >= above.start[1]
      ) {
        curr.supporting.push(above);
        above.supportedBy.push(curr);
      }
    }
  });
  return input;
}

function countSupport(input) {
  input = determineSupport(input);
  input.reverse();
  input.forEach(curr => {
    curr.supporting.forEach(child => {
      if (child.supportedBy.length <= 1) {
        curr.strictSupporting.add(child);
        for (const nested of child.strictSupporting) {
          curr.strictSupporting.add(nested);
        }
      } else {
        curr.nonStrictSupporting.add(child);
        for (const nested of child.strictSupporting) {
          curr.nonStrictSupporting.add(nested);
        }
      }
      for (const nested of child.nonStrictSupporting) {
        curr.nonStrictSupporting.add(nested);
      }
    });
    while (true) {
      const prevCount = curr.nonStrictSupporting.size;
      for (const nested of curr.nonStrictSupporting) {
        if (
          nested.supportedBy.every(parent => curr.strictSupporting.has(parent))
        ) {
          curr.strictSupporting.add(nested);
          curr.nonStrictSupporting.delete(nested);
        }
      }
      if (curr.nonStrictSupporting.size === prevCount) break;
    }
  });
  return input;
}

function parse(line) {
  const [left, right] = line.split('~');
  const start = left.split(',').map(Number);
  const end = right.split(',').map(Number);
  const axis = start[0] !== end[0] ? 0 : start[1] !== end[1] ? 1 : 2;
  return {
    start: start[axis] < end[axis] ? start : end,
    end: start[axis] < end[axis] ? end : start,
    restStartZ: -1,
    restEndZ: -1,
    axis,
    supporting: [],
    supportedBy: [],
    strictSupporting: new Set(),
    nonStrictSupporting: new Set()
  };
}

const test = load('day22', __dirname).trim()  .split('\n')  .map(parse)

console.log(countDisintegratable(test));
console.log(sumBrickfall(test));
