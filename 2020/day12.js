const load = require('../loader')

function navigate (input) {
  const state = [0, 0, 0]
  input.forEach(inst => {
    if (inst.type === 'E') {
      state[0] += inst.value
    } else if (inst.type === 'N') {
      state[1] += inst.value
    } else if (inst.type === 'W') {
      state[0] -= inst.value
    } else if (inst.type === 'S') {
      state[1] -= inst.value
    } else if (inst.type === 'F' && state[2] === 0) {
      state[0] += inst.value
    } else if (inst.type === 'F' && state[2] === 1) {
      state[1] += inst.value
    } else if (inst.type === 'F' && state[2] === 2) {
      state[0] -= inst.value
    } else if (inst.type === 'F' && state[2] === 3) {
      state[1] -= inst.value
    } else if (inst.type === 'L') {
      state[2] = (state[2] + inst.value / 90) % 4
    } else if (inst.type === 'R') {
      state[2] = (state[2] + 4 - inst.value / 90) % 4
    }
  })
  return Math.abs(state[0]) + Math.abs(state[1])
}

function navigate2 (input) {
  const state = [0, 0]
  const waypoint = [10, 1]
  input.forEach(inst => {
    if (inst.type === 'E') {
      waypoint[0] += inst.value
    } else if (inst.type === 'N') {
      waypoint[1] += inst.value
    } else if (inst.type === 'W') {
      waypoint[0] -= inst.value
    } else if (inst.type === 'S') {
      waypoint[1] -= inst.value
    } else if ((inst.type === 'L' && inst.value === 90) || (inst.type === 'R' && inst.value === 270)) {
      const x = -waypoint[1]
      const y = waypoint[0]
      waypoint[0] = x
      waypoint[1] = y
    } else if ((inst.type === 'L' && inst.value === 270) || (inst.type === 'R' && inst.value === 90)) {
      const x = waypoint[1]
      const y = -waypoint[0]
      waypoint[0] = x
      waypoint[1] = y
    } else if ((inst.type === 'L' && inst.value === 180) || (inst.type === 'R' && inst.value === 180)) {
      const x = -waypoint[0]
      const y = -waypoint[1]
      waypoint[0] = x
      waypoint[1] = y
    } else if (inst.type === 'F') {
      state[0] += inst.value * waypoint[0]
      state[1] += inst.value * waypoint[1]
    }
  })
  return Math.abs(state[0]) + Math.abs(state[1])
}

function parse (line) {
  return {
    type: line[0],
    value: +line.slice(1)
  }
}

const test = load('day12', __dirname).trim().split('\n').map(parse)

console.log(navigate(test))
console.log(navigate2(test))
