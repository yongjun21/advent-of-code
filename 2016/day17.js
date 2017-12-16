const md5 = require('md5')

function findPaths (input) {
  const unvisited = []
  unvisited.push([1, 1, ''])
  const paths = []
  while (unvisited.length > 0) {
    const [x, y, path] = unvisited.shift()
    if (x === 4 && y === 4) {
      paths.push(path)
      continue
    }
    const hash = md5(input + path)
    if (y > 1 && hash[0] > 'a') unvisited.push([x, y - 1, path + 'U'])
    if (y < 4 && hash[1] > 'a') unvisited.push([x, y + 1, path + 'D'])
    if (x > 1 && hash[2] > 'a') unvisited.push([x - 1, y, path + 'L'])
    if (x < 4 && hash[3] > 'a') unvisited.push([x + 1, y, path + 'R'])
  }
  return paths
}

function findShortestPath (input) {
  return findPaths(input)[0]
}

function findLongestPath (input) {
  const paths = findPaths(input)
  return paths[paths.length - 1]
}

const test = 'mmsxrhfx'

console.log(findShortestPath(test))
console.log(findLongestPath(test).length)
