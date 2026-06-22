const load = require('../loader')

const { intcode, printState } = require('./common')

const OFFSETS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0]
]

function paint (input, state = {}) {
  const location = [0, 0]
  let direction = 0
  const program = intcode([...input])
  while (true) {
    if (program.next(state[location] || 0).done) break
    state[location] = program.next().value
    program.next().value ? direction++ : direction--
    if (direction >= 4) direction = 0
    if (direction < 0) direction = 3
    const offset = OFFSETS[direction]
    location[0] += offset[0]
    location[1] += offset[1]
  }
  return state
}

const test = load('day11', __dirname).split(',').map(Number)

console.log(Object.keys(paint(test)).length)
printState(paint(test, { '0,0': 1 }), { 1: 'o' })
