const load = require('../loader')

function findTriangles (input) {
  const candidates = input.trim().split('\n').map(line => {
    return line.trim().replace(/\s\s+/g, ' ').split(' ').map(v => +v)
  })

  return candidates.filter(sides => {
    sides.sort((a, b) => a - b)
    return sides[0] + sides[1] > sides[2]
  }).length
}

function findTriangles2 (input) {
  const matrix = input.trim().split('\n').map(line => {
    return line.trim().replace(/\s\s+/g, ' ').split(' ').map(v => +v)
  })

  const candidates = []
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < matrix.length; i += 3) {
      candidates.push([matrix[i][j], matrix[i + 1][j], matrix[i + 2][j]])
    }
  }

  return candidates.filter(sides => {
    sides.sort((a, b) => a - b)
    return sides[0] + sides[1] > sides[2]
  }).length
}

const test = load('day3', __dirname)

console.log(findTriangles(test))
console.log(findTriangles2(test))
