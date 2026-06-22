const load = require('../loader')

const {getCombinations} = require('../lazyHelpers')

function parseInput (input) {
  return input.trim().split('\n').slice(2).map(line => {
    const match = line.match(/node-x(\d+)-y(\d+)\s+(\d+)T\s+(\d+)T\s+(\d+)T\s+(\d+)%$/)
    return {
      x: +match[1],
      y: +match[2],
      size: +match[3],
      used: +match[4],
      avail: +match[5],
      full: +match[6] / 100
    }
  })
}

function findViablePairs (nodes) {
  const viablePairs = []
  for (let [a, b] of getCombinations(nodes, 2)) {
    if (a.used > 0 && a.used <= b.avail) viablePairs.push([a, b])
    if (b.used > 0 && b.used <= a.avail) viablePairs.push([b, a])
  }
  return viablePairs
}

function moveData (nodes) {
  const grid = {}
  nodes.forEach(node => {
    grid[[node.x, node.y].join('.')] = node
  })

  nodes.forEach(node => {
    node.neighbours = []
    const up = grid[[node.x, node.y - 1].join('.')]
    const down = grid[[node.x, node.y + 1].join('.')]
    const left = grid[[node.x - 1, node.y].join('.')]
    const right = grid[[node.x + 1, node.y].join('.')]
    if (up && node.used <= up.size) node.neighbours.push(up)
    if (down && node.used <= down.size) node.neighbours.push(down)
    if (left && node.used <= left.size) node.neighbours.push(left)
    if (right && node.used <= right.size) node.neighbours.push(right)
  })

  const maxX = nodes.reduce((max, node) => node.x > max ? node.x : max, 0)

  let lastNode = grid[[maxX, 0].join('.')]

  const primaryPath = bfs(lastNode, grid['0.0'])

  const viablePairs = findViablePairs(nodes)
  const starts = viablePairs.filter(pair => {
    const delta = Math.abs(pair[0].x - pair[1].x) + Math.abs(pair[0].y - pair[1].y)
    return delta === 1
  }).map(pair => pair[0])

  let steps = starts.reduce((min, start) => {
    const steps = bfs(primaryPath[0], start).length + 1
    return steps < min ? steps : min
  }, Infinity)

  let block = primaryPath.shift()
  steps++

  while (primaryPath.length > 0) {
    steps += bfs(primaryPath[0], lastNode, {[[block.x, block.y].join('.')]: null}).length
    lastNode = block
    block = primaryPath.shift()
    steps++
  }

  return steps
}

function bfs (start, end, visited = {}) {
  const unvisited = []
  unvisited.push([start, []])

  while (unvisited.length > 0) {
    const [node, path] = unvisited.shift()
    const key = [node.x, node.y].join('.')
    if (key in visited) continue
    visited[key] = path
    if (node === end) return path
    node.neighbours.forEach(n => {
      unvisited.push([n, [...path, n]])
    })
  }
}

const test = load('day22', __dirname)

const nodes = parseInput(test)

console.log(findViablePairs(nodes).length)
console.log(moveData(nodes))
