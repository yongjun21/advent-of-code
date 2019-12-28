function biodiversityRating (input) {
  let state = new Uint8Array(49)
  input.forEach((row, y) => {
    row.forEach((v, x) => {
      if (v === '#') state[(y + 1) * 7 + (x + 1)] = 1
    })
  })

  const layouts = new Set()

  while (true) {
    const serialized = state.toString()
    if (layouts.has(serialized)) {
      return state.reduce((sum, v, i) => {
        const x = i % 7 - 1
        const y = (i - x - 1) / 7 - 1
        return sum + Math.pow(2, y * 5 + x) * v
      }, 0)
    } else {
      layouts.add(serialized)
    }
    state = cycle(state)
  }
}

function countBugs (input, cycles) {
  let states = []
  const state0 = new Uint8Array(49)
  states.push(state0)
  input.forEach((row, y) => {
    row.forEach((v, x) => {
      if (v === '#') state0[(y + 1) * 7 + (x + 1)] = 1
    })
  })
  states.push(new Uint8Array(49))
  states.push(new Uint8Array(49))

  for (let i = 0; i < cycles; i++) states = cycle2(states)

  return states.reduce((sum, state) => sum + state.reduce((sum, v) => sum + v), 0)
}

function cycle (state) {
  const updated = new Uint8Array(49)
  for (let y = 1; y <= 5; y++) {
    for (let x = 1; x <= 5; x++) {
      const curr = state[y * 7 + x]
      const adj = [
        state[(y - 1) * 7 + x],
        state[(y + 1) * 7 + x],
        state[y * 7 + x - 1],
        state[y * 7 + x + 1]
      ].reduce((sum, v) => sum + v)
      if (curr) updated[y * 7 + x] = adj === 1
      else updated[y * 7 + x] = adj === 1 || adj === 2
    }
  }
  return updated
}

function cycle2 (states) {
  states.push(new Uint8Array(49))
  states.push(new Uint8Array(49))
  return states.map((state, k) => {
    if (k >= states.length - 2) return state
    const updated = new Uint8Array(49)
    const kMinus = k === 0 ? 1 : k % 2 === 0 ? k - 2 : k + 2
    const kPlus = k === 1 ? 0 : k % 2 === 0 ? k + 2 : k - 2
    for (let y = 1; y <= 5; y++) {
      for (let x = 1; x <= 5; x++) {
        if (x === 3 && y === 3) continue
        const curr = state[y * 7 + x]
        const adj = [
          state[(y - 1) * 7 + x],
          state[(y + 1) * 7 + x],
          state[y * 7 + x - 1],
          state[y * 7 + x + 1]
        ]
        if (y === 1) adj.push(states[kMinus][2 * 7 + 3])
        if (y === 5) adj.push(states[kMinus][4 * 7 + 3])
        if (x === 1) adj.push(states[kMinus][3 * 7 + 2])
        if (x === 5) adj.push(states[kMinus][3 * 7 + 4])
        if (y === 2 && x === 3) {
          for (let x = 1; x <= 5; x++) adj.push(states[kPlus][1 * 7 + x])
        }
        if (y === 4 && x === 3) {
          for (let x = 1; x <= 5; x++) adj.push(states[kPlus][5 * 7 + x])
        }
        if (y === 3 && x === 2) {
          for (let y = 1; y <= 5; y++) adj.push(states[kPlus][y * 7 + 1])
        }
        if (y === 3 && x === 4) {
          for (let y = 1; y <= 5; y++) adj.push(states[kPlus][y * 7 + 5])
        }
        const adjCount = adj.reduce((sum, v) => sum + v)
        if (curr) updated[y * 7 + x] = adjCount === 1
        else updated[y * 7 + x] = adjCount === 1 || adjCount === 2
      }
    }
    return updated
  })
}

const test = `
..#..
##..#
##...
#####
.#.##
`.trim().split('\n').map(line => line.split(''))

console.log(biodiversityRating(test))
console.log(countBugs(test, 200))
