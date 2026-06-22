const load = require('../loader')

const { getTopologicalOrder, invertGraph } = require('./common');

function enumeratePaths(input, src = 'you', dst = 'out', blocked = []) {
  const graph = new Map();
  input.forEach(([key, value]) => {
    graph.set(key, value);
  });

  const subset = new Map();

  const unvisited = [];
  unvisited.push(src);
  while (unvisited.length > 0) {
    const curr = unvisited.pop();
    if (!graph.has(curr)) continue;
    if (blocked.includes(curr)) continue;
    if (subset.has(curr)) continue;
    const next = graph.get(curr);
    if (next.includes(dst)) {
      subset.set(curr, [dst]);
      continue;
    } else {
      subset.set(curr, next);
    }
    next.forEach(node => {
      unvisited.push(node);
    });
  }

  const inverted = invertGraph(subset);
  const topologicalOrder = getTopologicalOrder(subset);
  const paths = {};

  topologicalOrder.forEach(node => {
    if (node === src) {
      paths[node] = 1;
      return;
    }
    const parents = inverted.get(node);
    if (parents) paths[node] = parents.reduce((sum, parent) => sum + paths[parent], 0);
  });

  return paths[dst] ?? 0;
}

function enumeratePathsWithConstraints(input) {
  return (
    enumeratePaths(input, 'svr', 'dac', ['fft', 'out']) *
      enumeratePaths(input, 'dac', 'fft', ['out']) *
      enumeratePaths(input, 'fft', 'out', ['dac']) +
    enumeratePaths(input, 'svr', 'fft', ['dac', 'out']) *
      enumeratePaths(input, 'fft', 'dac', ['out']) *
      enumeratePaths(input, 'dac', 'out', ['fft'])
  );
}

const test = load('day11', __dirname).trim()  .split('\n')  .map(line => {
    const [left, right] = line.split(': ');
    return [left, right.split(' ')];
  });

console.log(enumeratePaths(test));
console.log(enumeratePathsWithConstraints(test));
