function invertGraph(graph) {
  const inverted = new Map();
  graph.forEach((adj, node) => {
    adj.forEach(src => {
      const dst = inverted.get(src) ?? [];
      dst.push(node);
      inverted.set(src, dst);
    });
  });
  return inverted;
}

function getTopologicalOrder(graph) {
  const order = [];

  const predecessors = new Map();

  graph.forEach((adj, node) => {
    if (!predecessors.has(node)) predecessors.set(node, 0);
    adj.forEach((a) => predecessors.set(a, (predecessors.get(a) ?? 0) + 1));
  });

  while (predecessors.size > 0) {
    let root = null;
    for (const [node, count] of predecessors) {
      if (count === 0) {
        root = node;
        break;
      }
    }
    if (root === null) break;

    /**
     * two stacks to manage DFS
     * in `callStack` 0 means advance (function start), 1 means backtrack (function end)
     * node gets pushed to the stacks twice as start/end pair because we need to run code in both cases
     * in `callers` we track the upstream nodes that are being visited for cycle detection
     */
    const callStack = [];
    const calleeStack = [];
    const callers = new Set();

    callStack.push(1, 0);
    calleeStack.push(root, root);

    while (callStack.length > 0) {
      const status = callStack.pop();
      const curr = calleeStack.pop();
      if (status === 0) {
        if (callers.has(curr)) {
          // cycle detected
          return null;
        }
        callers.add(curr);
        for (const adj of graph.get(curr) ?? []) {
          if (!predecessors.has(adj)) continue;
          callStack.push(1, 0);
          calleeStack.push(adj, adj);
        }
      } else {
        order.push(curr);
        callers.delete(curr);
        predecessors.delete(curr);
      }
    }
  }

  if (predecessors.size > 0) {
    // no more roots even though some nodes unvisited
    return null;
  }

  return order.reverse();
}

function unionRunEnds(curr, next) {
  return boolRunEnds(curr, next, 1, 3);
}

function* boolRunEnds(curr, next, a = 1, b = 3) {
  /*
    0: currState, 1: !currState, 2: nextState, 3: !nextState
    a: condition to yield nextIndex (0 or 1)
    b: condition to yield currIndex (2 or 3)
  */
  const state = [false, true, false, true];

  const nextIter = next[Symbol.iterator]();
  let nextIndex = nextIter.next();
  for (const currIndex of curr) {
    while (!nextIndex.done && nextIndex.value < currIndex) {
      if (state[a]) yield nextIndex.value;
      nextIndex = nextIter.next();
      // flip next state
      state[2] = !state[2];
      state[3] = !state[3];
    }

    if (nextIndex.done && !state[b]) return;

    if (nextIndex.done || nextIndex.value > currIndex) {
      if (state[b]) yield currIndex;
      // flip curr state
      state[0] = !state[0];
      state[1] = !state[1];
    } else {
      if (state[a] === state[b]) yield currIndex;
      nextIndex = nextIter.next();
      // flip curr & next state
      state[0] = !state[0];
      state[1] = !state[1];
      state[2] = !state[2];
      state[3] = !state[3];
    }
  }
  if (state[a]) {
    while (!nextIndex.done) {
      yield nextIndex.value;
      nextIndex = nextIter.next();
    }
  }
}

exports.invertGraph = invertGraph;
exports.getTopologicalOrder = getTopologicalOrder;
exports.unionRunEnds = unionRunEnds;
