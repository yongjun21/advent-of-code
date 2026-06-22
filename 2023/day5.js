const load = require('../loader')

function findLowestLocation(input, maps) {
  maps.forEach(map => {
    const mapped = [];
    for (const row of map) {
      const unmapped = [];
      input.forEach(target => {
        const applied = applyMap(row, target);
        mapped.push(...applied.mapped);
        unmapped.push(...applied.unmapped);
      });
      input = unmapped;
    }
    input.push(...mapped);
  });
  return input.reduce((min, [n]) => (n < min ? n : min), Infinity);
}

function applyMap(map, target) {
  if (target[0] >= map[1] + map[2]) {
    return { mapped: [], unmapped: [target] };
  }
  if (target[0] + target[1] <= map[1]) {
    return { mapped: [], unmapped: [target] };
  }

  const start = Math.max(target[0], map[1]);
  const end = Math.min(target[0] + target[1], map[1] + map[2]);
  const mapped = [[map[0] + start - map[1], end - start]];
  const unmapped = [];
  if (target[0] < map[1]) {
    unmapped.push([target[0], map[1] - target[0]]);
  }
  if (target[0] + target[1] > map[1] + map[2]) {
    unmapped.push([map[1] + map[2], target[0] + target[1] - map[1] - map[2]]);
  }
  return { mapped, unmapped };
}

function parseMap(block) {
  return block
    .split('\n')
    .slice(1)
    .map(line => line.split(' ').map(Number));
}

const test = load('day5', __dirname)
const parts = test.split('\n\n')
const seeds = parts[0].split(',').map(Number)
const MAPS = parts.slice(1).map(parseMap);

const test1 = seeds.map(n => [n, 1]);
const test2 = [];
for (let i = 0; i < seeds.length; i += 2) {
  test2.push([seeds[i], seeds[i + 1]]);
}
console.log(findLowestLocation(test1, MAPS));
console.log(findLowestLocation(test2, MAPS));
