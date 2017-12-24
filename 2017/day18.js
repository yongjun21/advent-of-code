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

const test = `
set i 31
set a 1
mul p 17
jgz p p
mul a 2
add i -1
jgz i -2
add a -1
set i 127
set p 618
mul p 8505
mod p a
mul p 129749
add p 12345
mod p a
set b p
mod b 10000
snd b
add i -1
jgz i -9
jgz a 3
rcv b
jgz b -1
set f 0
set i 126
rcv a
rcv b
set p a
mul p -1
add p b
jgz p 4
snd a
set a b
jgz 1 3
snd b
set f 1
add i -1
jgz i -11
snd a
jgz f -16
jgz a -19
`

console.log(playSingle(test))
console.log(playDuet(test))
