const { getCombinations } = require('../helpers')

function getTotalEnergy (steps, initial) {
  const simulation = simulate(initial)
  simulation.next()
  let state
  while (steps-- > 0) {
    state = simulation.next().value
  }
  return state.reduce((sum, e) => {
    return sum +
      (Math.abs(e[0]) + Math.abs(e[1]) + Math.abs(e[2])) *
      (Math.abs(e[3]) + Math.abs(e[4]) + Math.abs(e[5]))
  }, 0)
}

function findRepeat (initial) {
  const simulation = simulate(initial)
  const observed = {}
  let cycleX, cycleY, cycleZ

  let steps = 0
  for (const state of simulation) {
    if (cycleX && cycleY && cycleZ) break

    if (!cycleX) {
      const keyX = state.map(e => 'x' + e[0] + ',' + e[3]).join('\n')
      if (keyX in observed) cycleX = steps - observed[keyX]
      else observed[keyX] = steps
    }

    if (!cycleY) {
      const keyY = state.map(e => 'x' + e[1] + ',' + e[4]).join('\n')
      if (keyY in observed) cycleY = steps - observed[keyY]
      else observed[keyY] = steps
    }

    if (!cycleZ) {
      const keyZ = state.map(e => 'x' + e[2] + ',' + e[5]).join('\n')
      if (keyZ in observed) cycleZ = steps - observed[keyZ]
      else observed[keyZ] = steps
    }

    steps++
  }

  return findLCM(cycleX, cycleY, cycleZ)
}

function * simulate (initial) {
  const state = initial.map(e => new Int16Array([e.x, e.y, e.z, 0, 0, 0]))
  const pairs = getCombinations(state, 2)

  while (true) {
    yield state

    pairs.forEach(([a, b]) => {
      if (a[0] > b[0]) {
        a[3]--
        b[3]++
      } else if (a[0] < b[0]) {
        a[3]++
        b[3]--
      }
      if (a[1] > b[1]) {
        a[4]--
        b[4]++
      } else if (a[1] < b[1]) {
        a[4]++
        b[4]--
      }
      if (a[2] > b[2]) {
        a[5]--
        b[5]++
      } else if (a[2] < b[2]) {
        a[5]++
        b[5]--
      }
    })

    state.forEach(e => {
      e[0] += e[3]
      e[1] += e[4]
      e[2] += e[5]
    })
  }
}

function findLCM (...numbers) {
  const combined = {}
  numbers.forEach(n => {
    const factors = {}
    getFactors(n).forEach(f => {
      factors[f] = factors[f] || 0
      factors[f]++
    })
    Object.keys(factors).forEach(f => {
      if (!(f in combined) || factors[f] > combined[f]) combined[f] = factors[f]
    })
  })
  return Object.entries(combined).reduce((product, [f, n]) => {
    return product * Math.pow(+f, n)
  }, 1)
}

function getFactors (number) {
  for (let f = 2; f < number; f++) {
    if (number % f === 0) {
      return [f].concat(getFactors(number / f))
    }
  }
  return [number]
}

const test = [
  { x: -19, y: -4, z: 2 },
  { x: -9, y: 8, z: -16 },
  { x: -4, y: 5, z: -11 },
  { x: 1, y: 9, z: -13 }
]

console.log(getTotalEnergy(1000, test))
console.log(findRepeat(test))
