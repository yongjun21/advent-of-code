const load = require('../loader')

function findSubGraphSizes(input) {
  while (true) {
    const test = karger(input);
    const cuts = [...Object.values(test)[0].links.values()][0];
    if (cuts === 3) {
      return Object.values(test).reduce(
        (product, node) => product * node.subgraph,
        1
      );
    }
  }
}

function karger(input) {
  const nodes = {};
  input.forEach(row => {
    nodes[row.from] = nodes[row.from] || createNode(row.from);
    row.to.forEach(to => {
      nodes[to] = nodes[to] || createNode(to);
    });
  });
  input.forEach(row => {
    row.to.forEach(to => {
      nodes[row.from].links.set(nodes[to], 1);
      nodes[to].links.set(nodes[row.from], 1);
    });
  });

  let n = Object.keys(nodes).length;
  while (n > 2) {
    const i = Math.floor(Math.random() * n);
    const keepNode = nodes[Object.keys(nodes)[i]];
    let j = Math.floor(Math.random() * keepNode.links.size);
    let mergeNode;
    for (const node of keepNode.links.keys()) {
      if (j <= 0) {
        mergeNode = node;
        break;
      }
      j--;
    }

    keepNode.subgraph += mergeNode.subgraph;
    for (const [node, count] of mergeNode.links) {
      if (node !== keepNode) {
        keepNode.links.set(node, (keepNode.links.get(node) ?? 0) + count);
        node.links.set(keepNode, (node.links.get(keepNode) ?? 0) + count);
      }
      node.links.delete(mergeNode);
    }
    delete nodes[mergeNode.label];
    n--;
  }
  return nodes;
}

function createNode(label) {
  return {
    label,
    subgraph: 1,
    // links: []
    links: new Map()
  };
}

function parse(line) {
  const [from, to] = line.split(': ');
  return {
    from,
    to: to.split(' ')
  };
}

const test = load('day25', __dirname).trim()  .split('\n')  .map(parse)

console.log(findSubGraphSizes(test));
