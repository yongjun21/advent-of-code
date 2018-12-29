/* eslint-disable no-multi-spaces */

function parse (line) {
  const match = line.split(' ')
  return {
    type: match[0],
    target: parseInt(match[1]) || match[1],
    source: parseInt(match[2]) || match[2]
  }
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

const test = [
  'set b 99',         // 0  >  b = 99, c = 99
  'set c b',          // 1  |
  'jnz a 2',          // 2  >  if (a === 0) goto L8
  'jnz 1 5',          // 3  |  else goto L4
  'mul b 100',        // 4  >  b = 109900, c = 126900
  'sub b -100000',    // 5  |
  'set c b',          // 6  |
  'sub c -17000',     // 7  |
  'set f 1',          // 8  >  f = 1
  'set d 2',          // 9  >  d = 2
  'set e 2',          // 10 >  e = 2
  'set g d',          // 11 >  if (d * e === b) f = 0
  'mul g e',          // 12 |
  'sub g b',          // 13 |
  'jnz g 2',          // 14 |
  'set f 0',          // 15 |
  'sub e -1',         // 16 >  e++
  'set g e',          // 17 >  if (e !== b) goto L11
  'sub g b',          // 18 |
  'jnz g -8',         // 19 |
  'sub d -1',         // 20 >  d++
  'set g d',          // 21 >  if (d !== b) goto L10
  'sub g b',          // 22 |
  'jnz g -13',        // 23 |
  'jnz f 2',          // 24 >  if (f === 0) h++
  'sub h -1',         // 25 |
  'set g b',          // 26 >  if (b === c) exit
  'sub g c',          // 27 |  else b += 17, goto L8
  'jnz g 2',          // 28 |
  'jnz 1 3',          // 29 |
  'sub b -17',        // 30 |
  'jnz 1 -23'         // 31 |
].map(parse)

/*
Additional:
- L11-19 >  Loop e in range(2, b - 1, 1)
- L10-23 >  Loop d in range(2, b - 1, 1)
- L8-31  >  Loop b in range(b, c, 17)
- L11-15 >  f = 0 if notPrime(b)
*/

console.log(invoke(test).invoked['mul'])
console.log(shortcut(test))
