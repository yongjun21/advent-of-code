/* eslint-disable no-multi-spaces */
const {operations} = require('./common')

function execute (input, pointer, operations, initial) {
  let ip = 0
  let registers = initial
  while (ip >= 0 && ip < input.length) {
    registers[pointer] = ip
    if (ip === 1) break
    const [opcode, a, b, c] = input[ip]
    registers = operations[opcode](registers, a, b, c)
    ip = registers[pointer] + 1
  }
  return registers
}

function shortcut (input, pointer, operations, initial = [0, 0, 0, 0, 0, 0]) {
  const loops = execute(input, pointer, operations, initial)[4]
  let sum = 0
  for (let i = 1; i <= loops; i++) {
    if (loops % i === 0) sum += i
  }
  return sum
}

function parseInstruction (line) {
  return line.split(' ').map((v, i) => i > 0 ? Number(v) : v)
}

const test = [
  'addi 2 16 2',    // 0  >  goto L17
  'seti 1 1 1',     // 1  >  R1 = 1
  'seti 1 4 3',     // 2  >  R3 = 1
  'mulr 1 3 5',     // 3  >  R5 = R1 * R3
  'eqrr 5 4 5',     // 4  >  L4-7
  'addr 5 2 2',     // 5  |  if (R4 === R5) R0 += R1
  'addi 2 1 2',     // 6  |  goto L8
  'addr 1 0 0',     // 7  |
  'addi 3 1 3',     // 8  >  R3++
  'gtrr 3 4 5',     // 9  >  L9-11
  'addr 2 5 2',     // 10 |  if (R3 > R4) goto L12
  'seti 2 4 2',     // 11 |  else goto L3
  'addi 1 1 1',     // 12 >  R1++
  'gtrr 1 4 5',     // 13 >  L13-16
  'addr 5 2 2',     // 14 |  if (R1 > R4) exit
  'seti 1 0 2',     // 15 |  else goto L2
  'mulr 2 2 2',     // 16 |
  'addi 4 2 4',     // 17 >  L17-24
  'mulr 4 4 4',     // 18 |  R4 = 875
  'mulr 2 4 4',     // 19 |
  'muli 4 11 4',    // 20 |
  'addi 5 1 5',     // 21 |
  'mulr 5 2 5',     // 22 |
  'addi 5 17 5',    // 23 |
  'addr 4 5 4',     // 24 |
  'addr 2 0 2',     // 25 >  L25-26
  'seti 0 9 2',     // 26 |  if (R0 === 1) goto L27 else goto L1
  'setr 2 3 5',     // 27 >  L27-33
  'mulr 5 2 5',     // 28 |  R4 = 10551275
  'addr 2 5 5',     // 29 |
  'mulr 2 5 5',     // 30 |
  'muli 5 14 5',    // 31 |
  'mulr 5 2 5',     // 32 |
  'addr 4 5 4',     // 33 |
  'seti 0 9 0',     // 34 >  R0 = 0
  'seti 0 6 2'      // 35 >  goto L1
].map(parseInstruction)

/*
Additional:
- L3-11  >  Loop R4 times
- L2-16  >  Loop R4 times
- L4-7   >  if R1 is a factor of R4, accumulate value at R0
*/

console.log(shortcut(test, 2, operations))
console.log(shortcut(test, 2, operations, [1, 0, 0, 0, 0, 0]))
