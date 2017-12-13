function searchMaze (input, start, target, maxStep = Infinity) {
  const visited = {}
  const unvisited = []

  function bfs (current) {
    const key = current.slice(0, 2).join('.')
    if (current[2] > maxStep) return true
    if (key in visited) return false
    visited[key] = isWall(+current[0], +current[1], input) ? null : current[2]
    if (visited[key] == null) return false
    if (current[0] === target[0] && current[1] === target[1]) return true
    if (current[0] > 0) unvisited.push([current[0] - 1, current[1], current[2] + 1])
    if (current[1] > 0) unvisited.push([current[0], current[1] - 1, current[2] + 1])
    unvisited.push([current[0] + 1, current[1], current[2] + 1])
    unvisited.push([current[0], current[1] + 1, current[2] + 1])
    return false
  }

  unvisited.push([start[0], start[1], 0])
  while (unvisited.length > 0) {
    const found = bfs(unvisited.shift())
    if (found) return visited
  }
  return visited
}

function isWall (x, y, salt) {
  const sum = x * x + 3 * x + 2 * x * y + y + y * y + salt
  return sum.toString(2).split('').filter(c => c === '1').length % 2 === 1
}

const test = 1358

const start = [1, 1]
const target = [31, 39]

console.log(searchMaze(test, start, target)[target.join('.')])

const fiftySteps = searchMaze(test, start, [Infinity, Infinity], 50)

console.log(Object.keys(fiftySteps).filter(key => fiftySteps[key] != null).length)
