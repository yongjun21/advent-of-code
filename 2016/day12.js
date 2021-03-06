function setRegister (input, initial) {
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
console.log(setRegister(test, {c: 1}))
