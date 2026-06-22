const load = require('../loader')

const { MinHeap } = require('./common')

const ADJACENTS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1]
]

function findLowestRisk (input, N = 1, M = 1) {
  const [riskMap, n, m] = getRiskMap(input, N, M)
  const riskGraph = getRiskGraph(n, m)
  const unvisited = new MinHeap((a, b) => a[1] - b[1])
  const visited = new Map()
  unvisited.push([0, 0])
  while (unvisited.size > 0) {
    const [next, steps] = unvisited.pop()
    const best = visited.get(next)
    if (best != null && steps >= best) continue
    visited.set(next, steps)
    for (const node of riskGraph.get(next)) {
      unvisited.push([node, steps + riskMap[node]])
    }
  }
  return visited.get(n * m - 1)
}

function getRiskMap (input, N = 1, M = 1) {
  const n = input.length
  const m = input[0].length
  const heightMap = new Uint8Array(N * M * n * m)
  for (let J = 0; J < N; J++) {
    for (let I = 0; I < M; I++) {
      for (let j = 0; j < n; j++) {
        for (let i = 0; i < m; i++) {
          let v = input[j][i]
          v += I + J
          v = ((v - 1) % 9) + 1
          heightMap[J * M * n * m + j * M * m + I * m + i] = v
        }
      }
    }
  }
  return [heightMap, n * N, m * M]
}

function getRiskGraph (n, m) {
  const graph = new Map()
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < m; i++) {
      const linked = []
      ADJACENTS.forEach(offset => {
        const x = i + offset[0]
        const y = j + offset[1]
        if (x < 0 || x >= m || y < 0 || y >= n) return
        linked.push(y * m + x)
      })
      graph.set(j * m + i, linked)
    }
  }
  return graph
}

const test = load('day15', __dirname).trim()  .split('\n')

console.log(findLowestRisk(test))
console.log(findLowestRisk(test, 5, 5))
