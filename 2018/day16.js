const load = require('../loader')

const {operations} = require('./common')

function threeOrMore (input, operations) {
  return input.filter(sample => matchOperation(sample, operations).length >= 3).length
}

function execute (input, operations) {
  let registers = [0, 0, 0, 0]
  input.forEach(instruction => {
    const [opcode, a, b, c] = instruction
    registers = operations[opcode](registers, a, b, c)
  })
  return registers
}

function matchOpcode (input, operations) {
  const opnames = Object.keys(operations)
  const excluded = []
  input.forEach(sample => {
    const opcode = sample.opcode
    excluded[opcode] = excluded[opcode] || {}
    const matchedOperation = matchOperation(sample, operations)
    opnames.forEach(opname => {
      if (matchedOperation.includes(opname)) return
      excluded[opcode][opname] = 1
    })
  })

  const matched = []
  while (matched.length < opnames.length) {
    excluded.forEach((exclude, opcode) => {
      if (Object.keys(exclude).length === opnames.length - 1) {
        opnames.forEach(opname => {
          if (opname in exclude) return
          matched.push([opcode, opname])
          excluded.forEach(exclude => {
            exclude[opname] = 1
          })
        })
      }
    })
  }

  const op = []
  matched.forEach(([opcode, opname]) => {
    op[opcode] = operations[opname]
  })
  return op
}

function matchOperation (sample, operations) {
  const {a, b, c, before, after} = sample
  return Object.keys(operations).filter(key => {
    return operations[key]([...before], a, b, c).join(',') === after.join(',')
  })
}

function parseSample (block) {
  const match = block.match(/^Before: +\[(.+?)]\n(.+?)\nAfter: +\[(.+?)]/)
  const [opcode, a, b, c] = match[2].split(' ').map(Number)
  return {
    opcode,
    a,
    b,
    c,
    before: match[1].split(', ').map(Number),
    after: match[3].split(', ').map(Number)
  }
}

function parseInstruction (line) {
  return line.split(' ').map(Number)
}

const [samplesInput, testInput] = load('day16', __dirname).trim().split(/\n{3,}/)
const samples = samplesInput.split('\n\n').map(parseSample)
const test = testInput.split('\n').map(parseInstruction)

console.log(threeOrMore(samples, operations))
console.log(execute(test, matchOpcode(samples, operations))[0])
