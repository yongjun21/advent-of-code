function parseInput (input) {
  return input.trim().split('\n').map(line => {
    const match = line.split(' ')
    return {
      type: match[0],
      target: parseInt(match[1]) || match[1],
      source: parseInt(match[2]) || match[2]
    }
  })
}

function invoke (instructions, initial) {
  const registers = {a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0, '0': 0}
  Object.assign(registers, initial)

  let line = 0
  const invoked = {set: 0, sub: 0, mul: 0, jnz: 0}

  while (line >= 0 && line < instructions.length) {
    const instruction = instructions[line]

    switch (instruction.type) {
      case 'set':
        registers[instruction.target] = instruction.source in registers
          ? registers[instruction.source] : instruction.source
        break
      case 'sub':
        registers[instruction.target] -= instruction.source in registers
          ? registers[instruction.source] : instruction.source
        break
      case 'mul':
        registers[instruction.target] *= instruction.source in registers
          ? registers[instruction.source] : instruction.source
        break
      case 'jnz':
        const target = instruction.target in registers
          ? registers[instruction.target] : instruction.target
        const source = instruction.source in registers
          ? registers[instruction.source] : instruction.source
        if (target !== 0) line += source - 1
        break
    }
    invoked[instruction.type]++
    line++
  }

  return {registers, invoked}
}

function shortcut (instructions) {
  const {b: start, c: end} = invoke(instructions.slice(0, 8), {a: 1}).registers
  let notPrime = 0
  for (let i = start; i <= end; i += 17) {
    let factor = 0
    for (let j = 1; j <= i; j++) {
      if (i % j === 0) factor++
    }
    if (factor > 2) notPrime++
  }
  return notPrime
}

const test = `
set b 99
set c b
jnz a 2
jnz 1 5
mul b 100
sub b -100000
set c b
sub c -17000
set f 1
set d 2
set e 2
set g d
mul g e
sub g b
jnz g 2
set f 0
sub e -1
set g e
sub g b
jnz g -8
sub d -1
set g d
sub g b
jnz g -13
jnz f 2
sub h -1
set g b
sub g c
jnz g 2
jnz 1 3
sub b -17
jnz 1 -23
`

const instructions = parseInput(test)

console.log(invoke(instructions).invoked['mul'])
console.log(shortcut(instructions))
