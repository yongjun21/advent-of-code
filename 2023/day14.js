const load = require('../loader')

function computeTotalLoad(input) {
  const initial = getInitialStates(input);
  const spin = spinner(initial);
  return [spin.next().value];
}

function computeTotalLoad2(input) {
  const initial = getInitialStates(input);
  const spin = spinner(initial);

  const visited = new Map();

  let next;
  const sequence = [];
  while (true) {
    let n = 8;
    while (n-- > 0) {
      next = spin.next().value;
    }
    const [load, states] = next;
    const lastVisit = visited.get(load);
    if (lastVisit) {
      for (const [prevStates, cycle] of lastVisit) {
        if (
          states.every((state, j) =>
            state.every((v, i) => prevStates[j][i] === v)
          )
        ) {
          const cycleLength = sequence.length - cycle;
          const residue = (1e9 - 1 - cycle) % cycleLength;
          return sequence[cycle + residue];
        }
      }
      lastVisit.push([states, sequence.length]);
    } else {
      visited.set(load, [[states, sequence.length]]);
    }
    sequence.push(load);
  }
}

function* spinner(initial) {
  let states = initial;

  while (true) {
    const major = states[0].length;
    const minor = states.length;

    let afterSum = 0;
    states.forEach(state => {
      let to = 0;
      let from = 0;
      while (from < major) {
        if (state[from] < 0) {
          to = from + 1;
        } else if (state[from] > 0) {
          state[from] = 0;
          state[to] = 1;
          afterSum += major - to;
          to++;
        }
        from++;
      }
    });
    yield [afterSum, states];

    const nextStates = [];
    let beforeSum = 0;
    for (let j = major - 1; j >= 0; j--) {
      const state = new Int8Array(minor);
      for (let i = 0; i < minor; i++) {
        state[i] = states[i][j];
        if (state[i] > 0) beforeSum += minor - i;
      }
      nextStates.push(state);
    }
    yield [beforeSum, states];

    states = nextStates;
  }
}

function getInitialStates(input) {
  const rows = input.length;
  const cols = input[0].length;
  const initial = [];

  for (let i = 0; i < cols; i++) {
    const state = new Int8Array(rows);
    for (let j = 0; j < rows; j++) {
      const char = input[j][i];
      if (char === '#') state[j] = -1;
      else if (char === 'O') state[j] = 1;
    }
    initial.push(state);
  }
  return initial;
}

const test = load('day14', __dirname).trim()  .split('\n')

console.log(computeTotalLoad(test));
console.log(computeTotalLoad2(test));
