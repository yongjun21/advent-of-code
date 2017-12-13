function parseInput (input) {
  return input.trim().split('\n').map(line => {
    const match = line.match(/^(cpy|jnz|inc|dec) ([a-z0-9]+)( (\S+))?$/)
    switch (match[1]) {
      case 'cpy':
        return {
          type: 'cpy',
          target: match[4],
          source: parseInt(match[2]) || match[2]
        }
      case 'jnz':
        return {
          type: 'jnz',
          check: parseInt(match[2]) || match[2],
          step: parseInt(match[4]) || match[4]
        }
      case 'inc':
        return {
          type: 'inc',
          target: match[2]
        }
      case 'dec':
        return {
          type: 'dec',
          target: match[2]
        }
    }
  })
}

function setRegister (input, initial = {a: 0, b: 0, c: 0, d: 0}) {
  const instructions = parseInput(input)

  const register = initial

  for (let i = 0, instruction = instructions[0]; i < instructions.length; instruction = instructions[++i]) {
    switch (instruction.type) {
      case 'cpy':
        register[instruction.target] = instruction.source in register ? register[instruction.source] : instruction.source
        break
      case 'jnz':
        if ((instruction.check in register ? register[instruction.check] : instruction.check) !== 0) {
          i += (instruction.step in register ? register[instruction.step] : instruction.step) - 1
        }
        break
      case 'inc':
        register[instruction.target]++
        break
      case 'dec':
        register[instruction.target]--
        break
    }
  }

  return register
}

const test = `
cpy 1 a
cpy 1 b
cpy 26 d
jnz c 2
jnz 1 5
cpy 7 c
inc d
dec c
jnz c -2
cpy a c
inc a
dec b
jnz b -2
cpy c b
dec d
jnz d -6
cpy 13 c
cpy 14 d
inc a
dec d
jnz d -2
dec c
jnz c -5
`

console.log(setRegister(test))
console.log(setRegister(test, {a: 0, b: 0, c: 1, d: 0}))
