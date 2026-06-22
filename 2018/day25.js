const load = require('../loader')

function countConstellations (input) {
  input.forEach((pt, i) => {
    pt.index = i
    pt.adjacents = []
  })
  for (let i = 0; i < input.length - 1; i++) {
    for (let j = i; j < input.length; j++) {
      if (manhatten(input[i], input[j]) <= 3) {
        input[i].adjacents.push(input[j])
        input[j].adjacents.push(input[i])
      }
    }
  }

  const visited = []
  const unvisited = []

  while (input.some((pt, i) => visited[i] == null)) {
    const root = input.find((pt, i) => visited[i] == null)
    unvisited.push(root)
    while (unvisited.length > 0) {
      const next = unvisited.pop()
      if (next.index in visited) continue
      visited[next.index] = root
      next.adjacents.forEach(adj => {
        unvisited.push(adj)
      })
    }
  }

  const groups = {}
  visited.forEach((group, index) => {
    groups[group.index] = groups[group.index] || []
    groups[group.index].push(input[index])
  })

  return Object.keys(groups).length
}

function manhatten (src, dest) {
  return src.reduce((sum, v, i) => sum + Math.abs(v - dest[i]), 0)
}

function parse (line) {
  return line.split(',').map(Number)
}

const test = load('day25', __dirname).trim().split('\n').map(parse)

console.log(countConstellations(test))
