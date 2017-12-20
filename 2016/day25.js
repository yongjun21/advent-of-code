function* clockSignal (input, initial) {
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

const test = `
cpy a d
cpy 4 c
cpy 633 b
inc d
dec b
jnz b -2
dec c
jnz c -5
cpy d a
jnz 0 0
cpy a b
cpy 0 a
cpy 2 c
jnz b 2
jnz 1 6
dec b
dec c
jnz c -4
inc a
jnz 1 -7
cpy 2 b
jnz c 2
jnz 1 4
dec b
dec c
jnz 1 -4
jnz 0 0
out b
jnz a -19
jnz 1 -21
`

findClockSignal(test, {a: 1})
