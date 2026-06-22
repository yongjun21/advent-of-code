const load = require('../loader')

const ADJACENTS = {
  e: [1, 0],
  w: [-1, 0],
  ne: [0, 1],
  sw: [0, -1],
  nw: [-1, 1],
  se: [1, -1]
}

function flip (input) {
  const flipped = new Set()
  input.forEach(row => {
    const tile = [0, 0]
    row.forEach(v => {
      const offset = ADJACENTS[v]
      tile[0] += offset[0]
      tile[1] += offset[1]
    })
    const key = tile.join(',')
    if (flipped.has(key)) flipped.delete(key)
    else flipped.add(key)
  })
  return flipped
}

function run (state, n) {
  let prev = state
  while (n-- > 0) {
    const next = new Set()
    for (const key of prev) {
      const ref = key.split(',').map(Number)
      const adjBlacks = countAdjBlacks(prev, ref)
      if (adjBlacks > 0 && adjBlacks <= 2) next.add(key)
      Object.values(ADJACENTS).forEach(offset => {
        const adj = [ref[0] + offset[0], ref[1] + offset[1]]
        const k = adj.join(',')
        if (!prev.has(k) && countAdjBlacks(prev, adj) === 2) {
          next.add(k)
        }
      })
    }
    prev = next
  }
  return prev
}

function countAdjBlacks (state, ref) {
  let count = 0
  Object.values(ADJACENTS).forEach(offset => {
    const key = (ref[0] + offset[0]) + ',' + (ref[1] + offset[1])
    if (state.has(key)) count++
  })
  return count
}

function parse (line) {
  let index = 0
  const row = []
  while (index < line.length) {
    if (line[index] === 'n' || line[index] === 's') {
      row.push(line.slice(index, index + 2))
      index += 2
    } else {
      row.push(line[index])
      index++
    }
  }
  return row
}

const test = load('day24', __dirname).trim().split('\n').map(parse)

console.log(flip(test).size)
console.log(run(flip(test), 100).size)
