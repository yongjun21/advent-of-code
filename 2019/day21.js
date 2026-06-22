const load = require('../loader')

const { ascii, runCommands } = require('./common')

function reportDamage (input, verbose) {
  const commands = [
    'NOT B J',
    'NOT C T',
    'OR T J',
    'AND D J',
    'NOT A T',
    'OR T J',
    'WALK'
  ]
  const program = ascii([...input])
  runCommands(program, commands, verbose)
  const output = program.next().value
  if (verbose) process.stdout.write(output)
  return program.mode === 'o' && program.next().value
}

function reportDamage2 (input, verbose) {
  const commands = [
    'NOT B J',
    'NOT C T',
    'OR T J',
    'AND D J',
    'NOT E T',
    'NOT T T',
    'OR H T',
    'AND T J',
    'NOT A T',
    'OR T J',
    'RUN'
  ]
  const program = ascii([...input])
  runCommands(program, commands, verbose)
  const output = program.next().value
  if (verbose) process.stdout.write(output)
  return program.mode === 'o' && program.next().value
}

const test = load('day21', __dirname).split(',').map(Number)

console.log(reportDamage(test))
console.log(reportDamage2(test))
