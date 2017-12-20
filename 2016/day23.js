function crackSafe (input, initial) {
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
        if (instruction.y in register) {
          register[instruction.y] = instruction.x in register ? register[instruction.x] : instruction.x
        }
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
      case 'tgl':
        const offset = instruction.x in register ? register[instruction.x] : instruction.x
        if ((i + offset < 0) || (i + offset >= instructions.length)) break
        if (instructions[i + offset].y == null) {
          if (instructions[i + offset].type === 'inc') instructions[i + offset].type = 'dec'
          else instructions[i + offset].type = 'inc'
        } else {
          if (instructions[i + offset].type === 'jnz') instructions[i + offset].type = 'cpy'
          else instructions[i + offset].type = 'jnz'
        }
        break
    }
  }

  return register
}

const test = `
cpy a b
dec b
cpy a d
cpy 0 a
cpy b c
inc a
dec c
jnz c -2
dec d
jnz d -5
dec b
cpy b c
cpy c d
dec d
inc c
jnz d -2
tgl c
cpy -16 c
jnz 1 c
cpy 86 c
jnz 78 d
inc a
inc d
jnz d -2
inc c
jnz c -5
`

console.log(crackSafe(test, {a: 7}))
console.log(crackSafe(test, {a: 12}))
