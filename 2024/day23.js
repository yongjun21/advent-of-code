const load = require('../loader')

function findInterConnectedSets(input, n = Infinity) {
  const setOfTwo = new Set(input.map(pair => pair.sort().join(',')));

  let curr = [...setOfTwo];
  let size = 2;

  while (size < n) {
    const adjacency = {};
    for (const g of curr) {
      const splitted = g.split(",");
      const prefix = splitted.slice(0, -1).join(",");
      const tail = splitted[splitted.length - 1];
      adjacency[prefix] = adjacency[prefix] || [];
      adjacency[prefix].push(tail);
    }

    const groups = [];
    Object.keys(adjacency).forEach(key => {
      const adj = adjacency[key].sort();
      for (let i = 0; i < adj.length - 1; i++) {
        for (let j = i + 1; j < adj.length; j++) {
          if (setOfTwo.has(`${adj[i]},${adj[j]}`)) {
            groups.push([key, adj[i], adj[j]].join(','));
          }
        }
      }
    });
    
    curr = groups;
    if (curr.length <= 1) break;
    size++;
  }
  return curr;
}

function findLargestInterConnectedSet(input) {
  const setOfTwo = new Set(input.map(pair => pair.sort().join(',')));
  const setOfThree = [...findInterConnectedSetOfThree(input)].map(group =>
    group.split(',')
  );

  let largestSets = setOfThree;

  while (largestSets.length > 1) {
    const setOfN = new Set();
    for (let i = 0; i < largestSets.length - 1; i++) {
      if (i % 1000 === 0) console.log(i);
      for (let j = i + 1; j < largestSets.length; j++) {
        const a = largestSets[i];
        const b = largestSets[j];
        const union = {};
        for (const x of a) {
          union[x] = union[x] || 0;
          union[x]++;
        }
        for (const x of b) {
          union[x] = union[x] || 0;
          union[x]++;
        }
        if (Object.keys(union).length === 4) {
          const diff = [];
          const intersection = [];
          for (const member in union) {
            if (union[member] === 1) diff.push(member);
            else intersection.push(member);
          }
          if (setOfTwo.has([diff[0], diff[1]].sort().join(','))) {
            setOfFour.add([...intersection, ...diff].sort().join(','));
          }
        }
      }
    }
  }
  return setOfFour.size;
}

const test = load('day23', __dirname).trim()  .split('\n')  .map(line => line.split('-'))

console.log(
  findInterConnectedSets(test, 3).filter(group => /\bt/.test(group)).length
);
console.log(findInterConnectedSets(test)[0]);
