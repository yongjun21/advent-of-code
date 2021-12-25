const { MinHeap } = require('./common')

const TYPES = 'ABCD'
const ENERGY = new Map([[1, 1], [2, 10], [3, 100], [4, 1000]])
const HALLWAY_STOPS = getHallwayStops()

function findLeastEnergy (initialState) {
  const maxY = getMaxY(initialState)
  const unvisited = new MinHeap((a, b) => a[1] - b[1])
  const visited = new Map()
  unvisited.push([{ ...initialState }, 0])
  while (unvisited.size > 0) {
    const [state, energy] = unvisited.pop()
    const serializedState = serialize(state)
    if (energy >= (visited.get(serializedState) || Infinity)) continue
    visited.set(serializedState, energy)
    Object.keys(state).forEach(orig => {
      const v = state[orig]
      getValidMoves(state, orig, maxY).forEach(([dest, dEnergy]) => {
        const newState = { ...state }
        delete newState[orig]
        newState[dest] = v
        unvisited.push([newState, energy + dEnergy])
      })
    })
  }
  return visited.get(getOrganizedState(maxY))
}

function getValidMoves (state, key, maxY = 2) {
  const [x, y] = key.split(',').map(Number)
  const v = state[key]
  if (y > 0 && x === 2 * v) {
    let n = maxY
    while (n > y) {
      if (state[`${2 * v},${n}`] !== v) break
      n--
    }
    if (n <= y) return []
  }
  for (let n = maxY; n > 0; n--) {
    let m = n + 1
    while (m <= maxY) {
      if (state[`${2 * v},${m}`] !== v) break
      m++
    }
    if (m > maxY) {
      const steps = hasClearPath(state, [x, y], [2 * v, n])
      if (steps > -1) return [[`${2 * v},${n}`, steps * ENERGY.get(v)]]
    }
  }
  if (y > 0) {
    return HALLWAY_STOPS
      .map(i => [`${i},0`, hasClearPath(state, [x, y], [i, 0]) * ENERGY.get(v)])
      .filter(([key, steps]) => steps > -1)
  }
  return []
}

function hasClearPath (state, [x0, y0], [x1, y1]) {
  let steps = 0
  for (let y = y1; y > 0; y--) {
    if (state[`${x1},${y}`]) return -1
    steps++
  }
  if (x1 >= x0) {
    for (let x = x1; x > x0; x--) {
      if (state[`${x},0`]) return -1
      steps++
    }
  } else {
    for (let x = x1; x < x0; x++) {
      if (state[`${x},0`]) return -1
      steps++
    }
  }
  for (let y = 0; y < y0; y++) {
    if (state[`${x0},${y}`]) return -1
    steps++
  }
  return steps
}

function serialize (state) {
  const sortedEntries = Object.entries(state).sort((a, b) => {
    if (a[0] < b[0]) return -1
    if (a[0] > b[0]) return 1
    return 0
  })
  return JSON.stringify(sortedEntries)
}

function getMaxY (state) {
  let maxY = 0
  Object.keys(state).forEach(key => {
    const y = key.split(',').map(Number)[1]
    maxY = Math.max(maxY, y)
  })
  return maxY
}

function getHallwayStops () {
  const stops = []
  for (let i = 0; i < 11; i++) {
    if (ENERGY.has(i / 2)) continue
    stops.push(i)
  }
  return stops
}

function getOrganizedState (maxY) {
  const state = {}
  ;[...ENERGY.keys()].forEach(v => {
    for (let n = 1; n <= maxY; n++) {
      state[`${2 * v},${n}`] = v
    }
  })
  return serialize(state)
}

function printState (state) {
  console.log(new Array(13).fill('#').join(''))
  for (let y = 0; y <= 2; y++) {
    let line = '#'
    for (let x = 0; x < 11; x++) {
      const v = state[`${x},${y}`]
      const empty = (y === 0 || ENERGY.has(x / 2)) ? '.' : '#'
      line += v ? TYPES[v - 1] : empty
    }
    line += '#'
    console.log(line)
  }
  console.log(new Array(13).fill('#').join(''))
  console.log('')
}

const initialState = {
  '2,1': 1,
  '2,2': 4,
  '4,1': 3,
  '4,2': 4,
  '6,1': 2,
  '6,2': 1,
  '8,1': 2,
  '8,2': 3
}

const initialState2 = {
  '2,1': 1,
  '2,2': 4,
  '2,3': 4,
  '2,4': 4,
  '4,1': 3,
  '4,2': 3,
  '4,3': 2,
  '4,4': 4,
  '6,1': 2,
  '6,2': 2,
  '6,3': 1,
  '6,4': 1,
  '8,1': 2,
  '8,2': 1,
  '8,3': 3,
  '8,4': 3
}

console.log(findLeastEnergy(initialState))
console.log(findLeastEnergy(initialState2))
