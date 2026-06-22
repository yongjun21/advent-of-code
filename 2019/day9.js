const load = require('../loader')

const { intcode } = require('./common')

function printOutput (program, input) {
  program = [...program]
  program = intcode(program)
  program.next(input)
  return [...program]
}

const test = load('day9', __dirname).split(',').map(Number)

console.log(printOutput(test, 1))
console.log(printOutput(test, 2))
