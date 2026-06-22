const load = require('../loader')

function simulateFallingSand (input) {
  const [structure, maxLevel] = getStructure(input)
  const rockCount = structure.size
  while (true) {
    const [x, y] = simulate(structure, maxLevel)
    if (y < maxLevel) structure.add(`${x},${y}`)
    else return structure.size - rockCount
  }
}

function simulateFallingSand2 (input) {
  const [structure, maxLevel] = getStructure(input)
  const rockCount = structure.size
  while (true) {
    const [x, y] = simulate(structure, maxLevel + 1)
    if (x === 500 && y === 0) return structure.size - rockCount + 1
    else structure.add(`${x},${y}`)
  }
}

function getStructure (input) {
  let maxLevel = 0
  const structure = new Set()
  input.forEach(row => {
    const [x, y] = row[0]
    structure.add(`${x},${y}`)
    maxLevel = Math.max(maxLevel, y)
    for (let i = 1; i < row.length; i++) {
      for (const [x, y] of draw(row[i - 1], row[i])) {
        structure.add(`${x},${y}`)
      }
      maxLevel = Math.max(maxLevel, row[i][1])
    }
  })
  return [structure, maxLevel]
}

function simulate (structure, maxLevel) {
  let x = 500
  let y = 0
  while (y < maxLevel) {
    if (!structure.has(`${x},${y + 1}`)) {
      y += 1
      continue
    } else if (!structure.has(`${x - 1},${y + 1}`)) {
      x -= 1
      y += 1
      continue
    } else if (!structure.has(`${x + 1},${y + 1}`)) {
      x += 1
      y += 1
      continue
    }
    return [x, y]
  }
  return [x, y]
}

function * draw (start, end) {
  if (start[0] < end[0]) {
    let x = start[0]
    while (++x <= end[0]) {
      yield [x, start[1]]
    }
  } else if (start[0] > end[0]) {
    let x = start[0]
    while (--x >= end[0]) {
      yield [x, start[1]]
    }
  } else if (start[1] < end[1]) {
    let y = start[1]
    while (++y <= end[1]) {
      yield [start[0], y]
    }
  } else if (start[1] > end[1]) {
    let y = start[1]
    while (--y >= end[1]) {
      yield [start[0], y]
    }
  }
}

function parse (line) {
  return line.split(' -> ').map(substr => substr.split(',').map(Number))
}

const test = load('day14', __dirname).trim().split('\n').map(parse)

console.log(simulateFallingSand(test))
console.log(simulateFallingSand2(test))
