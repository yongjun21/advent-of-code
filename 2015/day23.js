const load = require('../loader')

function execute (input, initial = {a: 0, b: 0}) {
  const instructions = input.trim().split('\n').map(line => {
    const match = line.slice(4).split(', ')
    const type = line.slice(0, 3)
    let target, offset
    if (type === 'jmp') offset = +match[0]
    else target = match[0]
    if (match[1]) offset = +match[1]
    return {type, target, offset}
  })

  const registers = Object.assign({}, initial)

  for (let i = 0; i >= 0 && i < instructions.length; i++) {
    const instruction = instructions[i]
    switch (instruction.type) {
      case 'hlf':
        registers[instruction.target] /= 2
        break
      case 'tpl':
        registers[instruction.target] *= 3
        break
      case 'inc':
        registers[instruction.target] += 1
        break
      case 'jmp':
        i += instruction.offset - 1
        break
      case 'jie':
        if (registers[instruction.target] % 2 === 0) i += instruction.offset - 1
        break
      case 'jio':
        if (registers[instruction.target] === 1) i += instruction.offset - 1
        break
    }
  }

  return registers
}

const test = load('day23', __dirname)

console.log(execute(test))
console.log(execute(test, {a: 1, b: 0}))
