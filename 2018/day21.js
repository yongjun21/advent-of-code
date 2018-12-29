/* eslint-disable no-unused-vars, no-multi-spaces */

const {operations} = require('./common')

function fewestInstructions (input, pointer, operations, executor) {
  const registers = [0, 0, 0, 0, 0, 0]
  const executable = executor(input, pointer, operations, registers)

  let next
  do {
    next = executable.next()
    if (next.value === 28) return registers[3]
  } while (!next.done)
}

function mostInstructions (input, pointer, operations, executor) {
  const registers = [0, 0, 0, 0, 0, 0]
  const executable = executor(input, pointer, operations, registers)

  let pass = 1
  let last
  const memo = new Set()

  let next
  do {
    next = executable.next()
    if (next.value === 12) {
      if (pass++ % 3 === 0) {
        if (memo.has(registers[3])) return last
        last = registers[3]
        memo.add(registers[3])
        registers[pointer] = 5
      } else {
        registers[5] = Math.floor(registers[5] / 256)
        registers[pointer] = 7
      }
    }
  } while (!next.done)
}

function * getExecutable (input, pointer, operations, registers) {
  let ip = 0
  while (ip >= 0 && ip < input.length) {
    registers[pointer] = ip
    const [opcode, a, b, c] = input[ip]
    operations[opcode](registers, a, b, c)
    yield ip
    ip = registers[pointer] + 1
  }
}

function observe (fn, obj) {
  return function wrapped () {
    arguments[0] = new Proxy(arguments[0], {
      get (obj, prop) {
        wrapped._called.get.push(prop)
        return obj[prop]
      },
      set (obj, prop, value) {
        wrapped._called.set.push(prop)
        obj[prop] = value
      }
    })
    wrapped._called = {get: [], set: []}
    return fn.apply(this, arguments)
  }
}

function parseInstruction (line) {
  return line.split(' ').map((v, i) => i > 0 ? Number(v) : v)
}

const test = [
  'seti 123 0 3',         // 0  >  L0-5
  'bani 3 456 3',         // 1  |  Test bani
  'eqri 3 72 3',          // 2  |
  'addr 3 1 1',           // 3  |
  'seti 0 0 1',           // 4  |
  'seti 0 9 3',           // 5  |
  'bori 3 65536 5',       // 6  >  R5 = R3 | 2^16 (R5 is at least 17 bits long)
  'seti 15028787 4 3',    // 7  >  R3 = 15028787
  'bani 5 255 2',         // 8  >  R2 = R5 & 2^8-1 (take only last 8 bits)
  'addr 3 2 3',           // 9  >  R3 += R2
  'bani 3 16777215 3',    // 10 > R3 = R3 & 2^24-1 (take only last 24 bits)
  'muli 3 65899 3',       // 11 > R3 *= 65899
  'bani 3 16777215 3',    // 12 > R3 = R3 & 2^24-1 (take only last 24 bits)
  'gtir 256 5 2',         // 13 >  L13-16
  'addr 2 1 1',           // 14 |  if (R5 >= 256) goto L17
  'addi 1 1 1',           // 15 |  else goto L28
  'seti 27 3 1',          // 16 |
  'seti 0 9 2',           // 17 >  R2 = 0
  'addi 2 1 4',           // 18 >  R4 = R2 + 1
  'muli 4 256 4',         // 19 >  R4 = R4 * 256
  'gtrr 4 5 4',           // 20 >  L20-23
  'addr 4 1 1',           // 21 |  if (R5 >= R4) goto L24
  'addi 1 1 1',           // 22 |  else goto L26
  'seti 25 1 1',          // 23 |
  'addi 2 1 2',           // 24 >  R2++
  'seti 17 8 1',          // 25 >  goto L18
  'setr 2 4 5',           // 26 >  R5 = R2
  'seti 7 3 1',           // 27 >  goto L8
  'eqrr 3 0 2',           // 28 >  if (R3 === R0) exit
  'addr 2 1 1',           // 29 |  else goto L6
  'seti 5 3 1'            // 30 |
].map(parseInstruction)

/*
Additional:
- L13-27 >  R5 = Math.floor(R5 / 256) (remove last 8 bits)
- L7-12  >  Loop exactly 3 times
*/

console.log(fewestInstructions(test, 1, operations, getExecutable))
console.log(mostInstructions(test, 1, operations, getExecutable))
