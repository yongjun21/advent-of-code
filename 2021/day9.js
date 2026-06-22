const load = require('../loader')

const ADJACENTS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1]
]

function calculateRisk (input) {
  const [heightMap, n, m] = getHeightMap(input)
  const heightGraph = getHeightGraph(heightMap, n, m)
  const lowPoints = getLowPoints(heightGraph)
  return lowPoints.reduce(
    (sum, pt) => sum + heightMap[pt] + 1,
    0
  )
}

function calculateBasinSize (input) {
  const [heightMap, n, m] = getHeightMap(input)
  const heightGraph = getHeightGraph(heightMap, n, m)
  const lowPoints = getLowPoints(heightGraph)
  const assignment = new Int16Array(heightMap.length)
  heightMap.forEach((v, i) => {
    if (v === 9) assignment[i] = -1
  })
  lowPoints.forEach((pt, i) => {
    assignment[pt] = i + 1
  })

  for (let k = 0; k < 10; k++) {
    heightMap.forEach((v, i) => {
      if (v !== k) return
      if (assignment[i]) return
      const candidates = new Set()
      const unvisited = []
      const visited = new Set()
      unvisited.push(i)
      while (unvisited.length > 0) {
        const next = unvisited.pop()
        if (visited.has(next)) continue
        visited.add(next)
        if (assignment[next]) {
          candidates.add(assignment[next])
        } else {
          unvisited.push(...heightGraph.get(next))
        }
      }
      if (candidates.size > 1) assignment[i] = -1
      else if (candidates.size === 1) assignment[i] = [...candidates][0]
    })
  }

  const tally = new Array(lowPoints.length).fill(0)
  assignment.forEach(v => {
    if (v > 0) tally[v - 1]++
  })

  const sortedBySize = [...tally].sort((a, b) => b - a).slice(0, 3)
  return sortedBySize[0] * sortedBySize[1] * sortedBySize[2]
}

function getHeightMap (input) {
  const n = input.length
  const m = input[0].length
  const heightMap = new Uint8Array(n * m)
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < m; i++) {
      heightMap[j * m + i] = input[j][i]
    }
  }
  return [heightMap, n, m]
}

function getHeightGraph (heightMap, n, m) {
  const graph = new Map()
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < m; i++) {
      const v = heightMap[j * m + i]
      const linked = []
      ADJACENTS.forEach(offset => {
        const x = i + offset[0]
        const y = j + offset[1]
        if (x < 0 || x >= m || y < 0 || y >= n) return
        if (v >= heightMap[y * m + x]) linked.push(y * m + x)
      })
      graph.set(j * m + i, linked)
    }
  }
  return graph
}

function getLowPoints (heightGraph) {
  const points = []
  for (const [node, linked] of heightGraph) {
    if (linked.length === 0) points.push(node)
  }
  return points
}

const test = load('day9', __dirname).trim()  .split('\n')

console.log(calculateRisk(test))
console.log(calculateBasinSize(test))
