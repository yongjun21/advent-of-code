const load = require('../loader')

function simulate (input, steps = 80) {
  let pointer = 0
  const state = new Array(9).fill(0)
  input.forEach(v => {
    state[v]++
  })
  while (steps-- > 0) {
    const add = state[pointer]
    pointer = (pointer + 1) % 9
    const pointer6 = (pointer + 6) % 9
    state[pointer6] += add
  }
  return state.reduce((sum, v) => sum + v, 0)
}

const test = load('day6', __dirname).split(',').map(Number)

console.log(simulate(test))
console.log(simulate(test, 256))
