const load = require('../loader')

function countPossible(patterns, designs) {
  const root = { key: "", children: [], isLeaf: false };

  function insertTrie(node, pattern, index) {
    if (index >= pattern.length) {
      node.isLeaf = true;
    } else {
      const key = pattern[index];
      let child = node.children.find(child => child.key === key);
      if (!child) {
        const newChild = { key, children: [], isLeaf: false };
        node.children.push(newChild);
        child = newChild;
      }
      insertTrie(child, pattern, index + 1);
    }
  }

  patterns.forEach(pattern => insertTrie(root, pattern, 0));

  function* prefixMatch(design, index, node, matchedUpTo = "") {
    if (index >= design.length) return;
    const nextKey = design[index];
    const child = node.children.find(child => child.key === nextKey);
    if (!child) return;
    matchedUpTo += nextKey;
    if (child.isLeaf) yield matchedUpTo;
    yield* prefixMatch(design, index + 1, child, matchedUpTo);
  }

  const memo = new Map();

  function possible(designIndex, index) {
    const memoKey = index * designs.length + designIndex;
    if (memo.has(memoKey)) return memo.get(memoKey);
    const design = designs[designIndex];
    if (index >= design.length) return 1;
    let count = 0;
    for (const matched of prefixMatch(design, index, root)) {
      if (possible(designIndex, index + matched.length)) {
        count += possible(designIndex, index + matched.length);
      }
    }
    memo.set(memoKey, count);
    return count;
  }

  return designs.map((_, index) => possible(index, 0));
}


const test = load('day19', __dirname)
const parts = test.split('\n\n')
const patterns = parts[0].split(', ');
const designs = parts[1].split('\n');

console.log(countPossible(patterns, designs).reduce((count, possible) => possible > 0 ? count + 1 : count, 0));
console.log(countPossible(patterns, designs).reduce((sum, possible) => sum + possible, 0));
