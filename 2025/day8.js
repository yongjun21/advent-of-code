const load = require('../loader')

function connect(input, stop = () => false) {
  const n = input.length;
  const pairs = [];
  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      const pair = {
        a: input[i],
        b: input[j],
        d2: (input[i][0] - input[j][0]) ** 2 + (input[i][1] - input[j][1]) ** 2 + (input[i][2] - input[j][2]) ** 2,
      };
      pairs.push(pair);
    }
  }
  pairs.sort((a, b) => a.d2 - b.d2);
  const circuits = new Map();
  const members = new Map();
  const remap = new Map();
  let g = 0;
  let k = 0;
  let lastPair = null;
  for (const pair of pairs) {
    if (stop(k, members)) return [members, lastPair];
    const { a, b } = pair;
    lastPair = pair;
    if (circuits.has(a) && circuits.has(b)) {
      const aGroup = getRemapped(remap, circuits.get(a));
      const bGroup = getRemapped(remap, circuits.get(b));
      if (aGroup !== bGroup) {
        remap.set(Math.max(aGroup, bGroup), Math.min(aGroup, bGroup));
        members.set(Math.min(aGroup, bGroup), members.get(aGroup) + members.get(bGroup));
      }
    } else if (circuits.has(a)) {
      const aGroup = getRemapped(remap, circuits.get(a));
      circuits.set(b, aGroup);
      members.set(aGroup, members.get(aGroup) + 1);
    } else if (circuits.has(b)) {
      const bGroup = getRemapped(remap, circuits.get(b));
      circuits.set(a, bGroup);
      members.set(bGroup, members.get(bGroup) + 1);
    } else {
      g++;
      circuits.set(a, g);
      circuits.set(b, g);
      members.set(g, 2);
    }
    k++;
  }

  return members;
}

function threeLargest(input, n = 1000) {
  const [members] = connect(input, k => k >= n);
  const sorted = [...members.values()].sort((a, b) => b - a);
  return sorted.slice(0, 3).reduce((product, v) => product * v, 1);
}

function oneLarge(input) {
  const [_, lastPair] = connect(input, (_, members) => members.get(1) === input.length);
  return lastPair.a[0] * lastPair.b[0];
}

function getRemapped(remap, value) {
  while (remap.has(value)) {
    value = remap.get(value);
  }
  return value;
}

const test = load('day8', __dirname).trim().split('\n').map(line => line.split(',').map(Number))

console.log(threeLargest(test));
console.log(oneLarge(test));
