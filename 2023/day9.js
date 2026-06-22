const load = require('../loader')

function sumExtrapolated(input, backward = false) {
  return input.reduce(
    (sum, sequence) => sum + extrapolate(sequence, backward),
    0
  );
}

function extrapolate(sequence, backward = false) {
  const diffSequences = [];
  let curr = sequence;
  while (curr.some(v => v !== 0)) {
    const diff = [];
    for (let i = 1; i < curr.length; i++) {
      diff.push(curr[i] - curr[i - 1]);
    }
    diffSequences.push(diff);
    curr = diff;
  }
  return backward
    ? sequence[0] -
        diffSequences.reduce((sum, sequence, i) =>
          i % 2 === 0 ? sum + sequence[0] : sum - sequence[0],
          0
        )
    : sequence[sequence.length - 1] +
        diffSequences.reduce(
          (sum, sequence) => sum + sequence[sequence.length - 1],
          0
        );
}

const test = load('day9', __dirname).trim()  .split('\n')  .map(line => line.split(' ').map(Number))

console.log(sumExtrapolated(test));
console.log(sumExtrapolated(test, true));
