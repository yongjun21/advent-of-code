const load = require('../loader')

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

class Program {
  constructor (instructions, id) {
    this.instructions = instructions
    this.registers = {}
    this.mq = []
    this.line = 0
    this.sent = 0

    instructions.forEach(instruction => {
      if (typeof instruction.target === 'string') this.registers[instruction.target] = 0
      if (typeof instruction.source === 'string') this.registers[instruction.source] = 0
    })
    this.registers['p'] = id
  }

  play (mq) {
    while (this.line >= 0 && this.line < this.instructions.length) {
      const instruction = this.instructions[this.line]
      switch (instruction.type) {
        case 'snd':
          mq.push(this.registers[instruction.target] || instruction.target)
          this.sent++
          break
        case 'set':
          this.registers[instruction.target] = this.registers[instruction.source] || instruction.source
          break
        case 'add':
          this.registers[instruction.target] += this.registers[instruction.source] || instruction.source
          break
        case 'mul':
          this.registers[instruction.target] *= this.registers[instruction.source] || instruction.source
          break
        case 'mod':
          this.registers[instruction.target] = this.registers[instruction.target] % (this.registers[instruction.source] || instruction.source)
          break
        case 'rcv':
          if (this.mq.length === 0) return
          this.registers[instruction.target] = this.mq.shift()
          break
        case 'jgz':
          if ((this.registers[instruction.target] || instruction.target) > 0) {
            this.line += (this.registers[instruction.source] || instruction.source) - 1
          }
          break
      }
      this.line++
    }
  }
}

function playSingle (input) {
  const instructions = parseInput(input)
  const program = new Program(instructions, 0)
  const mq = []
  program.play(mq)
  return mq[mq.length - 1]
}

function playDuet (input) {
  const instructions = parseInput(input)
  const p0 = new Program(instructions, 0)
  const p1 = new Program(instructions, 1)

  do {
    p0.play(p1.mq)
    p1.play(p0.mq)
  } while (p0.mq.length > 0 || p1.mq.length > 0)

  return p1.sent
}

const test = load('day18', __dirname)

console.log(playSingle(test))
console.log(playDuet(test))
