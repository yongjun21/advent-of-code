const {operations} = require('./common')

function execute (input, pointer, operations, debug) {
  let ip = 0
  const registers = [0, 0, 0, 0, 0, 0]

  Object.keys(operations).forEach(opcode => {
    operations[opcode] = observe(operations[opcode])
  })

  let pass = 1
  let last
  const memo = new Set()

  while (ip >= 0 && ip < input.length) {
    registers[pointer] = ip
    const [opcode, a, b, c] = input[ip]
    operations[opcode](registers, a, b, c)
    if (debug === 1) {
      if (operations[opcode]._called.get.includes('0')) debugger
    } else if (debug === 2 && ip === 12) {
      if (pass++ % 3 === 0) {
        if (memo.has(registers[3])) {
          registers[3] = last
          debugger
        }
        last = registers[3]
        memo.add(registers[3])
        registers[pointer] = 5
      } else {
        registers[5] = Math.floor(registers[5] / 256)
        registers[pointer] = 7
      }
    }

    ip = registers[pointer] + 1
  }
  return registers
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

const test = `
seti 123 0 3
bani 3 456 3
eqri 3 72 3
addr 3 1 1
seti 0 0 1
seti 0 9 3
bori 3 65536 5
seti 15028787 4 3
bani 5 255 2
addr 3 2 3
bani 3 16777215 3
muli 3 65899 3
bani 3 16777215 3
gtir 256 5 2
addr 2 1 1
addi 1 1 1
seti 27 3 1
seti 0 9 2
addi 2 1 4
muli 4 256 4
gtrr 4 5 4
addr 4 1 1
addi 1 1 1
seti 25 1 1
addi 2 1 2
seti 17 8 1
setr 2 4 5
seti 7 3 1
eqrr 3 0 2
addr 2 1 1
seti 5 3 1
`.trim().split('\n').map(parseInstruction)

// execute(test, 1, operations, 1)
// execute(test, 1, operations, 2)
