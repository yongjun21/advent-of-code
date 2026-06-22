const load = require('../loader')

function walkGrid (input, start = [0, 0]) {
  let furthest = 0
  let distance = 0

  const current = [...start]

  input.split(',').forEach(direction => {
    switch (direction) {
      case 'n':
        current[1]++
        break
      case 's':
        current[1]--
        break
      case 'ne':
        current[0]++
        break
      case 'sw':
        current[0]--
        break
      case 'nw':
        current[0]--
        current[1]++
        break
      case 'se':
        current[0]++
        current[1]--
        break
    }
    distance = calculateDist(current)
    if (distance > furthest) furthest = distance
  })

  return {current, distance, furthest}
}

function calculateDist (current) {
  if (current[0] * current[1] >= 0) return Math.abs(current[0] + current[1])
  else return Math.max(Math.abs(current[0]), Math.abs(current[1]))
}

const test = load('day11', __dirname)

console.log(walkGrid(test))
