const load = require('../loader')
const assert = require('assert');
const { findLCM } = require('./common');

function getStepsToReach(nodes, instructions) {
  for (const [steps, curr] of getNextZ(nodes, instructions, 'AAA')) {
    if (curr === 'ZZZ') return steps;
  }
}

function getStepsToReach2(nodes, instructions) {
  const nextZs = Object.keys(nodes)
    .filter(node => node[2] === 'A')
    .map(node => getNextZ(nodes, instructions, node));
  const first = nextZs.map(nextZ => nextZ.next().value[0]);
  const second = nextZs.map(nextZ => nextZ.next().value[0]);
  assert(second.every((v, i) => v === first[i] * 2));
  return findLCM(...first);
}

function* getNextZ(nodes, instructions, start) {
  const visited = new Set();
  let steps = 0;
  let index = 0;
  let curr = start;
  while (!visited.has(curr + index)) {
    visited.add(curr + index);
    if (curr[2] === 'Z') yield [steps, curr];
    curr = nodes[curr][instructions[index] === 'L' ? 0 : 1];
    steps++;
    index++;
    if (index >= instructions.length) index = 0;
  }
  let cycleLength = 0;
  let cycleSteps = 0;
  let cycleIndex = 0;
  const cycle = [];
  for (const node of visited) {
    if (node === curr + index) {
      cycleLength = steps - cycleSteps;
    }
    if (cycleLength > 0 && node[2] === 'Z') {
      cycle.push([cycleSteps, node.slice(0, 3)]);
    }
    cycleSteps++;
  }
  while (true) {
    cycle[cycleIndex][0] += cycleLength;
    yield cycle[cycleIndex];
    cycleIndex++;
    if (cycleIndex >= cycle.length) cycleIndex = 0;
  }
}

function parse(line) {
  const [parent, children] = line.split(' = ');
  return [parent, children.slice(1, -1).split(', ')];
}

const test = load('day8', __dirname)
const parts = test.split('\n\n')
const instructions = parts[0]
const nodes = Object.fromEntries(parts[1].split('\n').map(parse));

console.log(getStepsToReach(nodes, instructions));
console.log(getStepsToReach2(nodes, instructions));
