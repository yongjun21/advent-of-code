const load = require('../loader')

function simulate(instructions, initialState) {
  const state = {};
  for (const row of instructions) {
    const { in1, in2, out } = row;
    state[in1] = -1;
    state[in2] = -1;
    state[out] = -1;
  }
  Object.assign(state, initialState);

  let settled = Object.keys(initialState).length;

  while (settled < Object.keys(state).length) {
    for (const row of instructions) {
      const { in1, in2, out, op } = row;
      if (state[in1] >= 0 && state[in2] >= 0) {
        if (state[out] < 0) {
          if (op === 'AND') {
            state[out] = state[in1] & state[in2];
          } else if (op === 'OR') {
            state[out] = state[in1] | state[in2];
          } else if (op === 'XOR') {
            state[out] = state[in1] ^ state[in2];
          }
          settled++;
        }
      }
    }
  }

  let output = 0;
  for (const key in state) {
    if (key.startsWith('z')) {
      if (state[key] > 0) {
        const power = Number(key.slice(1));
        output += Math.pow(2, power);
      }
    }
  }
  return output;
}

/**
 * Z(n) = XOR(n) ^ COV(n)
 * CNX(n) = COV(n) & XOR(n)
 * COV(n) = AND(n - 1) | CNX(n - 1)
 * 
 * Special handling for:
 * COV1 = AND0
 */
function interpret(instructions, replacement = {}) {
  const interpretations = {};
  let changed = true;
  while (changed) {
    changed = false;
    for (const row of instructions) {
      const { in1, in2, out: unconfirmedOut, op } = row;
      const out = replacement[unconfirmedOut] || unconfirmedOut;
      if (interpretations[out]) continue;
      if (
        (in1.startsWith('x') && in2.startsWith('y')) ||
        (in1.startsWith('y') && in2.startsWith('x'))
      ) {
        const x = Number(in1.slice(1));
        const y = Number(in2.slice(1));
        if (x === y) {
        interpretations[out] = `${op}${x}`;
        changed = true;
        }
        continue;
      }

      let in1Interpretation = interpretations[in1];
      let in2Interpretation = interpretations[in2];
      if (!in1Interpretation || !in2Interpretation) continue;
      if (
        (in1Interpretation.startsWith('COV') &&
          in2Interpretation.startsWith('XOR') &&
          op === 'XOR') ||
        (in1Interpretation.startsWith('XOR') &&
          in2Interpretation.startsWith('COV') &&
          op === 'XOR')
      ) {
        const x = Number(in1Interpretation.slice(3));
        const y = Number(in2Interpretation.slice(3));
        if (x === y) {
          interpretations[out] = `Z${x}`;
          changed = true;
        }
        continue;
      }
      if (
        (in1Interpretation.startsWith('COV') &&
          in2Interpretation.startsWith('XOR') &&
          op === 'AND') ||
        (in1Interpretation.startsWith('XOR') &&
          in2Interpretation.startsWith('COV') &&
          op === 'AND')
      ) {
        const x = Number(in1Interpretation.slice(3));
        const y = Number(in2Interpretation.slice(3));
        if (x === y) {
          interpretations[out] = `CNX${x}`;
          changed = true;
        }
        continue;
      }
      if (
        (in1Interpretation.startsWith('AND') &&
          in2Interpretation.startsWith('CNX') &&
          op === 'OR') ||
        (in1Interpretation.startsWith('CNX') &&
          in2Interpretation.startsWith('AND') &&
          op === 'OR')
      ) {
        const x = Number(in1Interpretation.slice(3));
        const y = Number(in2Interpretation.slice(3));
        if (x === y) {
          interpretations[out] = `COV${x + 1}`;
          changed = true;
        }
        continue;
      }

      // special case for COV1 === AND0
      if (
        (in1Interpretation === 'XOR1' &&
          in2Interpretation === 'AND0' &&
          op === 'XOR') ||
        (in1Interpretation === 'AND0' &&
          in2Interpretation === 'XOR1' &&
          op === 'XOR')
      ) {
        interpretations[out] = 'Z1';
        changed = true;
        continue;
      }
      if (
        (in1Interpretation === 'AND0' &&
          in2Interpretation === 'XOR1' &&
          op === 'AND') ||
        (in1Interpretation === 'XOR1' &&
          in2Interpretation === 'AND0' &&
          op === 'AND')
      ) {
        interpretations[out] = 'CNX1';
        changed = true;
        continue;
      }
    }
  }
  return interpretations;
}

function selfCorrect(instructions, manual) {
  let maxZ = -1;
  let msZ = '';
  instructions.forEach(({ out }) => {
    if (out.startsWith('z')) {
      const z = Number(out.slice(1))
      if (z > maxZ) {
        maxZ = z;
        msZ = out;
      }
    }
  })
  let interpreted = {};
  let replacement = { ...manual };
  while (interpreted[msZ] !== `COV${maxZ}`) {
    for (const out in interpreted) {
      if (!out.startsWith('z') && interpreted[out].startsWith('Z')) {
        const n = Number(interpreted[out].slice(1));
        replacement[out] = `z${n}`;
        replacement[`z${n}`] = out;
      }
    }
    interpreted = interpret(instructions, replacement);
  }
  return Object.keys(replacement).sort().join(',');
}

function parse(line) {
  const splitted = line.split(' ');
  return {
    op: splitted[1],
    in1: splitted[0],
    in2: splitted[2],
    out: splitted[4]
  };
}

function parseInitialState(raw) {
  return Object.fromEntries(
    raw.map(line => {
      const splitted = line.split(': ');
      return [splitted[0], Number(splitted[1])];
    })
  );
}

const [initialStateInput, testInput] = load('day24', __dirname).trim().split('\n\n')
const initialState = initialStateInput.split('\n')
const test = testInput.split('\n').map(parse)

console.log(simulate(test, parseInitialState(initialState)));
console.log(selfCorrect(test, { ctg: 'rpb', rpb: 'ctg' }))
