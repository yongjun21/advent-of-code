const load = require('../loader')

const { intcode } = require('./common')

function testNounVerb (program, noun, verb) {
  program = [...program]
  program[1] = noun
  program[2] = verb
  intcode(program)
  return program[0]
}

function findNounVerb (input, output) {
  for (let noun = 0; noun < 100; noun++) {
    for (let verb = 0; verb < 100; verb++) {
      if (testNounVerb(input, noun, verb) === output) return 100 * noun + verb
    }
  }
}

const test = load('day2', __dirname).split(',').map(Number)

console.log(testNounVerb(test, 12, 2))
console.log(findNounVerb(test, 19690720))
