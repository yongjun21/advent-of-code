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

const test = `
addi 2 16 2
seti 1 1 1
seti 1 4 3
mulr 1 3 5
eqrr 5 4 5
addr 5 2 2
addi 2 1 2
addr 1 0 0
addi 3 1 3
gtrr 3 4 5
addr 2 5 2
seti 2 4 2
addi 1 1 1
gtrr 1 4 5
addr 5 2 2
seti 1 0 2
mulr 2 2 2
addi 4 2 4
mulr 4 4 4
mulr 2 4 4
muli 4 11 4
addi 5 1 5
mulr 5 2 5
addi 5 17 5
addr 4 5 4
addr 2 0 2
seti 0 9 2
setr 2 3 5
mulr 5 2 5
addr 2 5 5
mulr 2 5 5
muli 5 14 5
mulr 5 2 5
addr 4 5 4
seti 0 9 0
seti 0 6 2
`.trim().split('\n').map(parseInstruction)

console.log(shortcut(test, 2, operations))
console.log(shortcut(test, 2, operations, [1, 0, 0, 0, 0, 0]))
