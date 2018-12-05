function * advance () {
  let step = 1
  let x = 0
  let y = 0
  yield [x, y]
  while (true) {
    for (let right = step; right > 0; right--) {
      yield [++x, y]
    }
    for (let up = step; up > 0; up--) {
      yield [x, ++y]
    }
    step++
    for (let left = step; left > 0; left--) {
      yield [--x, y]
    }
    for (let down = step; down > 0; down--) {
      yield [x, --y]
    }
    step++
  }
}

function manhattanDistance (target) {
  let coordinates
  const location = advance()

  for (let i = 0; i < target; i++) {
    coordinates = location.next().value
  }
  return Math.abs(coordinates[0]) + Math.abs(coordinates[1])
}

function sumAdjacentSquares (target) {
  const state = {}

  const offsets = []
  const around = advance()
  while (offsets.length < 9) {
    offsets.push(around.next().value)
  }
  offsets.shift()

  function sumAdjacent (coord) {
    const keys = offsets.map(offset => {
      return [coord[0] + offset[0], coord[1] + offset[1]].join('.')
    })
    return keys.reduce((sum, key) => {
      if (key in state) return sum + state[key]
      return sum
    }, 0)
  }
  let value = 0
  const location = advance()
  while (value <= target) {
    const coordinates = location.next().value
    value = sumAdjacent(coordinates)
    state[coordinates.join('.')] = value || 1
  }
  return value
}

const test = 361527

console.log(manhattanDistance(test))
console.log(sumAdjacentSquares(test))
