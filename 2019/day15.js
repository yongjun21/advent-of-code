const load = require('../loader')

const { intcode } = require('./common')

function fewestMovement (input) {
  const map = explore(input)
  return Object.values(map).find(v => v.status === 2).path.length
}

function fillOxygen (input) {
  const forward = explore(input)
  const starting = Object.keys(forward).find(k => forward[k].status === 2)
    .split(',').map(Number)
  starting.push(forward[starting].path)
  const backward = explore(input, starting)
  return Object.values(backward).reduce((max, v) => v.path.length > max ? v.path.length : max, 0) - starting[2].length
}

function explore (input, starting = [0, 0, []]) {
  const movements = [
    [0, 1, 1],
    [0, -1, 2],
    [-1, 0, 3],
    [1, 0, 4]
  ]

  const visited = {}
  const unvisited = []
  unvisited.push(starting)

  while (unvisited.length > 0) {
    const next = unvisited.shift()
    const key = next.slice(0, 2)
    const path = next[2]
    if (visited[key]) continue
    let status = 1
    const program = intcode([...input])
    for (const command of path) {
      program.next(command)
      status = program.next().value
    }
    visited[key] = { status, path }
    if (status === 0) continue
    movements.forEach(([dx, dy, command]) => {
      unvisited.push([key[0] + dx, key[1] + dy, path.concat(command)])
    })
  }
  return visited
}

const test = load('day15', __dirname).split(',').map(Number)

console.log(fewestMovement(test))
console.log(fillOxygen(test))
