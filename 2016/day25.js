const load = require('../loader')

function * clockSignal (input, initial) {
  const instructions = input.trim().split('\n').map(line => {
    const match = line.split(' ')
    return {
      type: match[0],
      x: parseInt(match[1]) || match[1],
      y: parseInt(match[2]) || match[2]
    }
  })

  const register = Object.assign({a: 0, b: 0, c: 0, d: 0, '0': 0}, initial)

  for (let i = 0; i >= 0 && i < instructions.length; i++) {
    const instruction = instructions[i]
    switch (instruction.type) {
      case 'cpy':
        register[instruction.y] = instruction.x in register ? register[instruction.x] : instruction.x
        break
      case 'jnz':
        if ((instruction.x in register ? register[instruction.x] : instruction.x) !== 0) {
          i += (instruction.y in register ? register[instruction.y] : instruction.y) - 1
        }
        break
      case 'inc':
        register[instruction.x]++
        break
      case 'dec':
        register[instruction.x]--
        break
      case 'out':
        yield instruction.x in register ? register[instruction.x] : instruction.x
    }
  }

  return register
}

function findClockSignal (input) {
  let n = 1
  while (true) {
    console.log(n)
    let expect = 0
    for (let signal of clockSignal(input, {a: n})) {
      if (signal !== expect) break
      expect = expect === 0 ? 1 : 0
    }
    n++
  }
}

const test = load('day25', __dirname)

findClockSignal(test, {a: 1})
